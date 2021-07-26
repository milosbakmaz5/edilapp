const fs = require("fs");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const { uploadFile } = require("../util/s3");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const Item = require("../models/item");
const Supplier = require("../models/supplier");
const HttpError = require("../models/http-error");

const getItemById = async (req, res, next) => {
  const itemId = req.params.iid;
  let item;
  try {
    item = await Item.findById(itemId).populate({
      path: "suppliers",
      select: "_id code name",
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Please try again later",
      500
    );
    return next(error);
  }

  if (!item) {
    return next(new HttpError("Could not find item for provided id.", 404));
  }

  res.json({
    item: item.toObject({ getters: true }),
  });
};

const getAll = async (req, res, next) => {
  let items;
  try {
    items = await Item.find({}).populate({
      path: "suppliers",
      select: "name code",
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Please try again later",
      500
    );
    return next(error);
  }

  res.status(200).json({
    items: items.map((item) => item.toObject({ getters: true })),
  });
};

const createItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const { productionName, financeName, measure, weight, price } = req.body;
  let suppliers = JSON.parse(req.body.suppliers);

  const createdItem = new Item({
    productionName,
    financeName,
    measure,
    weight,
    image: req.file.path,
    price,
  });
  suppliers.forEach((supplier) => {
    createdItem.suppliers.push(supplier.id);
  });
  try {
    await uploadFile(req.file);
  } catch (err) {
    return next(new HttpError("Uploading image failed.", 500));
  }

  try {
    await unlinkFile(req.file.path);
  } catch (error) {
    return next(new HttpError("Unlinking file failed", 500));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdItem.save({ session: sess });
    suppliers.forEach(async (supp) => {
      const supplier = await Supplier.findById(supp.id);
      supplier.items.push(createdItem._id);
      await supplier.save({ session: sess });
    });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating item failed. Please try again.", 500);
    return next(error);
  }

  res.status(201).json({ item: createdItem });
};

const updateItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const itemId = req.params.id;
  const { productionName, financeName, measure, weight, price } = req.body;
  let suppliers = req.body.suppliers;

  let existingItem;
  try {
    existingItem = await Item.findById(itemId).populate({ path: "suppliers" });
  } catch (error) {
    return next(
      new HttpError("Something went wrong. Could not find item.", 500)
    );
  }

  existingItem.productionName = productionName;
  existingItem.financeName = financeName;
  existingItem.measure = measure;
  existingItem.weight = weight;
  existingItem.price = price;
  //cuvam prethodne suppliere
  let oldSuppliers = [];
  existingItem.suppliers.forEach((supplier) => {
    oldSuppliers.push(supplier);
  });
  //zatim praznim listu suppliera i dodajem nove
  existingItem.suppliers = [];
  suppliers.forEach((supplier) => {
    existingItem.suppliers.push(supplier.id);
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await existingItem.save({ session: sess });
    oldSuppliers.forEach(async (supp) => {
      Supplier.updateOne(
        { _id: supp.id },
        { $pull: { items: [existingItem.id] } }
      );
    });
    suppliers.forEach(async (supp) => {
      const supplier = await Supplier.findById(supp.id);
      supplier.items.push(existingItem.id);
      await supplier.save({ session: sess });
    });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Updating item failed. Please try again.", 500);
    return next(error);
  }

  res.status(200).json({ item: existingItem });
};

const deleteItem = async (req, res, next) => {
  const itemId = req.params.id;

  let item;
  try {
    item = await Item.findById(itemId).populate("suppliers");
  } catch (error) {
    return next(
      new HttpError("Something went wrong. Could not find item", 500)
    );
  }

  if (!item) {
    return next(new HttpError("Could not find item for provided id", 500));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    item.suppliers.forEach((supp) => {
      Supplier.updateOne(
        { _id: supp },
        { $pull: [item.id] },
        { session: sess }
      );
    });
    await item.remove({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError("Deleting item failed. Please try again.", 500));
  }

  res.status(200).json({ message: "Deleted item." });
};

exports.getAll = getAll;
exports.getItemById = getItemById;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
