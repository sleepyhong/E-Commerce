const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const store = require("store");

const { auth_user, auth_admin } = require("../middlware/auth");
const Order = require("../model/Order");

router.get('/orders', auth_user, async function(req, res) {
    const orders = await Order.find({ userId: jwt.verify(req.cookies.JWT, process.env.JWT_KEY)});

    for (let order of orders) {
        order['us-date'] = order['date'].toLocaleDateString("en-US");
    }

    res.render('order', {
        loggedIn: req.cookies.JWT ? true : false,
        orders: orders
    });
});

module.exports = router;