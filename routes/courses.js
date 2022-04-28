const express = require("express");
const courseController = require("../controllers/courseController");
const auth = require("../middleware/auth");
const router = express.Router();

router.route("/").get(courseController.index).post(courseController.store);
router.route("/create").get(auth, courseController.create);
router.route("/send-course").post(courseController.sendCourse);
router.route("/send-mail").post(courseController.sendCustomEmail);
router
  .route("/:id")
  .get(auth, courseController.edit)
  .put(auth, courseController.update)
  .delete(auth, courseController.destroy);

module.exports = router;
