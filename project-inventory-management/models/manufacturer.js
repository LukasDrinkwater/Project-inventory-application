const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ManufacturerSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  country: { type: String, required: true, maxLength: 100 },
});

ManufacturerSchema.virtual("url").get(function () {
  // needs to be returned as an object so its not an arrow func
  return `/catalog/manufacturer/${this._id}`;
});

// export model
module.exports = mongoose.model("Manufacturer", ManufacturerSchema);
