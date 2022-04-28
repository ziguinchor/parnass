const jwt = require("jsonwebtoken");
const config = require("config");
const catchAsync = require("../utils/catchAsync");

module.exports = catchAsync(async function (req, res, next) {
  const accept = req.accepts(["html", "json"]);
  // const token = req.header("x-auth-token");
  const token = req.cookies.access_token;
  if (!token) {
    if (accept === "html") return res.redirect("/auth/login");
    return res.status("401").send({
      status: "error",
      message: "Accés Refusé, Pas de Jeton de securité fournit",
    });
  }
  try {
    const decodedPyalod = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decodedPyalod;
    res.locals.me = {
      username: decodedPyalod.username,
      name: decodedPyalod.fullName,
      email: decodedPyalod.email,
    };
    next();
  } catch (e) {
    if (accept === "html") return res.redirect("/auth/login");
    res.status(400).send({
      status: "error",
      message: "Jeton de securité invalid!",
    });
  }
});
