const {
  verifyToken,
  verifyTokenAndAuth,
} = require("../controllers/middlewareController");
const {
  getAllUser,
  deleteUser,
  createUser,
  updateUser,
} = require("../controllers/userController");

const userRouter = require("express").Router();

// Get all user
userRouter.get("/all", verifyToken, getAllUser);

// Create user
userRouter.post("/create", verifyTokenAndAuth, createUser);

// update user
userRouter.put("/update/:id", verifyTokenAndAuth, updateUser);

// Delete user
userRouter.delete("/delete/:id", verifyTokenAndAuth, deleteUser);

module.exports = userRouter;
