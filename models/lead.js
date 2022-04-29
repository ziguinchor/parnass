const mongoose = require("mongoose");
const Joi = require("joi");
const { formatDate } = require("../utils/helpers");

const JoiDate = require("@hapi/joi-date");
Joi.extend(JoiDate);

const courseSchema = mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    require: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 500,
  },
});
const agentSchema = mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    require: true,
  },
  name: {
    type: String,
    require: true,
    trim: true,
    maxlength: 255,
  },
});
const leadSchema = mongoose.Schema({
  regNum: {
    type: Number,
    required: true,
  },
  contact: {
    type: String,
    required: true,
    maxlength: 255,
  },
  address: {
    type: String,
    required: true,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    match:
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  },
  phone: {
    type: String,
    required: true,
    maxlength: 255,
    trim: true,
  },
  course: courseSchema,
  budget: {
    type: Number,
    required: true,
  },
  center: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  finalBudget: {
    type: Number,
    required: true,
  },
  startAt: {
    type: Date,
  },
  endAt: {
    type: Date,
  },
  comment: {
    type: String,
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  agent: agentSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Lead = mongoose.model("lead", leadSchema);
const validateLead = (lead) => {
  const schema = Joi.object({
    regNum: Joi.number().integer().label("Numéro de dossier"),
    contact: Joi.string().max(255).required().label("Contact"),
    address: Joi.string().max(255).required().label("Adresse"),
    course: Joi.string().max(255).required().label("Formation"),
    center: Joi.string().max(255).required().label("Centre"),
    budget: Joi.number().required().label("Budget"),
    discount: Joi.number().optional().allow("").label("Réduction"),
    startDate: Joi.date().required().label("Date de début de la formation"),
    endDate: Joi.date().optional().label("Date de fin de la formation"),
    phone: Joi.string().max(50).optional().allow("").label("Téléphone"),
    email: Joi.string().email().max(255).label("Adress Email"),
    status: Joi.string()
      .min(3)
      .valid("pending", "confirmed", "cancelled")
      .label("Status"),
    comment: Joi.string().max(500).optional().allow("").label("Note"),
    agent: Joi.string().hex().length(24),
  });

  return schema.validate(lead);
};
exports.Lead = Lead;
exports.validate = validateLead;
