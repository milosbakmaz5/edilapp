const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const signUp = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log("Invalid inputs!");
    return;
  }

  const { firstname, lastname, email, password } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    console.log(error);
  }

  const createdUser = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (error) {}

  res.status(201).json({ userId: createdUser.id, email: createdUser.email });
};
exports.signUp = signUp;
