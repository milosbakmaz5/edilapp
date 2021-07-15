const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  productionName: { type: String, required: true },
  financeName: { type: String, required: true },
  measure: { type: String, required: true },
  weight: { type: String, required: true },
  supplierCode: { type: String, required: true },
  supplier: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});

itemSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Item", itemSchema);
