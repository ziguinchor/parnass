const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");
const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    maxlength: 255,
  },
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  phone: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  email: {
    type: String,
    default: "",
    unique: true,
    match:
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "pending", "suspended", "blocked"],
  },
  role: {
    type: String,
    default: "",
    enum: ["admin"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    defaultl: Date.now,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      fullName: this.fullName,
      email: this.email,
    },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("user", userSchema);
const validateUser = (user) => {
  const schema = Joi.object({
    // id: Joi.string().optional().allow(""),
    fullName: Joi.string().max(255).optional().allow("").label("Nom & Prénom"),
    username: Joi.string().max(255).required().label("Nom d'utilisateur"),
    password: Joi.string().min(6).max(50).required().label("Mot de Passe"),
    phone: Joi.string().max(50).optional().allow("").label("Téléphone"),
    email: Joi.string().required().email().max(255).label("Adresse Email"),
    status: Joi.string()
      .min(3)
      .valid("active", "suspended", "blocked")
      .label("Status"),
    role: Joi.string().min(3).max(255).valid("admin").label("Role"),
  });
  return schema.validate(user);
};

exports.User = User;
exports.validate = validateUser;
