const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const supplierSchema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
});

supplierSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Supplier", supplierSchema);
