const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose");

const Supplier = require("../models/supplier");

const getAll = async (req, res, next) => {
  let suppliers;
  try {
    suppliers = await Supplier.find({}, "code name");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Please try again later",
      500
    );
    return next(error);
  }

  res.status(200).json({
    suppliers: suppliers.map((supplier) =>
      supplier.toObject({ getters: true })
    ),
  });
};

const createSupplier = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const { code, name } = req.body;

  const createdSupplier = new Supplier({
    code,
    name,
    items: [],
  });

  try {
    await createdSupplier.save();
  } catch (err) {
    const error = new HttpError(
      "Creating supplier failed. Please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ supplier: createdSupplier });
};

exports.getAll = getAll;
exports.createSupplier = createSupplier;
