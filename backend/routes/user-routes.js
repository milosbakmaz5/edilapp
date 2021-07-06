const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const userController = require("../controllers/users-controller");

router.post(
  "/signup",
  [
    check("firstname").not().isEmpty(),
    check("lastname").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.signUp
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.logIn
);

module.exports = router;
