const Model = require("../models/model");
const Manufacturer = require("../models/manufacturer");
const Category = require("../models/category");
const ModelInstance = require("../models/modelInstance");

const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.manufacturer_list = asyncHandler(async (req, res, next) => {
  const allManufacturers = await Manufacturer.find().sort({ name: 1 }).exec();

  console.log(allManufacturers);

  res.render("manufacturer_list", {
    title: "Manufacturers",
    manufacturer_list: allManufacturers,
  });
});

exports.manufacturer_detail = asyncHandler(async (req, res, next) => {
  const [manufacturer, modelsByManufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Model.find({ manufacturer: req.params.id }).exec(),
  ]);

  console.log(manufacturer);

  res.render("manufacturer_detail", {
    manufacturer: manufacturer,
    manufacturer_models: modelsByManufacturer,
  });
});

// Display manufacturer update form on GET.
exports.manufacturer_update_get = asyncHandler(async (req, res, next) => {
  const [manufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
  ]);

  if (manufacturer === null) {
    // no result
    const err = new Error("Manufacturer not found");
    err.status = 404;
    return next(err);
  }

  res.render("manufacturer_form", {
    title: "Update Manufacturer",
    manufacturer: manufacturer,
  });
});

exports.manufacturer_update_post;
