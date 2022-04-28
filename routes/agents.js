const express = require("express");
const agentController = require("../controllers/agentController");
const auth = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(auth, agentController.index)
  .post(auth, agentController.store);

router
  .route("/create")
  .get(auth, agentController.create)
  .post(agentController.store);

router
  .route("/:id")
  .get(auth, agentController.edit)
  .put(auth, agentController.update)
  .delete(auth, agentController.destroy);

module.exports = router;
