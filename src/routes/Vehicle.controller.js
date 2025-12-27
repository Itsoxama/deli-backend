
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vehicle = require("../models/Vehicle.model");
// Register Vehicle
const registerVehicle = async (req, res) => {
  try {
 

  

    const newVehicle = new Vehicle({...req.body,status:'active'});

    await newVehicle.save();
    res.status(201).json({ message: "Account created successfully. Status: pending" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllVehicles = async (req, res) => {
  try {
    const Vehicles = await Vehicle.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(Vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getVehiclesByPage = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [Vehicles, total] = await Promise.all([
      Vehicle.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Vehicle.countDocuments()
    ]);

    res.status(200).json({
      data: Vehicles,
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


module.exports = {
  registerVehicle,getAllVehicles,getVehiclesByPage
};
