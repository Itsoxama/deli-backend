const express = require("express");
const { registerDriver, getAllDrivers, loginDriver,getDriversByPage, getDriverStats, updateDriver } = require("./Driver.controller.js");
const { protect } = require("../utils/auth.js");
const { verifyAdminToken } = require("../utils/token.js");

const router = express.Router();

router.post("/api/driver/add",verifyAdminToken, registerDriver);
router.post("/api/driver/update",verifyAdminToken, updateDriver);
router.post("/api/driver/login", loginDriver);
router.post("/api/driver/getbypage",verifyAdminToken, getDriversByPage);
router.post("/api/driver/stats",verifyAdminToken, getDriverStats);
router.post("/api/driver/getall",verifyAdminToken,getAllDrivers);


module.exports = router;
