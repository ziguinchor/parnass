const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const auth = require("../middleware/auth");

const router = express.Router();

router.route("/").get(auth, dashboardController.index);
router.route("/stats").get(auth, dashboardController.getStats);
module.exports = router;
