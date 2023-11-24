const Model = require("../models/model");
const Manufacturer = require("../models/manufacturer");
const Category = require("../models/category");
const ModelInstance = require("../models/modelInstance");

const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

// display a list of the categories

exports.category_list = asyncHandler(async (req, res, next) => {
  // get a list of the current categories
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  // get details of the category and all associated model instances
  const [category, modelsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Model.find({ category: req.params.id }).populate("manufacturer").exec(),
  ]);

  res.render("category_detail", {
    category: category,
    category_models: modelsInCategory,
  });
});
