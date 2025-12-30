const express = require("express");
const { addproduct,getbyids, getallproducts, getProductsByPage, updateProduct } = require("./Product.controller.js");
const { protect } = require("../utils/auth.js");
const { verifyAdminToken } = require("../utils/token.js");

const router = express.Router();

router.post("/api/product/add",verifyAdminToken, addproduct);
router.post("/api/product/update",verifyAdminToken, updateProduct);
router.post("/api/product/getbyids", getbyids);
router.post("/api/product/getbypage",verifyAdminToken, getProductsByPage);
router.post("/api/product/getall",verifyAdminToken, getallproducts);


module.exports = router;
