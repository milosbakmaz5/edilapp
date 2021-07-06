const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const HttpError = require("../models/http-error");

const signUp = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs. Please check your data.", 422));
  }

  const { firstname, lastname, email, password } = req.body;

  let existingUser;
  try {
    existingUser = User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Something went wrong. Please try again later.", 500)
    );
  }

  if (existingUser) {
    return next(
      new HttpError(
        "Already exists user with this email. Try log in instead.",
        422
      )
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HttpError("Could not create user now. Please try again later.", 500)
    );
  }

  const createdUser = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Sign up failed. Please try again later.", 500));
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email });
};

const logIn = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs. Please check your data.", 422));
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Something went wrong. Please try again later.", 500)
    );
  }

  if (!existingUser) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        401
      )
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HttpError(
        "Could not log you in. Please check your credentials and try again.",
        500
      )
    );
  }

  if (isValidPassword) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        401
      )
    );
  }

  return res.status(200).json({ message: "sve ok" });
};

exports.signUp = signUp;
exports.logIn = logIn;
