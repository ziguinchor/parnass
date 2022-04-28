module.exports = (req, res, next) => {
  res.locals.me = null;
  next();
};
