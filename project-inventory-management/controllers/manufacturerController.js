const Model = require("../models/model");
const Manufacturer = require("../models/manufacturer");
const Category = require("../models/category");
const ModelInstance = require("../models/modelInstance");

const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.manufacturer_list = asyncHandler(async (req, res, next) => {
  const allManufacturers = await Manufacturer.find().sort({ name: 1 }).exec();

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

  res.render("manufacturer_detail", {
    manufacturer: manufacturer,
    manufacturer_models: modelsByManufacturer,
  });
});

exports.manufacturer_create_get = (req, res, next) => {
  res.render("manufacturer_form", { title: "Create Manufacturer" });
};

exports.manufacturer_create_post = [
  // validate and sanitise fields
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Manufacturer name must be specified"),
  body("country")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Manufacturer country must be specified"),

  // Then process req
  asyncHandler(async (req, res, next) => {
    // get errors from req
    const errors = validationResult(req);

    // make new manufacturer object
    const manufacturer = new Manufacturer({
      name: req.body.name,
      country: req.body.country,
    });

    if (!errors.isEmpty()) {
      res.render("manufacturer_form", {
        title: "Create Manufacturer",
        manufacturer: manufacturer,
        errors: errors.array(),
      });
      return;
    } else {
      // data is valid

      await manufacturer.save();
      // then redirect to new manufacturer record
      res.redirect(manufacturer.url);
    }
  }),
];

exports.manufacturer_delete_get = asyncHandler(async (req, res, next) => {
  const [manufacturer, allModelsByManufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Model.find({ manufacturer: req.params.id }).exec(),
  ]);

  if (manufacturer === null) {
    res.redirect("/catalog/manufacturer");
  }

  res.render("manufacturer_delete", {
    title: "Delete Manufacturer",
    manufacturer: manufacturer,
    manufacturer_models: allModelsByManufacturer,
  });
});

exports.manufacturer_delete_post = asyncHandler(async (req, res, next) => {
  // get details of manufacturer and all their models
  const [manufacturer, allModelsByManufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Model.find({ manufacturer: req.params.id }).exec(),
  ]);

  if (allModelsByManufacturer.length > 0) {
    // manufacturer has models
    res.render("manufacturer_delete", {
      title: "Delete Manufacturer",
      manufacturer: manufacturer,
      manufacturer_models: allModelsByManufacturer,
    });
    return;
  } else {
    // no books, its ok to delete
    await Manufacturer.findByIdAndRemove(req.body.manufacturerid);

    res.redirect("/catalog/manufacturer");
  }
});

// Display manufacturer update form on GET.
exports.manufacturer_update_get = asyncHandler(async (req, res, next) => {
  // dispays current data from the selected manufacturer so you can update it.
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

// Handle Manufacturer update on POST
exports.manufacturer_update_post = [
  // validate and sanitise fields
  body("name", "Name of manufacturer must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("country", "Manufacturers country must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process the req after validation and sanitisation
  asyncHandler(async (req, res, next) => {
    // get any validation errors
    const errors = validationResult(req);

    const manufacturer = new Manufacturer({
      _id: req.params.id, // it needs to have the id assigned again or a new id will be assinged
      name: req.body.name,
      country: req.body.country,
    });

    if (!errors.isEmpty()) {
      // errors. Render form again with sanitised values and any error messages
      res.render("manufacturer_form", {
        title: "Update Manufacturer",
        manufacturer: manufacturer,
      });
      return;
    } else {
      // form data is valid, update the record.
      const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
        req.params.id,
        manufacturer,
        {}
      );

      res.redirect(updatedManufacturer.url);
    }
  }),
];

// Display Manufacturer delete form on GET
