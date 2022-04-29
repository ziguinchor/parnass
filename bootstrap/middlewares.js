const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const breadCrumbs = require("../middleware/breadCrumbs");
const me = require("../middleware/me");

module.exports = (app) => {
  // MIDDDLEWARES
  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.use(express.static(path.join(__dirname, "/../public")));

  if (app.get("env") === "development") app.use(morgan("tiny"));

  app.use(breadCrumbs);
  app.use(me);
};
