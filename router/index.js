const router = require('express').Router();

const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const AdminRouter = require("./AdminRouter");

router.use(UserRouter);
router.use(ProductRouter);
router.use(OrderRouter);
router.use(AdminRouter);

module.exports = router;
