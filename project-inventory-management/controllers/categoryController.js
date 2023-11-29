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

exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

exports.category_create_post = [
  body("name", "Category must have a name")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      // not valid data
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // valid data
      // check if category already exists
      // collcation is a mongoose function to compare strings
      const categoryExists = await Category.findOne({
        name: req.body.name,
      })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

// Display category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allModelsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Model.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    res.redirect("/catalog/categories");
  }

  res.redirect("category_delete", {
    title: "Delete Category",
    category: category,
    allModelsInCategory: allModelsInCategory,
  });
});

// Handle category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allModelsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Model.find({ category: req.params.id }).exec(),
  ]);

  if (allModelsInCategory.length > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      allModelsInCategory: allModelsInCategory,
    });
    return;
  } else {
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect("/catalog/categories");
  }
});

// Display category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const [category] = await Promise.all([Category.findById(req.params.id)]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_update", {
    title: "Update Category",
    category: category,
  });
});

// hand category update on POST
exports.category_update_post = [
  body("name", "category must have a name")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (res, req, next) => {
    const errors = validationResult(req);

    const newCategory = new Category({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const [category] = await Promise.all([Category.findById(req.params.id)]);

      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const updateCategory = await Category.findByIdAndUpdate(
        req.params.id,
        newCategory,
        {}
      );
      res.redirect(updateCategory.url);
    }
  }),
];
