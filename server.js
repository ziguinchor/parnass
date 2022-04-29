const app = require("./app");
const winston = require("winston");
const logger = require("./utils/logger");
process.on("unhandledRejection", (err) => {
  logger.error(err);
  // process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error(err);
  // process.exit(1);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

