const express = require("express");
const { startShift, getallShifts,getActiveShift,getShiftsByDate, endShift } = require("./Shift.controller.js");
const { protect } = require("../utils/auth.js");
const { verifyToken } = require("../utils/token.js");

const router = express.Router();

router.post("/api/shift/start",verifyToken, startShift);

router.post("/api/shift/end",verifyToken, endShift);

router.get("/api/shift/getall", getallShifts);

router.post("/api/shift/checkactive",verifyToken, getActiveShift);

router.post("/api/shift/getbydate", getShiftsByDate);


module.exports = router;
