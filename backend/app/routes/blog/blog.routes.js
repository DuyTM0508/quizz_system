const express = require("express");
const {
  getAllBlog,
  getBlogDetail,
  insertBlog,
  updateBlog,
  deleteBlog,
} = require("../../controllers/blog/blog.controller");

const blogRouter = express.Router();

blogRouter.route("/").get(getAllBlog).post(insertBlog);
blogRouter.route("/:id").get(getBlogDetail).put(updateBlog).delete(deleteBlog);

module.exports = blogRouter;
