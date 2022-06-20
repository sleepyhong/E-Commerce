const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

router.get('/login', function(req, res) {
    if (req.cookies.JWT) {
        res.redirect('/home');
    }
    else {
        res.render('login');
    }
});

router.post('/login', async function(req, res) {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username: username});
        
        if (! await bcrypt.compare(password, user['password'])) {
            throw new Error("Incorrect username or password");
        }
        
        const userJwt = jwt.sign(user['_id'].valueOf(), process.env.JWT_KEY);
        res.cookie('JWT', userJwt);
        res.redirect('/home');
    }
    catch(error) {
        res.render('login', {
            error: "Incorrect username or password!"
        });
    }
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', async function(req, res) {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
        await User.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        res.redirect('/home');
    }
    catch(error) {
        if (error['code']) {
            res.render('register', {
                error: "The account with the username or email already exists!"
            });
        }
    }
});

router.get('/logout', function(req, res) {
    res.clearCookie('JWT');
    res.redirect('/home');
});

module.exports = router;
