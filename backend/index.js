const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/userRouter");

dotenv.config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

const connect_MongoDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("connect to DB");
};

connect_MongoDB();

// ROUTES
app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);

// run server
app.listen(process.env.PORT || 9998, () => {
  console.log(`app is running at port:${process.env.PORT}`);
});
