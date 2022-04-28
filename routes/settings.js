const express = require("express");
const settingController = require("../controllers/settingController");
const auth = require("../middleware/auth");

const router = express.Router();

router.route("/").get(auth, settingController.index);
module.exports = router;
