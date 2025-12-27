const express = require("express");
const { registerCustomer, getAllCustomers,getCustomersByPage,addSingleToAllOrders, getAllStats, getCustomerStats, overviewCustomers } = require("./Customer.controller.js");
const { protect } = require("../utils/auth.js");

const router = express.Router();

router.post("/api/cust/add", registerCustomer);

router.post("/api/cust/allstats", getAllStats);

router.get("/api/cust/customcall", addSingleToAllOrders);
router.post("/api/cust/growthstats", getCustomerStats);

router.post("/api/cust/overview", overviewCustomers);


router.get("/api/cust/getall", getAllCustomers);
router.post("/api/cust/getcustbypage", getCustomersByPage);




module.exports = router;
