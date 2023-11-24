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

/// CATEGORY ROUTES ///

router.get("/categories", category_controller.category_list);

router.get("/categories/:id", category_controller.category_detail);

module.exports = router;
