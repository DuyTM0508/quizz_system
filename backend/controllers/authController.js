const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
const authController = {
  //Register
  registerUser: async (req, res) => {
    try {
      // create salt
      const salt = await bcrypt.genSalt(10);
      // mix
      const hashed = await bcrypt.hash(req.body.password, salt);

      // create a new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      // save user to database
      const user = await newUser.save();
      if (!user) return res.status(400).json("User creation failed");

      const { password, ...other } = user.toObject();
      res.status(200).json({
        DT: { ...other },
        EC: 0,
        EM: "A new user created success",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin || false,
      },
      process.env.ACCESS_KEY,
      { expiresIn: "2h" }
    );
  },
  // GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },
  //Login
  loginUser: async (req, res) => {
    try {
      // find user by username
      const user = await User.findOne({ username: req.body.username });

      // check if username is undefine
      if (!user) {
        return res.status(404).json("wrong username");
      }

      // check password
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json("Wrong password");
      }

      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "Strict",
        });
        const { password, ...others } = user.toObject();
        res.status(200).json({
          DT: { access_token: accessToken, ...others },
          EC: 0,
          EM: "Login succeed",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  requestRefreshToken: async (req, res, next) => {
    // Take refresh Token form cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("you are not authenticated");
    if (!refreshTokens.includes(refreshToken))
      return res.status(403).json("refresh token is not valid");
    jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      // create new accessToken and refreshToken
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "Strict",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  },

  //LOGOUT
  logout: async (req, res) => {
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    ); // Lọc token đúng cách

    res.clearCookie("refreshToken"); // Xóa cookie

    res.status(200).json("logged out !");
  },
};

//STORE TOKEN
// 1, LOCAL STORAGE:
// XSS
// 2, HTTPONLY COOKIE:
// CSRF -> SAME SITE
// 3, REDUX STORE -> ACCESSTOKEN
// HTTPONLY COOKIE -> REFRESHTOKEN

module.exports = authController;
