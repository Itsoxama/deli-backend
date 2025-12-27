
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product.model");
// Register Product
const addproduct = async (req, res) => {
  try {
 

  

    const newProduct = new Product({...req.body,status:"active"});

    await newProduct.save();
    res.status(201).json({ message: "Account created successfully. Status: pending" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getallproducts = async (req, res) => {
  try {
    const Products = await Product.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(Products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getbyids = async (req, res) => {
  try {
    const { ids } = req.body; // array of ids from frontend

    const products = await Product.find({
      _id: { $in: ids }
    }).sort({ createdAt: -1 });

    res.status(200).json(products);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getProductsByPage = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [Products, total] = await Promise.all([
      Product.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments()
    ]);

    res.status(200).json({
      data: Products,
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
  addproduct,getallproducts,getbyids,getProductsByPage
};
