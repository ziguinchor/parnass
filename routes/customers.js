const express = require("express");
const customerController = require("../controllers/customerController");
const auth = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(auth, customerController.index)
  .post(auth, customerController.store);

router.route("/");

router
  .route("/:id")
  .get(auth, customerController.edit)
  .patch(auth, customerController.update);

module.exports = router;
