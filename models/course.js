const mongoose = require("mongoose");
const Joi = require("joi");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  center: {
    type: String,
    required: true,
    maxlength: 255,
    trim: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true,
  },
  urlStatus: {
    type: String,
    default: "unchecked",
    enum: ["unchecked", "success", "fail", "error"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
const Course = mongoose.model("course", courseSchema);

const validateCourse = (course) => {
  const schema = Joi.object({
    id: Joi.string().optional().allow(""),
    name: Joi.string().max(255).required().label("Formation"),
    center: Joi.string().max(255).required().label("Centre"),
    budget: Joi.number().max(1000000).required().label("Budget"),
    url: Joi.string().max(500).required().label("Lien"),
  });
  return schema.validate(course);
};

const validateMail = (mail) => {
  const schema = Joi.object({
    to: Joi.string().required().email().max(255).label("Adress Email"),
    url: Joi.string().uri().max(1000).optional().allow("").label("Lien"),
    subject: Joi.string().optional().allow("").max(5000).label("Sujet"),
    message: Joi.string().optional().allow("").max(4000).label("Message"),
  });
  return schema.validate(mail);
};

exports.Course = Course;
exports.validate = validateCourse;
exports.validateMail = validateMail;
