const express = require("express");
const cors = require("cors");
const dotenv=require('dotenv')



const dbConnect= require('./dbConnect');

const sendEmail = require("./utils/sendEmail");
const customerRouter = require("./routes/Customer.router");
const shiftRouter = require("./routes/Shift.router");
const productRouter = require("./routes/Product.router");
const driverRouter = require("./routes/Driver.router");
const vehicleRouter = require("./routes/Vehicle.router");
const compRouter = require("./routes/Comp.router");
const scheduleRouter = require("./routes/Schedule.router");
const TransactionRouter = require("./routes/Transaction.router");

const orderRouter = require("./routes/Order.router");
dbConnect();
const app = express();
dotenv.config();
console.log(cors());
app.use(cors({
    origin:'*'
}));
app.use(express.json());
app.use(customerRouter);

app.use(productRouter);
app.use(vehicleRouter);
app.use(driverRouter);
app.use(scheduleRouter);
app.use(shiftRouter);
app.use(compRouter);
app.use(TransactionRouter);

app.use(orderRouter);


module.exports = app