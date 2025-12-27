const express = require("express");
const { addproduct,getbyids, getallproducts, getProductsByPage } = require("./Product.controller.js");
const { protect } = require("../utils/auth.js");

const router = express.Router();

router.post("/api/product/add", addproduct);
router.post("/api/product/getbyids", getbyids);
router.post("/api/product/getbypage", getProductsByPage);
router.get("/api/product/getall", getallproducts);


module.exports = router;
