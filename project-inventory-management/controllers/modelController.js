const Model = require("../models/model");
const Manufacturer = require("../models/manufacturer");
const Category = require("../models/category");
const ModelInstance = require("../models/modelInstance");

const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // get details of all car models.
  const [numModels, numModelInstances, numManufacturers, numCategories] =
    await Promise.all([
      Model.countDocuments({}).exec(),
      ModelInstance.countDocuments({}).exec(),
      Manufacturer.countDocuments({}).exec(),
      Category.countDocuments({}).exec(),
    ]);

  console.log(numModels, numModelInstances, numManufacturers, numCategories);

  res.render("index", {
    title: "Model Website Homepage",
    model_count: numModels,
    model_instance_count: numModelInstances,
    manufacturer_count: numManufacturers,
    category_count: numCategories,
  });
});

// get and show model that is clicked on
exports.model_detail = asyncHandler(async (req, res, next) => {
  const [model] = await Promise.all([
    Model.findById(req.params.id).populate("manufacturer").exec(),
  ]);

  console.log(req.params.id);

  res.render("model_detail", {
    title: model.name,
    model: model,
    // model_instances: modelInstances,
  });
});

// list ALL models
exports.model_list = asyncHandler(async (req, res, next) => {
  const allModels = await Model.find().populate("manufacturer").exec();

  console.log(allModels.length);

  res.render("model_list", {
    title: "All Models:",
    all_models: allModels,
  });
});
