const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const store = require("store");

const { auth_user, auth_admin } = require("../middlware/auth");
const User = require("../model/User");
const Order = require("../model/Order");

router.get('/adminorder', async function(req, res) {
    const orders = await Order.find({ status: "pending" });

    res.render('adminorder', {
        orders: orders
    });
});

router.post('/adminorder', async function(req, res) {
    await Order.findByIdAndUpdate(req.body.id, {
        status: req.body.status
    });

    res.redirect('/adminorder');
});

router.get('/adminuser', async function(req, res) {
    const users = await User.find({});
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user['username'] === "admin") {
            users.splice(i, 1);
        }
    }

    res.render('adminuser', {
        users: users
    })
});

router.get('/adminhistory/:userId', async function(req, res) {
    const orders = await Order.find({ userId: req.params.userId });

    res.render('adminhistory', {
        orders: orders
    })
});

module.exports = router;