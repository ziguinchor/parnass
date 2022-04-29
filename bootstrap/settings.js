const path = require("path");

module.exports = (app) => {
  // APP SETTINGS
  app.set("view engine", "pug");
  app.set("views", path.join(__dirname, "/../views/dist"));
};
