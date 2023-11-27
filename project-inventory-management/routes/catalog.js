const express = require("express");
const router = express.Router();

// Require controller modules.
const model_controller = require("../controllers/modelController");
const manufacturer_controller = require("../controllers/manufacturerController");
const category_controller = require("../controllers/categoryController");

/// MODEL ROUTES ///

// GET catalog home page.
//This actually maps to /catalog/ because we import the route with a /catalog prefix
router.get("/", model_controller.index);

router.get("/model/:id", model_controller.model_detail);

router.get("/allModels", model_controller.model_list);

/// MANUFACTURER ROUTES ///

router.get("/manufacturer", manufacturer_controller.manufacturer_list);

router.get("/manufacturer/:id", manufacturer_controller.manufacturer_detail);

// GET request to update manufacturer
router.get(
  "/manufacturer/:id/update",
  manufacturer_controller.manufacturer_update_get
);
// POST request to update manufacturer
router.post(
  "/manufacturer/:id/update",
  manufacturer_controller.manufacturer_update_post
);

// GET request to delete manufacturer
router.get(
  "/manufacturer/:id/delete",
  manufacturer_controller.manufacturer_delete_get
);

// POST request to delete manufacturer
router.post(
  "/manufacturer/:id/delete",
  manufacturer_controller.manufacturer_delete_post
);

// GET request to create manufacturer
router.get(
  "/manufacturer/create",
  manufacturer_controller.manufacturer_create_get
);

// POST request to create manufacturer
router.post(
  "/manufacturer/create",
  manufacturer_controller.manufacturer_create_post
);

/// CATEGORY ROUTES ///

router.get("/categories", category_controller.category_list);

router.get("/categories/:id", category_controller.category_detail);

module.exports = router;
