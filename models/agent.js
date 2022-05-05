const mongoose = require("mongoose");
const Joi = require("joi");
const agentSchema = mongoose.Schema({
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
    match:
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    unique: true,
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "pending", "suspended", "blocked"],
  },
  role: {
    type: String,
    default: "agent",
    enum: ["agent", "admin"],
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


const Agent = mongoose.model("agent", agentSchema);
const validateAgent = (agent) => {
  const schema = Joi.object({
    id: Joi.string().optional().allow(""),
    fullName: Joi.string().max(255).optional().allow("").label("Nom & Prénom"),
    username: Joi.string().max(255).required().label("Nom d'utilisateur"),
    password: Joi.string().min(6).max(50).required().label("Mot de Passe"),
    phone: Joi.string().max(50).optional().allow("").label("Téléphone"),
    email: Joi.string()
      .email()
      .max(255)
      .optional()
      .allow("")
      .label("Adress Email"),
    status: Joi.string()
      .min(3)
      .valid("active", "suspended", "blocked")
      .label("Status"),
    role: Joi.string().min(3).max(255).valid("agent", "admin").label("Role"),
  });
  return schema.validateAsync(agent);
};


exports.Agent = Agent;
exports.validate = validateAgent;
