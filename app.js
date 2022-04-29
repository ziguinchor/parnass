const express = require("express");
const winston = require("winston");
const globalErrorHandler = require("./controllers/errorController");

require("./bootstrap/config")();

winston.add(
  new winston.transports.File({
    filename: "logfile.log",
  })
);

const app = express();

// DB Connection
require("./bootstrap/db")();

// MIDDDLEWARES
require("./bootstrap/middlewares")(app);

// APP SETTINGS
require("./bootstrap/settings")(app);

// ROUTES MOUNTING
require("./bootstrap/routes")(app);

// app.all("*", function (req, res, next) {
//   // next(new AppError("Page Untrouvable", 404));
//   res.status(404);
//
//   if (req.accepts("html")) {
//     res.render("404", { url: req.url });
//     return;
//   }
//
//   if (req.accepts("json")) {
//     next(new AppError("Page Introuvable", 404));
//   }
//
//   res.type("txt").send("Page Introuvable!");
// });

app.use(globalErrorHandler);

module.exports = app;
