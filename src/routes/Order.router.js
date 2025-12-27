const express = require("express");
const { addOrder, getallOrders,getOrderByDate, drivergetOrderByDate, getOrdersByPage, getOrderStats, markOrdersPaid, getOrderStatsOverMonth, getRevenueStatsOverTime, getOrderStatsOverCustom, getRevStatsOverCustom } = require("./Order.controller.js");
const { protect } = require("../utils/auth.js");
const { verifyToken } = require("../utils/token.js");

const router = express.Router();

router.post("/api/order/add",verifyToken, addOrder);

router.post("/api/order/getorderbydate", getOrderByDate);
router.post("/api/order/getbypage", getOrdersByPage);


router.post("/api/order/orderstats", getOrderStats);

router.get("/api/order/monthlystats", getOrderStatsOverMonth);
router.post("/api/order/customorders", getOrderStatsOverCustom);
router.post("/api/order/customrevenue", getRevStatsOverCustom);

router.post("/api/order/revstats", getRevenueStatsOverTime);
router.post("/api/order/updatestatus", markOrdersPaid);


router.post("/api/order/drivergetorderbydate",verifyToken, drivergetOrderByDate);
router.get("/api/order/getall", getallOrders);


module.exports = router;
