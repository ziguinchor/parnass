const AppError = require("../utils/appError");
const config = require("config");
const logger = require("../utils/logger");

const handleCastErrorDb = (err) => {
  const message = `${err.path} est invalid: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err) => {
  const message = `Les Données fournis sont invalid!`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).send({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: "Une erreur s'est produite!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // Log Error
  logger.error(err);

  const accept = req.accepts(["html", "json"]);
  if (accept === "html") {
    return res.status(err.statusCode).render("404");
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;
    if (error.name === "CastError") error = handleCastErrorDb(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDb(error);
    sendErrorProd(error, res);
  }
};
