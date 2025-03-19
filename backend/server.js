require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dbConnection = require("./app/config/dbConnection");

const authRouter = require("./app/routes/auth");
const userRouter = require("./app/routes/userRouter");
const blogRouter = require("./app/routes/blog/blog.routes");
const flashcardRouter = require("./app/routes/flashcardRoutes");
// const questionRouter = require("./app/routes/questionRoutes");
const dbConfig = require("./app/config/db.config");

const app = express();
dbConnection();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "gianglh-session",
    keys: [process.env.COOKIE_SECRET || "default_secret"], // Use environment variable
    httpOnly: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to gianglh application." });
});
app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/blogs", blogRouter);
app.use("/flashcards", flashcardRouter);
// app.use("/questions", questionRouter);

// Initialize roles in DB
// const db = require("./app/models");
// const Role = db.role;
// function initial() {
//   Role.estimatedDocumentCount((err, count) => {
//     if (!err && count === 0) {
//       ["user", "moderator", "admin"].forEach((role) => {
//         new Role({ name: role }).save((err) => {
//           if (err) console.log("error", err);
//           else console.log(`added '${role}' to roles collection`);
//         });
//       });
//     }
//   });
// }

// Start server
const PORT = process.env.PORT || 9998;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
