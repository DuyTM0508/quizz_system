const {
  registerUser,
  loginUser,
  requestRefreshToken,
  logout,
} = require("../controllers/authController");
const { verifyToken } = require("../controllers/middlewareController");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshToken", requestRefreshToken);
router.post("/logout", verifyToken, logout);

module.exports = router;
