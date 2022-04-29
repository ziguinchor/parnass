const express = require("express");
const path = require("path");
// IMPORT ROUTES
const authRouter = require("../routes/auth");
const dashboardRouter = require("../routes/dahsboard");
const leadRouter = require("../routes/leads");
const agentRouter = require("../routes/agents");
const courseRouter = require("../routes/courses");
const customerRouter = require("../routes/customers");
const settingRouter = require("../routes/settings");
const accountRouter = require("../routes/accounts");
const homeRouter = require("../routes/home");
// const home = require("../routes/home");

module.exports = (app) => {
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
};
