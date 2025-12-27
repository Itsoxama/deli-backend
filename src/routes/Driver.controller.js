
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver.model");
const { generateToken } = require("../utils/token");
const Schedule = require("../models/Schedule.model");
const ScheduleModel = require("../models/Schedule.model");
// Register Driver
const registerDriver = async (req, res) => {
  try {
 

  

    const newDriver = new Driver({...req.body,status:'active'});

    await newDriver.save();
    res.status(201).json({ message: "Account created successfully. Status: pending" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

const loginDriver = async (req, res) => {

    console.log(req.body)

  try {
    const { phone, pass } = req.body;

    const driver = await Driver.findOne({ phone });
    if (!driver) return res.status(404).json({ message: "User not found" });

    if (driver.pass !== pass)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ id: driver._id, phone: driver.phone });
console.log(token)
    res.json({
      message: "Login successful",
      token,
      driver: { id: driver._id, phone: driver.phone },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};
const getAllDrivers = async (req, res) => {
  try {
    const Drivers = await Driver.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(Drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDriversByPage = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [drivers, total] = await Promise.all([
      Driver.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Driver.countDocuments()
    ]);

    res.status(200).json({
      data: drivers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDriverStats = async (req, res) => {
  try {
    const [driverCount, scheduleCount, salaryResult] = await Promise.all([
      Driver.countDocuments(),
      Schedule.countDocuments(),
      Driver.aggregate([
        {
          $group: {
            _id: null,
            totalSalary: {
              $sum: {
                $toDouble: "$pay"   // 👈 string to number
              }
            }
          }
        }
      ])
    ]);

    const totalSalary =
      salaryResult.length > 0 ? salaryResult[0].totalSalary : 0;

    const division =
      driverCount > 0 ? scheduleCount / driverCount : 0;

    res.status(200).json({
      routePerDriver: division,
      salary: totalSalary
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  registerDriver,getAllDrivers,
  loginDriver,getDriversByPage,getDriverStats
};
