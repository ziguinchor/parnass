const rateLimit = require("express-rate-limit");
const config = require("config");

module.exports = rateLimit({
  windowMs: config.get("rateLimit.windowMin") * 60 * 1000, // 1 hour window
  max: config.get("rateLimit.max"), // Start blocking after 5 requests
  standardHeaders: true,
  message: {
    status: "fail",
    message:
      "Trop de requêtes provenant de cette adresse IP, veuillez réessayer dans une heure",
  },
});
