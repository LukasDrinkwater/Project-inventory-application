const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ModelInstanceSchema = new Schema({
  model: { type: Schema.Types.ObjectId, ref: "Model", required: true },
  description: { type: String, required: true },
});

ModelInstanceSchema.virtual("url").get(function () {
  // not an arrow function, it needs to be returned as an object
  return `/catalog/modelinstance/${this._id}`;
});

module.exports = mongoose.model("ModelInstance", ModelInstanceSchema);
