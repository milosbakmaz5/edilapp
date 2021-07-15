const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const supplierController = require("../controllers/suppliers-controller");

router.use(checkAuth);

router.get("/", supplierController.getAll);

router.post(
  "/",
  [check("code").not().isEmpty(), check("name").not().isEmpty()],
  supplierController.createSupplier
);

module.exports = router;
