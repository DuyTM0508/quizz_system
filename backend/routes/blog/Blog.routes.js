const express = require("express");
const {
  getAllBlog,
  getBlogDetail,
  insertBlog,
  updateBlog,
} = require("../../controllers/blog/Blog.controller");

const blogRouter = express.Router();

blogRouter.route("/").get(getAllBlog).post(insertBlog);
blogRouter.route("/:id").get(getBlogDetail).put(updateBlog);

module.exports = blogRouter;
