
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schedule = require("../models/Schedule.model");
const axios=require("axios")

const Customer = require("../models/Customer.model");
const Order = require("../models/Order.model");
// Register Schedule
const addSchedule = async (req, res) => {
  try {
 

  

    const newSchedule = new Schedule({...req.body,status:"active"});

    await newSchedule.save();
    res.status(201).json({ message: "Account created successfully. Status: pending" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateSchedule = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    if(!id){
      return res.status(400).json({ message: "Schedule ID required for update" });
    }

    const updated = await Schedule.findByIdAndUpdate(
      id,
      { ...updateData,status:"active" },
      { new: true } // return updated document
    );

    if (!updated) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json({
      message: "Schedule updated successfully",
      data: updated
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const route = async (req, res) => {
  const { coords } = req.query; // coords="lng1,lat1;lng2,lat2;..."
console.log(coords)
  if (!coords) return res.status(400).json({ error: "Missing coords" });

  try {
    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${coords}?geometries=geojson`
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};
const getallSchedules = async (req, res) => {
  try {
    const Schedules = await Schedule.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(Schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getScheduleStats = async (req, res) => {
  try {
    const today = new Date();

    const todayDay = today.toLocaleDateString("en-US", {
      weekday: "long"
    });

    const todayDate =
      String(today.getDate()).padStart(2, "0") + "/" +
      String(today.getMonth() + 1).padStart(2, "0") + "/" +
      today.getFullYear();

    const stats = await Schedule.aggregate([
      {
        $facet: {
          // 1️⃣ Total schedules
          totalSchedules: [
            { $count: "count" }
          ],

          // 2️⃣ Today schedules
          todaySchedules: [
            { $match: { days: { $in: [todayDay] } } },
            { $count: "count" }
          ],

          // 3️⃣ Today shifts (all)
          todayShifts: [
            { $match: { days: { $in: [todayDay] } } },
            {
              $lookup: {
                from: "shifts",
                let: { scheduleId: { $toString: "$_id" } },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$routeid", "$$scheduleId"] },
                          { $eq: ["$date", todayDate] }
                        ]
                      }
                    }
                  }
                ],
                as: "shifts"
              }
            },
            { $unwind: "$shifts" }
          ]
        }
      },

      // 4️⃣ Split shifts by status
      {
        $project: {
          totalSchedules: { $arrayElemAt: ["$totalSchedules.count", 0] },
          todaySchedules: { $arrayElemAt: ["$todaySchedules.count", 0] },

          totalShifts: { $size: "$todayShifts" },

          completedShifts: {
            $size: {
              $filter: {
                input: "$todayShifts",
                as: "s",
                cond: {
                  $and: [
                    { $ne: ["$$s.shifts.end", "-"] },
                    { $ne: ["$$s.shifts.end", null] },
                    { $ne: ["$$s.shifts.end", ""] }
                  ]
                }
              }
            }
          },

          inProgressShifts: {
            $size: {
              $filter: {
                input: "$todayShifts",
                as: "s",
                cond: {
                  $or: [
                    { $eq: ["$$s.shifts.end", "-"] },
                    { $eq: ["$$s.shifts.end", null] },
                    { $eq: ["$$s.shifts.end", ""] }
                  ]
                }
              }
            }
          }
        }
      }
    ]);

    res.status(200).json({
      today: todayDay,
      totalSchedules: stats[0].totalSchedules || 0,
      todaySchedules: stats[0].todaySchedules || 0,
      totalShifts: stats[0].totalShifts || 0,
      completedShifts: stats[0].completedShifts || 0,
      inProgressShifts: stats[0].inProgressShifts || 0
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const getSchByDate = async (req, res) => {
  try {
    const Schedules = await Schedule.find({days:req.body.day}).sort({ createdAt: -1 }); // newest first
    res.status(200).json(Schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSchByDriver = async (req, res) => {
  console.log(req.body);

  try {
    const driverId = req.body.id;
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });


    const schedules = await Schedule.aggregate([
      { $match: { driverid: driverId, days: day } },
      { $unwind: "$customers" },
      // convert customerid to ObjectId
      { $addFields: { "customers.customerid": { $toObjectId: "$customers.customerid" } } },
      {
        $lookup: {
          from: "customers",
          localField: "customers.customerid",
          foreignField: "_id",
          as: "customerDetails"
        }
      },
      { $unwind: "$customerDetails" },
      { $sort: { "customers.sequence": 1 } },
      {
        $group: {
          _id: "$_id",
          driverid: { $first: "$driverid" },
          route: { $first: "$route" },
          vehicleid: { $first: "$vehicleid" },
          frequency: { $first: "$frequency" },
          date: { $first: "$date" },
          area: { $first: "$area" },
          days: { $first: "$days" },
          customers: { $push: "$customerDetails" }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    console.log(schedules.length);
    res.status(200).json(schedules);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};


const getSchByPage = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [Schedules, total] = await Promise.all([
      Schedule.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Schedule.countDocuments()
    ]);

    res.status(200).json({
      data: Schedules,
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
const getDeliveryStats = async (req, res) => {
  try {
    const today = new Date();

    const todayDay = today.toLocaleDateString("en-US", {
      weekday: "long"
    });

    const todayDate =
      String(today.getDate()).padStart(2, "0") + "/" +
      String(today.getMonth() + 1).padStart(2, "0") + "/" +
      today.getFullYear();

    /* =========================
       1️⃣ TODAY DELIVERIES (Schedule)
    ========================== */
    const deliveryData = await Schedule.aggregate([
      {
        $match: {
          days: { $in: [todayDay] }
        }
      },
      { $unwind: "$customers" },
      {
        $lookup: {
          from: "customers",
          let: { customerId: "$customers.customerid" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$_id" }, "$$customerId"]
                }
              }
            },
            {
              $project: {
                todaySchedule: `$schedule.${todayDay}`
              }
            },
            {
              $project: {
                deliveryCount: {
                  $cond: [
                    { $isArray: "$todaySchedule" },
                    { $size: "$todaySchedule" },
                    0
                  ]
                }
              }
            }
          ],
          as: "customer"
        }
      },
      { $unwind: "$customer" },
      {
        $group: {
          _id: null,
          totalTodayDeliveries: {
            $sum: "$customer.deliveryCount"
          }
        }
      }
    ]);

    const totalDeliveries =
      deliveryData[0]?.totalTodayDeliveries || 0;

    /* =========================
       2️⃣ TODAY ORDERS (Orders)
    ========================== */
    const ordersData = await Order.aggregate([
      {
        $match: {
          date: todayDate
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    let totalOrders = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;

    ordersData.forEach(item => {
      totalOrders += item.count;

      if (item._id === "delivered") deliveredOrders = item.count;
      if (item._id === "cancelled") cancelledOrders = item.count;
    });

    /* =========================
       FINAL RESPONSE
    ========================== */
    res.status(200).json({
      day: todayDay,
      date: todayDate,

      deliveries:  totalDeliveries,
      

        totalOrders:totalOrders,
        deliveredOrders:deliveredOrders,
        cancelledOrders:cancelledOrders
 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  addSchedule,getallSchedules,route,getSchByDate,getSchByDriver,
  getScheduleStats,getSchByPage,
  getDeliveryStats,updateSchedule
};
