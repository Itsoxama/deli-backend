const express = require("express");
const { registerComp, loginComp } = require("./Comp.controller.js");
const { protect } = require("../utils/auth.js");

const router = express.Router();

router.get("/api/comp/add", registerComp);

router.post("/api/comp/login", loginComp);




module.exports = router;
