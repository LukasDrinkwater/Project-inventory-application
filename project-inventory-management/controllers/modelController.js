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

  res.render("index", {
    title: "Model Website Homepage",
    model_count: numModels,
    model_instance_count: numModelInstances,
    manufacturer_count: numManufacturers,
    category_count: numCategories,
  });
});

exports.model_create_get = asyncHandler(async (req, res, next) => {
  const [allManufacturers, allCategories] = await Promise.all([
    Manufacturer.find().exec(),
    Category.find().exec(),
  ]);

  res.render("model_form", {
    title: "Create Model",
    manufacturers: allManufacturers,
    categories: allCategories,
  });
});

// POST request to create manufacturer
exports.model_create_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") req.body.genre = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  // validate and sanitise field
  body("manufacturer", "Manufacturer of car model must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("name", "Model name must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("year", "Model year must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "The model must have a description")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "The model must have a price.")
    .trim()
    .isNumeric()
    .isLength({ min: 1 })
    .escape(),
  body("category", "The model needs to have a category selected.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const model = new Model({
      manufacturer: req.body.manufacturer,
      name: req.body.name,
      year: req.body.year,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      const [allManufacturers, allCategories] = await Promise.all([
        Manufacturer.find().exec(),
        category.find().exec(),
      ]);

      // mark selected categories as checked
      for (const category of allCategories) {
        if (model.category.includes(category._id)) {
          category.checked = "true";
        }
      }

      res.render("model_form", {
        title: "Create Model",
        manufacturers: allManufacturers,
        categories: allCategories,
        model: model,
        errors: errors.array(),
      });
      return;
    } else {
      await model.save();

      res.redirect(model.url);
    }
  }),
];

// GET request to delete manufacturer
exports.model_delete_get = asyncHandler(async (req, res, next) => {
  const model = await Model.findById(req.params.id).exec();

  if (model === null) {
    res.redirect("/catalog/allModels");
  }

  res.render("model_delete", {
    title: "Delete Model",
    model: model,
  });
});

// POST request to delete manufacturer
exports.model_delete_post = asyncHandler(async (req, res, next) => {
  const model = await Model.findById(req.params.id);

  if (mode === null) {
    res.render("model_delete", {
      title: "Delete Model",
      model: model,
    });
    return;
  } else {
    await Model.findByIdAndRemove(req.body.modelid);

    res.redirect("/catalog/allModels");
  }
});

// GET request to update manufacturer
exports.model_update_get = asyncHandler(async (req, res, next) => {
  const model = await Model.findById(req.params.id);

  if (model === null) {
    const err = new Error("Model not found");
    err.status = 404;
    return next(err);
  }
  res.render("model_form", {
    title: "Update Model",
    model: model,
  });
});

// POST request to update manufacturer
exports.model_update_post = [
  body("manufacturer", "Manufacturer of car model must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("name", "Model name must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("year", "Model year must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "The model must have a description")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "The model must have a price.")
    .trim()
    .isNumeric()
    .isLength({ min: 1 })
    .escape(),
  body("category", "The model needs to have a category selected.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const model = new Model({
      manufacturer: req.body.manufacturer,
      name: req.body.name,
      year: req.body.year,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      res.render("model_form", {
        title: "Delete Model",
        model: model,
      });
      return;
    } else {
      const updatedModel = await Model.findByIdAndUpdate(
        req.params.id,
        model,
        {}
      );
    }
  }),
];

// list ALL models
exports.model_list = asyncHandler(async (req, res, next) => {
  const allModels = await Model.find().populate("manufacturer").exec();

  res.render("model_list", {
    title: "All Models:",
    all_models: allModels,
  });
});

// get and show model that is clicked on
exports.model_detail = asyncHandler(async (req, res, next) => {
  const [model] = await Promise.all([
    Model.findById(req.params.id).populate("manufacturer").exec(),
  ]);

  res.render("model_detail", {
    title: model.name,
    model: model,
    // model_instances: modelInstances,
  });
});
