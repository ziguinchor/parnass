const { validate, User } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

exports.index = async (req, res) => {
  res.render("auth/login", {
    resource: "auth",
  });
};

exports.login = async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message,
    });

  let user = await User.findOne({ username: req.body.username });
  if (!user)
    return res.status(400).send({
      status: "fail",
      message: "Nom d'utilisateur ou Mot de passe incorrect!",
    });

  const vaildPassword = await bcrypt.compare(req.body.password, user.password);
  if (!vaildPassword)
    return res.status(400).send({
      status: "fail",
      message: "Nom d'utilisateur ou Mot de passe incorrect!",
    });

  const token = user.generateAuthToken();

  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .send({
      status: "success",
      message: "Vous êtes authentifié avec succes! Redirection....",
      data: {
        user: _.pick(user, ["fullName", "username", "email", "phone"]),
      },
    });
};

exports.register = async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message,
    });

  let user = await User.findOne({
    $or: [
      {
        username: req.body.username,
      },
      {
        email: req.body.email,
      },
    ],
  });
  if (user)
    return res.status(400).send({
      status: "fail",
      message: "Adresse email ou nom d'utilisateur déja utilisés!",
    });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    username: req.body.username,
    password: hashed,
    phone: req.body.phone,
    status: req.body.status,
    role: "admin",
  });

  try {
    await user.save();

    // const token = user.generateAuthToken();

    // res.header("x-auth-token", token).send({
    //   status: "succes",
    //   data: {
    //     user: _.pick(user, ["fullName", "username", "email", "phone"]),
    //   },
    // });

    res.send({
      status: "success",
      message: "Administrateur ajouté avec succes!",
      user: _.pick(user, [
        "username",
        "email",
        "phone",
        "role",
        "createdAt",
        "status",
      ]),
    });
  } catch (e) {
    res.status(500).send({
      status: "error",
      message:
        "Une erreur s'est produit, Veuillez verifier les information sasies!",
    });
  }
};

exports.logout = async (req, res) => {
  const accept = req.accepts(["html", "json"]);
  if (accept === "html") {
    return res.clearCookie("access_token").redirect("/auth/login");
  }
  return res.clearCookie("access_token").status(200).json({
    status: "success",
    message: "Vous êtes déconnecté!",
  });
};

function validateAuth(user) {
  const schema = Joi.object({
    username: Joi.string().max(255).required().label("Nom d'utilisateur"),
    password: Joi.string().min(6).max(50).required().label("Mot de Passe"),
  });
  return schema.validate(user);
}
