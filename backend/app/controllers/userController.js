const User = require("../models/User");
const bcrypt = require("bcrypt");
const userController = {
  //Get All User
  getAllUser: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 10);
      const skip = (page - 1) * limit;

      const totalRows = await User.countDocuments();
      const totalPages = Math.max(1, Math.ceil(totalRows / limit)); // Đảm bảo totalPages >= 1

      const users = await User.find().skip(skip).limit(limit);

      res.status(200).json({
        DT: { totalRows, totalPages, users },
        EC: 0,
        EM: "Get list participants succeed",
      });
    } catch (error) {
      res.status(500).json({ EC: 1, EM: "Server error", error });
    }
  },

  // create a user
  createUser: async (req, res) => {
    try {
      const { email, password, username, admin } = req.body;

      // Kiểm tra thiếu dữ liệu
      if (!email || !password || !username || !admin) {
        return res.status(400).json({
          EC: -1,
          EM: "Missing required fields",
        });
      }

      // Kiểm tra admin hợp lệ
      const validadmins = ["true", "false"];
      if (!validadmins.includes(admin)) {
        return res.status(400).json({
          EC: -1,
          EM: "Invalid admin",
        });
      }

      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          EC: -1,
          EM: "Email already in use",
        });
      }

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Tạo user mới
      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        admin,
      });

      await newUser.save();

      return res.status(201).json({
        EC: 0,
        EM: "User created successfully",
        DT: {
          id: newUser._id,
          email: newUser.email,
          username: newUser.username,
          admin: newUser.admin,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({
        EC: -1,
        EM: "Internal server error",
        error: error.message,
      });
    }
  },
  // update a user
  updateUser: async (req, res) => {
    try {
      const { email, password, username, admin } = req.body;
      const userId = req.params.id;

      // Kiểm tra thiếu dữ liệu
      if (!userId || !email || !username || !admin) {
        return res.status(400).json({
          EC: -1,
          EM: "Missing required fields",
        });
      }

      // Kiểm tra admin hợp lệ
      const validAdmins = ["true", "false"];
      if (!validAdmins.includes(admin)) {
        return res.status(400).json({
          EC: -1,
          EM: "Invalid admin value",
        });
      }

      // Kiểm tra user có tồn tại không
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({
          EC: -1,
          EM: "User not found",
        });
      }

      // Cập nhật dữ liệu user
      existingUser.email = email;
      existingUser.username = username;
      existingUser.admin = admin;

      // Nếu có password mới, mã hóa trước khi cập nhật
      if (password) {
        const salt = await bcrypt.genSalt(10);
        existingUser.password = await bcrypt.hash(password, salt);
      }

      await existingUser.save();

      return res.status(200).json({
        EC: 0,
        EM: "User updated successfully",
        DT: {
          id: existingUser._id,
          email: existingUser.email,
          username: existingUser.username,
          admin: existingUser.admin,
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({
        EC: -1,
        EM: "Internal server error",
        error: error.message,
      });
    }
  },

  // delete a user
  deleteUser: async (req, res) => {
    try {
      // Nếu user có id = "1", không cho phép xóa
      if (
        req.params.id === "67d6cfd3d836b44e7278b45f" ||
        req.params.id === "67d6d16f133de885904bc43f"
      ) {
        return res.status(403).json({
          EC: -1,
          EM: "Định mệnh - Xóa tài khoản này lấy gì mà test @@",
        });
      }
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        DT: {
          id: user._id,
        },
        EC: 0,
        EM: "Delete the user succeed",
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  },
};

module.exports = userController;
