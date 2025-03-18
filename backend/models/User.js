const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20,
      unique: true,
    },

    email: {
      type: String,
      minlength: 10,
      maxlength: 50,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      minlength: 6,
      require: true,
    },

    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
