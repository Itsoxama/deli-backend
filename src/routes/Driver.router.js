const express = require("express");
const { registerDriver, getAllDrivers, loginDriver,getDriversByPage, getDriverStats } = require("./Driver.controller.js");
const { protect } = require("../utils/auth.js");

const router = express.Router();

router.post("/api/driver/add", registerDriver);

router.post("/api/driver/login", loginDriver);
router.post("/api/driver/login", loginDriver);
router.post("/api/driver/getbypage", getDriversByPage);


router.get("/api/driver/stats", getDriverStats);
router.get("/api/driver/getall", getAllDrivers);


module.exports = router;
