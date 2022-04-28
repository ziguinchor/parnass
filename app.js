const config = require("config");
const express = require("express");
const winston = require("winston");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const breadCrumbs = require("./middleware/breadCrumbs");
const me = require("./middleware/me");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

if (!config.get("jwtPrivateKey")) {
  console.log("ERROR : Please define jwtPrivateKey first!");
  process.exit(1);
}

winston.add(
  new winston.transports.File({
    filename: "logfile.log",
  })
);

const app = express();

// DB Connection
mongoose
  .connect(config.db.host)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(`Could not connect to db... ${err}`));

// MIDDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

if (app.get("env") === "development") app.use(morgan("tiny"));

app.use(breadCrumbs);
// IMPORT ROUTES
const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dahsboard");
const leadRouter = require("./routes/leads");
const agentRouter = require("./routes/agents");
const courseRouter = require("./routes/courses");
const customerRouter = require("./routes/customers");
const settingRouter = require("./routes/settings");
const accountRouter = require("./routes/accounts");
const homeRouter = require("./routes/home");
const home = require("./routes/home");

app.use(me);

// APP SETTINGS
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views/dist"));

// ROUTES MOUNTING
app.use("/dashboard", dashboardRouter);
app.use("/auth", authRouter);
app.use("/leads", leadRouter);
app.use("/agents", agentRouter);
app.use("/courses", courseRouter);
app.use("/customers", customerRouter);
app.use("/settings", settingRouter);
// app.use("/account", accountRouter);
app.use("/home", homeRouter);

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
