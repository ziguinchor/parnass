const express = require("express");
const leadController = require("../controllers/leadController");
const auth = require("../middleware/auth");

const router = express.Router();

router.route("/").get(auth, leadController.index).post(leadController.store);

router.route("/create").get(leadController.create);
router.route("/super-create").get(auth, leadController.create);

router.route("/download/").get(auth, leadController.download);

router
  .route("/:id")
  .get(auth, leadController.edit)
  .put(auth, leadController.update)
  .delete(auth, leadController.destroy);

module.exports = router;
