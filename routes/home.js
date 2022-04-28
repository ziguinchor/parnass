const express = require("express");
const authController = require("../controllers/authController");
const courseController = require("../controllers/courseController");

const router = express.Router();

router.route("/").get(courseController.index).post(courseController.store);
router.route("/create").get(courseController.create);
router.route("/send-course").post(courseController.sendCourse);
router.route("/send-mail").post(courseController.sendCustomEmail);
module.exports = router;
