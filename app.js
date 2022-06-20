const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require("path");

require('dotenv').config();

const routes = require("./router");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(routes);

module.exports = app;