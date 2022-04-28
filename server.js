const app = require("./app");
const winston = require("winston");

process.on("unhandledRejection", (err) => {
  winston.error(err);
});

process.on("uncaughtException", (err) => {
  winston.error(err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
