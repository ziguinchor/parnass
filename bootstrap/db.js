const winston = require("winston");
const config = require("config");
const mongoose = require("mongoose");

module.exports = () => {
  // DB Connection
  mongoose
    .connect(config.db.host, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info("Connected to DB"));
  // .catch((err) => console.log(`Could not connect to db... ${err}`));
};
