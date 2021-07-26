const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const Mail = require("../models/mail");
const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../util/mail");
const { uuid } = require("uuidv4");

const signUp = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs. Please check your data.", 422));
  }

  const { firstname, lastname, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
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

  const hashedValue = crypto.randomBytes(32).toString("hex");
  console.log(createdUser.id);
  const confirmationMailData = new Mail({
    value: hashedValue,
    user: createdUser._id,
  });

  createdUser.mail = confirmationMailData._id;

  try {
    await sendEmail(createdUser.email, hashedValue);
  } catch (error) {
    return next(new HttpError(error, 500));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdUser.save({ session: sess });
    await confirmationMailData.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError("Sign up failed. Please try again later.", 500));
  }

  res.status(201).json({ message: "Success." });
};

const logIn = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs. Please check your data.", 422));
  }

  const { email, password, hashedValue } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
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

  if (!isValidPassword) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        401
      )
    );
  }

  //checking if user has confirmed email
  if (!existingUser.active) {
    let existingHashedValue;
    if (!hashedValue) {
      return next(
        new HttpError("Could not log you in. Please, confirm email first.", 500)
      );
    }
    try {
      existingHashedValue = await Mail.findOne({ value: hashedValue });
    } catch (error) {
      return next(
        new HttpError("Something went wrong. Please try again later.", 500)
      );
    }

    if (!existingHashedValue) {
      return next(
        new HttpError("Invalid request. Please check your email.", 500)
      );
    }
    if (existingHashedValue.user.toString() !== existingUser.id.toString()) {
      return next(
        new HttpError("Could not identify user, check your mail please.", 401)
      );
    }

    existingUser.active = true;
    existingUser.mail = null;
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await existingUser.save({ session: sess });
      await existingHashedValue.remove({ session: sess });
      await sess.commitTransaction();
    } catch (error) {
      console.log(error);
      return next(new HttpError("Log in failed. Please try again later.", 500));
    }
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        activated: existingUser.active,
      },
      `${process.env.JWT_KEY}`,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed. Please try again!", 500);
    return next(error);
  }

  return res.status(200).json({ token, userId: existingUser.id });
};

exports.signUp = signUp;
exports.logIn = logIn;
