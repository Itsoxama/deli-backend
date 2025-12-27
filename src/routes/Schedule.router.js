const express = require("express");
const { addSchedule, getallSchedules, route,getSchByDate, getSchByDriver, getScheduleStats, getSchByPage, getDeliveryStats, updateSchedule } = require("./Schedule.controller.js");
const { protect } = require("../utils/auth.js");
const { verifyToken } = require("../utils/token.js");

const router = express.Router();

router.post("/api/schedule/add", addSchedule);
router.post("/api/schedule/deliverystats", getDeliveryStats);
router.get("/api/schedule/getall", getallSchedules);
router.post("/api/schedule/getbydate", getSchByDate);
router.post("/api/schedule/getbypage", getSchByPage);
router.post("/api/schedule/getstats", getScheduleStats);



router.post("/api/schedule/update", updateSchedule);
router.post("/api/schedule/getbydriver",verifyToken, getSchByDriver);



module.exports = router;
