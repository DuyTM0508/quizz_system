const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Flashcard = db.flashcard;
verifyToken = (req, res, next) => {
  // let token = req.session.token;

  // if (!token) {
  //   return res.status(403).send({ message: "No token provided!" });
  // }

  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1]; // Lấy token sau "Bearer "
  }
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  console.log("Token received:", token);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

isAdminOrOwner = async (req, res, next) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    // Kiểm tra xem người dùng có phải là người tạo flashcard không
    if (req.userId === flashcard.createdBy.toString()) {
      return next(); // Người tạo flashcard có quyền chỉnh sửa/xóa
    }

    // Tìm người dùng theo ID
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra xem người dùng có phải là admin không
    if (user.admin) {
      return next(); // Admin có quyền chỉnh sửa/xóa tất cả
    }

    return res.status(403).json({ message: "Unauthorized to modify this flashcard" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isAdminOrOwner,
};
module.exports = authJwt;
