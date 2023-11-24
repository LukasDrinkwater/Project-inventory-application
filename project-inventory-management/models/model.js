const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  manufacturer: {
    type: Schema.Types.ObjectId,
    ref: "Manufacturer",
    required: true,
  },
  name: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

// virtual for the models URL

ModelSchema.virtual("url").get(function () {
  //  don't use an arrow function as we'll need the this object
  return `/catalog/model/${this._id}`;
});

ModelSchema.virtual("modelName").get(function () {
  return `/catalog/model/${this.name}`;
});

module.exports = mongoose.model("Model", ModelSchema);
