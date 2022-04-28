const express = require("express");
const accountController = require("../controllers/accountController");
const auth = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(auth, accountController.index)
  .post(auth, accountController.store);

router.route("/");

router
  .route("/:id")
  .get(auth, accountController.edit)
  .patch(auth, accountController.update);

module.exports = router;
