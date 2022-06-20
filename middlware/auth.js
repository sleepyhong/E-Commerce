const User = require('../model/User');

const jwt = require("jsonwebtoken");

const auth_user = async function(req, res, next) {
    const token = req.cookies.JWT;
    if (!token) {
        res.redirect('/login');
    }
    else {
        try {
            jwt.verify(token, process.env.JWT_KEY);
            next();
        }
        catch(error) {
            res.status(401);
            res.send(e);
        }
    }
};

const auth_admin = async function(req, res, next) {
    const token = req.cookies.JWT;
    if (token) {
        try {
            const user = await User.findById(jwt.verify(token, process.env.JWT_KEY));
            if (user['username'] === 'admin') {
                res.redirect('/adminorder');
            }
            else {
                next();
            }
        }
        catch(error) {
            res.status(401);
            res.send(e);
        }
    }
    else {
        next();
    }
}

module.exports = { auth_user, auth_admin };