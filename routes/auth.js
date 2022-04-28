const express = require("express");
const authController = require("../controllers/authController");
const loginRateLimit = require("../middleware/authRateLimit");

const router = express.Router();

router
  .route("/login")
  .get(authController.index)
  .post(loginRateLimit, authController.login);
router.route("/register").post(authController.register);
router.route("/logout").get(authController.logout);

module.exports = router;
