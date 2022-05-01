const winston = require("winston");
const { createLogger, format, transports } = winston;
require("winston-daily-rotate-file");
require("winston-mongodb").MongoDB;
const path = require("path");
const catchAsync = require("./catchAsync");
const config = require("config");

const enumerateErrorFormat = format((info) => {
  if (info.message instanceof Error) {
    info.message = Object.assign(
      {
        message: info.message.message,
        stack: info.message.stack,
      },
      info.message
    );
  }

  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info
    );
  }

  return info;
});
// Create logger
const logger = winston.createLogger({
  level: "debug",

  format: format.combine(
    format.errors({ stack: true }), // log the full stack
    winston.format.timestamp({ format: "HH:mm:ss.SSSSS" }),
    enumerateErrorFormat(),
    format.json(),
    format.metadata()
  ),

  transports: [
    new winston.transports.DailyRotateFile({
      level: "silly",
      eol: "\n",
      filename: path.join(__dirname, "../logs/errors-%DATE%.log"),
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      // format: format.combine(enumerateErrorFormat(), format.json()),
      // format: format.combine(format.errors({ stack: true }), print),
      handleExceptions: true,
    }),
    new winston.transports.Console({ level: "error", colorize: true }),
    new winston.transports.MongoDB({
      db: config.get("db.host"),
      collection: "logs",
      level: "error",
      capped: true,
    }),
  ],
});

// Create timestamp format
const tsFormat = () => new Date().toLocaleTimeString();


module.exports = logger;
