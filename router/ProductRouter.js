const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const store = require("store");

const { auth_user, auth_admin } = require("../middlware/auth");
const User = require("../model/User");
const Product = require("../model/Product");
const Order = require("../model/Order");

router.get('/', function(req, res) {
    res.redirect('/home');
});

router.get('/home', auth_admin, async function(req, res) {
    try {
        const products = await Product.find({});

        const brands = {};
        for(let product of products) {
            product['name'] = product['name'].replace(" ", "_").toLowerCase();
            const brand = product['brand'];

            if (!(brand in brands)) {
                brands[brand] = [product];
                continue;
            }
            brands[brand].push(product);
        }

        res.render('home', {
            loggedIn: req.cookies.JWT ? true : false,
            brands: brands
        });
    }
    catch(error) {
        res.send(error);
    }
});

router.get('/product/:productId', async function(req, res) {
    try {
        const product = await Product.findById(req.params.productId);
        const originalName = product['name'];
        product['name'] = product['name'].replace(" ", "_").toLowerCase();
        
        const reviews = [];
        for (let review of product['reviews']) {
            const user = await User.findById(review['reviewer']).clone();
            reviews.push({
                username: user['username'],
                comment: review['comment']
            });
        }

        res.render('product', {
            loggedIn: req.cookies.JWT ? true : false,
            originalName: originalName,
            product: product,
            reviews: reviews
        });
    }
    catch(error) {
        res.send(error);
    }
});

router.post('/product/:productId', auth_user, async function(req, res) {
    const items = store.get('cartItems') ? store.get('cartItems') : [];

    let itemExist = false;
    for (let item of items) {
        if (item['_id'] === req.params.productId) {
            item['quantity'] = Number(item['quantity']) + Number(req.body.quantity);
            itemExist = true;
            break;
        }
    }
    if (!itemExist) {
        items.push({
            _id: req.params.productId,
            quantity: req.body.quantity
        });
    }
    store.set('cartItems', items);

    res.redirect('/cart');
});

router.post('/review/:productId', auth_user, async function(req, res) {
    try {
        const userId = jwt.verify(req.cookies.JWT, process.env.JWT_KEY);
        const productId = req.params.productId;
        const review = req.body.review;
        await Product.findByIdAndUpdate(productId, {
            $push: { 
                reviews: {
                    reviewer: userId,
                    comment: review
                }
            }
        });
        res.redirect(`/product/${productId}`);
    }
    catch(error) {
        console.log(error);
    }
});

router.get('/cart', auth_admin, async function(req, res) {
    try {
        const items = store.get('cartItems') ? store.get('cartItems') : [];
        const itemInfo = [];
        let totalPrice = 0;
        for (let item of items) {
            const info = await Product.findById(item['_id']);
            info['quantity'] = item['quantity'];

            itemInfo.push(info);
            totalPrice += info['quantity'] * info['price'];
        }
    
        res.render('cart', {
            loggedIn: req.cookies.JWT ? true : false,
            items: itemInfo,
            totalPrice: totalPrice.toFixed(2)
        });
    }
    catch (error) {
        console.log(error);
    }
});

router.post('/cart', async function(req, res) {
    await Order.create({
        userId: jwt.verify(req.cookies.JWT, process.env.JWT_KEY),
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        payment: req.body.payment,
        date: Date.now(),
        products: store.get('cartItems'),
        status: "pending"
    });

    res.redirect('/orders');
});

module.exports = router;