const express = require("express");
const { registerVehicle, getAllVehicles, getVehiclesByPage } = require("./Vehicle.controller.js");
const { protect } = require("../utils/auth.js");

const router = express.Router();

router.post("/api/veh/add", registerVehicle);


router.post("/api/veh/getbypage", getVehiclesByPage);

router.get("/api/veh/getall", getAllVehicles);


module.exports = router;
