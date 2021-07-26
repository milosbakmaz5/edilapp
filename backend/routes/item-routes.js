const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");
const itemController = require("../controllers/items-controller");

router.use(checkAuth);

router.get("/", itemController.getAll);
router.get("/:iid", itemController.getItemById);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("productionName").not().isEmpty(),
    check("financeName").not().isEmpty(),
    check("measure").not().isEmpty(),
    check("weight").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  itemController.createItem
);

router.patch(
  "/:id",
  [
    check("productionName").not().isEmpty(),
    check("financeName").not().isEmpty(),
    check("measure").not().isEmpty(),
    check("weight").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  itemController.updateItem
);

router.delete("/:id", itemController.deleteItem);

module.exports = router;
