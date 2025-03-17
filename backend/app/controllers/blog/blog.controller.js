const express = require("express");
const bodyParser = require("body-parser");
const Blog = require("../../models/blog/blog.model");
const { default: mongoose, get } = require("mongoose");

const router = express.Router();

router.use(bodyParser.json());

//!GetAll
const getAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find();

    const formatData = blogs.map((blog) => {
      return {
        id: blog._id,
        title: blog.title,
        description: blog.description,
        image: blog.image,
      };
    });

    res.status(200).json({
      status: 200,
      message: "Successfully fetched all blogs",
      data: formatData,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

//!GetDetail
const getBlogDetail = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      status: 400,
      message: "Invalid ID",
    });
  }
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({
        status: 404,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Successfully fetched blog",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

//!Insert
const insertBlog = async (req, res) => {
  const { title, description, category } = req.body;
  try {
    if (!title || !description || !category) {
      res.status(400).json({
        status: 400,
        message: "Please fill in all fields",
      });
    }

    const newBlog = new Blog({
      title,
      description,
      image: req.file.path,
      category,
    });

    const response = await newBlog.save();

    res.status(201).json({
      status: 201,
      message: "Successfully added blog",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

//!Update
const updateBlog = async (req, res) => {
  const { title, description, category } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      status: 400,
      message: "Invalid ID",
    });
  }
  try {
    const blog = await Blog.findByIdAndUpdate(
      id,
      { title, description, image: req.file.path, category },
      { new: true }
    );

    const response = await blog.save();

    res.status(201).json({
      status: 201,
      message: "Successfully updated blog",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

//!Delete
const deleteBlog = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      status: 400,
      message: "Invalid ID",
    });
  }
  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      res.status(404).json({
        status: 404,
        message: "Blog not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Successfully deleted blog",
    });
  } catch (error) {}
};

module.exports = {
  getAllBlog,
  getBlogDetail,
  insertBlog,
  updateBlog,
  deleteBlog,
};
