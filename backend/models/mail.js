const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const mailSchema = new Schema({
  value: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, required: true },
});

mailSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Mail", mailSchema);
