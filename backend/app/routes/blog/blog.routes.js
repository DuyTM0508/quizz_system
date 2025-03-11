const express = require("express");
const {
  getAllBlog,
  getBlogDetail,
  insertBlog,
  updateBlog,
  deleteBlog,
} = require("../../controllers/blog/blog.controller");
const uploadCloud = require("../../utils/cloudinary.config");

const blogRouter = express.Router();

blogRouter
  .route("/")
  .get(getAllBlog)
  .post(uploadCloud.single("image"), insertBlog);
blogRouter
  .route("/:id")
  .get(getBlogDetail)
  .put(uploadCloud.single("image"), updateBlog)
  .delete(deleteBlog);

module.exports = blogRouter;
