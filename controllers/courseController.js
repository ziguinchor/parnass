const express = require("express");
const { validate, Course, validateMail } = require("../models/course");
const { getCenters } = require("../controllers/centerController");
const { Lead } = require("../models/lead");
const nodeMailer = require("nodemailer");
const { mail } = require("./mailController");
const config = require("config");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

var ObjectId = require("mongoose").Types.ObjectId;

/**
 * Display a listing of the resource.
 * * DONE
 */
exports.index = catchAsync(async (req, res, next) => {
  const accept = req.accepts(["html", "json"]);
  if (accept === "json") {
    const count = await Course.find().count();
    const search = req.query?.search
      ? new RegExp(req.query.search.value, "i")
      : "";

    // DATA
    const courses = await Course.find({
      $or: [{ name: search }, { url: search }, { center: search }],
    })
      .sort("-createdAt")
      .select("name center budget url urlStatus createdAt")
      .skip(req.query?.start ?? 10)
      .limit(req.query?.length ?? 10);

    // COUNT FILTERED DATA
    const totalFitlered = await Course.find({
      $or: [{ name: search }, { url: search }, { center: search }],
    }).count();

    return res.send({
      status: "success",
      results: courses.length,

      recordsTotal: count,
      recordsFiltered: totalFitlered,
      data: courses,
      resource: "courses",
    });
  }
  res.render("courses/index", {
    resource: "courses",
  });
});
/**
 * Show the form for creating a new resource.
 */
exports.create = catchAsync(async (req, res, next) => {
  res.render("courses/create", {
    resource: "courses",
    centers: getCenters(),
  });
});
/**
 * Store a newly created resource in storage.
 */
exports.store = catchAsync(async (req, res, next) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message,
    });

  let course = new Course({
    name: req.body.name,
    center: req.body.center,
    budget: req.body.budget,
    url: req.body.url,
    urlStatus: "unchecked",
  });
  course = await course.save();
  res.send({
    status: "success",
    message: "Formation ajoutée avec succés!",
    data: course,
  });
});
/**
 * Display the specified resource.
 */
exports.show = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id).select(
    "_id name center budget url urlStatus createdAt"
  );
  if (!course) return res.status(404).render("404");
  res.render("courses/details", course);
});
/**
 * Show the form for editing the specified resource.
 */
exports.edit = catchAsync(async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id))
    return next(new AppError("Identifiant invalid!"), 200);
  const course = await Course.findById(req.params.id).select(
    "_id name center budget url urlStatus createdAt"
  );
  if (!course) return next(new AppError("Formation Introuvable", 404));
  res.render("courses/details", {
    course,
    centers: getCenters(),
    resource: "courses",
  });
});
/**
 * Update the specified resource in storage.
 */
exports.update = catchAsync(async (req, res, next) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message,
    });

  const course = await Course.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    center: req.body.center,
    budget: req.body.budget,
    url: req.body.url,
    updatedAt: new Date(Date.now()).toISOString(),
  });
  if (!course) return next(new AppError("Formation Introuvable", 404));

  res.send({
    status: "success",
    message: "Formation mise à jour avec succes!",
    data: course,
  });
});
/**
 * Remove the specified resource from storage.
 */
exports.destroy = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndRemove(req.params.id);
  if (!course)
    return res.status(404).send({
      status: "fail",
      message: "Course Introuvable!",
    });
  res.send({
    status: "success",
    message: "Formation suprimée avec succes!",
  });
});

/**
 * Send Course
 */
exports.sendCourse = catchAsync(async (req, res, next) => {
  const { error } = validateMail(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message,
    });
  const html = `Bonjour,
    <br><br>
    Ci-dessous le lien  de votre formation <br><br>
    ${req.body.url}
    <br><br>Bien à vous.`;
  try {
    mail({
      to: req.body.to,
      body: html,
      subject: "Lien de Votre Formation",
    });
    res.status(201).send({
      status: "succes",
      message: "Le Message à été bien envoyé!",
    });
  } catch (e) {
    res.status(500).send({
      status: "fail",
      message: "Une erreur s'est produite!",
    });
  }
});

exports.sendCustomEmail = async (req, res, next) => {
  const { error } = validateMail(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message,
    });
  try {
    mail({
      to: req.body.to,
      subject: req.body.subject,
      body: req.body.message,
    });
    res.status(201).send({
      status: "succes",
      message: "Le Message à été bien envoyé!",
    });
  } catch (e) {
    res.status(424).send({
      status: "fail",
      message: "Une erreur s'est produite!",
    });
  }
};
