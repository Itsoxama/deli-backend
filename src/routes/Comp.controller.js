
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Comp = require("../models/Comp.model");
const { generateToken } = require("../utils/token");

// Register Comp
const registerComp = async (req, res) => {
  try {

    const hashedPassword = await bcrypt.hash("1234", 10);
    const newComp = new Comp({
      name: "ABC Water Delivery",
      logo: "https://firebasestorage.googleapis.com/v0/b/lawyers-806e6.appspot.com/o/images%2FScreenshot%202025-11-17%20at%206.32.13%E2%80%AFPM.png?alt=media&token=37c26651-5429-4381-aada-e9b4375c80cf",
      phone: "03001234567",
      email: "admin@abc.com",
      password: hashedPassword // ⚠️ hash in real apps
    });

    await newComp.save();

    res.status(201).json({
      message: "Account created successfully",
      company: newComp
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const loginComp = async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;

    // 1. Check input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required2" });
    }

    // 2. Find company
    const comp = await Comp.findOne({ email });
    if (!comp) {
          console.log("err")
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Compare password
    console.log(comp)
    const isMatch = await bcrypt.compare(password, comp.password);
    if (!isMatch) {
      console.log("fgh")
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Create token
    
    const token = generateToken({ id: comp._id, email: comp.email })
    

    // 5. Response
    res.status(200).json({
      message: "Login successful",
      token,
      company: {
        id: comp._id,
        name: comp.name,
        email: comp.email,
        phone: comp.phone,
        logo: comp.logo
      }
    });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};



const getAllComps = async (req, res) => {
  try {
    const Comps = await Comp.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(Comps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getCompsByPage = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [Comps, total] = await Promise.all([
      Comp.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comp.countDocuments()
    ]);

    res.status(200).json({
      data: Comps,
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
  registerComp,getAllComps,
  getCompsByPage,loginComp
};
