const jwt = require("jsonwebtoken");

const middlewareController = {
  // Verify token
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization;
    // console.log("check token Le Hoan HoangGiang", token);
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json("Token format is incorrect");
    }
    const accessToken = token.split(" ")[1];

    jwt.verify(accessToken, process.env.ACCESS_KEY, (error, user) => {
      if (error) {
        return res.status(403).json({ message: "Token is not valid", error });
      }
      req.user = user;
      // console.log("check req.user >>>>>>>>>>>>>", req.user);
      next();
    });
  },

  // Verify delete
  verifyTokenAndAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (String(req.params.id) === String(req.user.id) || req.user.admin) {
        console.log(req.user.id);
        next();
      } else {
        res.status(403).json("You are not allowed to delete other users");
      }
    });
  },

  // Verify admin
  verifyTokenAndAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (String(req.params.id) === String(req.user.id) || req.user.admin) {
        console.log(req.user.id);
        next();
      } else {
        res
          .status(403)
          .json("You are not allowed to do some thing with other users");
      }
    });
  },
};

module.exports = middlewareController;
