const express = require("express");
const { validate, Lead } = require("../models/lead");
const { Course } = require("../models/course");
const { Agent } = require("../models/agent");
const { getCenters } = require("../controllers/centerController");
const { formatDate } = require("../utils/helpers");
const { endOfDay } = require("date-fns");
const excel = require("exceljs");
const AppError = require("../utils/appError");

const Joi = require("joi");
const { parse } = require("config/parser");
const { filter } = require("lodash");
const catchAsync = require("../utils/catchAsync");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let ObjectId = require("mongoose").Types.ObjectId;

/**
 * Display a listing of the rsource.
 * * DONE
 */
exports.index = catchAsync(async (req, res, next) => {
  const accept = req.accepts(["html", "json"]);
  if (accept === "json") {
    const count = await Lead.find().count();
    const searchFilter = parseSearchQuery(req.query.search.value);

    // DATA
    const [leads, totalFitlered] = await Promise.all([
      Lead.find(searchFilter)
        .sort("-createdAt")
        .select(
          "_id regNum contact address email phone course budget center discount finalBudget startAt endAt comment status agent createdAt"
        )
        .skip(req.query?.start ?? 10)
        .limit(req.query?.length ?? 10),
      Lead.find(searchFilter).count(),
    ]);

    return res.send({
      status: "success",
      results: leads.length,

      recordsTotal: count,
      recordsFiltered: totalFitlered,
      data: leads,
      centers: getCenters(),
      resource: "leads",
    });
  }
  res.render("leads/index", {
    resource: "leads",
    centers: getCenters(),
    statuses: [
      { label: "Confirmé", value: "confirmed" },
      { label: "Annulé", value: "cancelled" },
      { label: "En cours", value: "pending" },
    ],
  });
});
/**
 * Show the form for creating a new resource.
 */
exports.create = catchAsync(async (req, res) => {
  const [courses, agents] = await Promise.all([Course.find(), Agent.find()]);
  res.render("leads/create", {
    courses,
    agents,
    resource: "leads",
    centers: getCenters(),
  });
});
/**
 * Store a newly created resource in storage.
 */
exports.store = catchAsync(async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message,
    });

  const token = req.cookies.access_token;
  if (token) {
    try {
      const decodedPyalod = jwt.verify(
        token,
        config.get("jwtPrivateKey"),
        (err, decoded) => {
          if (err)
            throw new AppError(
              "Vous n'êtes pas autorisé à effectuer cette action! Invalid jeton de sécurité."
            );
        }
      );
    } catch (ex) {
      throw new AppError(
        "Vous n'êtes pas autorisé à effectuer cette action! Invalid jeton de sécurité."
      );
    }
  } else {
    const agentId = req.body.agent;
    const password = req.body.password;
    console.log(req.body.agent);
    let agent = await Agent.findById(agentId);
    if (!agent)
      return res.status(400).send({
        status: "fail",
        message: "Agent introuvable!",
      });

    const vaildPassword = await bcrypt.compare(password, agent.password);
    if (!vaildPassword)
      return res.status(400).send({
        status: "fail",
        message: "Mot de passe incorrect!",
      });
  }

  // else if user is auth
  // do nothing

  const [course, agent] = await Promise.all([
    Course.findById(req.body.course),
    Agent.findById(req.body.agent),
  ]);
  if (!course)
    return res.status(400).send({
      status: "fail",
      message:
        "Formation Introuvable! Veillez selectionner depuis le liste des formation!",
    });
  if (!agent)
    return res.status(400).send({
      status: "fail",
      message:
        "Agent Introuvable! Veillez selectionner depuis le liste des agent!",
    });
  // Calc and validate final budget
  const finalBudget =
    +req.body.budget >= +req.body.discount
      ? +req.body.budget - +req.body.discount
      : +req.body.budget;
  const lead = new Lead({
    regNum: +req.body.regNum,
    contact: req.body.contact,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    course: {
      _id: req.body.course,
      name: course.name,
    },
    budget: +req.body.budget,
    center: req.body.center,
    discount: +req.body.discount,
    finalBudget: +finalBudget.toFixed(2),
    startAt: new Date(req.body.startDate).toISOString(),
    endAt: new Date(req.body.endDate).toISOString(),
    comment: req.body.comment,
    status: req.body.status,
    agent: {
      _id: req.body.agent,
      name: agent.fullName,
      username: agent.username,
    },
    updatedAt: new Date(Date.now()).toISOString(),
  });

  try {
    lead.save();
    res.send({
      status: "success",
      message: "Rendez-vous Ajouté avec succes!",
      data: lead,
    });
  } catch (e) {
    res.send({
      status: "fail",
      message: "Une erreur est survenue! Veillez reessayer plus tard",
    });
  }
});
/**
 * Display the specified resource.
 */
exports.show = catchAsync(async (req, res) => {
  const lead = await Lead.findById(req.params.id)
    .select(
      "_id regNum contact address email phone course budget center discount finalBudget startAt endAt comment status agent createdAt"
    )
    .populate("course");

  if (!lead) return res.status(404).render("404");
  res.render("leads/details", {
    lead,
    resource: "leads",
  });
});
/**
 * Show the form for editing the specified resource.
 */
exports.edit = catchAsync(async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(404).render("404");

  const [lead, courses, agents] = await Promise.all([
    Lead.findById(req.params.id).select(
      "_id regNum contact address email phone course budget center discount finalBudget startAt endAt comment status agent createdAt"
    ),
    Course.find({}, { _id: 1, name: 1 }),
    Agent.find({}, { _id: 1, username: 1 }),
  ]);

  console.log(lead);
  if (!lead) return res.status(404).render("404");
  res.render("leads/details", {
    lead,
    courses,
    agents,
    centers: getCenters(),
    resource: "leads",
    recap: recap(lead),
  });
});
/**
 * Update the specified resource in storage.
 */
exports.update = catchAsync(async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message,
    });

  const [course, agent] = await Promise.all([
    Course.findById(req.body.course),
    Agent.findById(req.body.agent),
  ]);
  if (!course)
    return res.status(400).send({
      status: "fail",
      message:
        "Formation Introuvable! Veillez selectionner depuis le liste des formation!",
    });
  if (!agent)
    return res.status(400).send({
      status: "fail",
      message:
        "Agent Introuvable! Veillez selectionner depuis le liste des agent!",
    });

  // Calc and validate final budget
  const finalBudget =
    +req.body.budget >= +req.body.discount
      ? +req.body.budget - +req.body.discount
      : +req.body.budget;
  const lead = await Lead.findByIdAndUpdate(req.params.id, {
    regNum: +req.body.regNum,
    contact: req.body.contact,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    course: {
      _id: req.body.course,
      name: course.name,
    },
    center: req.body.center,
    budget: +req.body.budget,
    discount: +req.body.discount,
    finalBudget: +finalBudget.toFixed(2),
    startAt: new Date(req.body.startDate).toISOString(),
    endAt: new Date(req.body.endDate).toISOString(),
    comment: req.body.comment,
    status: req.body.status,
    agent: {
      _id: req.body.agent,
      name: agent.fullName,
      username: agent.username,
    },
    updatedAt: new Date(Date.now()).toISOString(),
  });
  if (!lead) next("Rendez-vous introuvable!", 404);

  res.send({
    status: "success",
    message: "Rendez-vous Ajouté avec succes!",
    data: lead,
  });
});
/**
 * Remove the specified resource from storage.
 */
exports.destroy = catchAsync(async (req, res) => {
  const lead = await Lead.findByIdAndRemove(req.params.id);
  if (!lead)
    return res.status(404).send({
      status: "fail",
      message: "Rendez-vous Introuvable!",
    });
  res.send({
    status: "success",
    message: "Rendez-vous suprimé avec succes!",
  });
});

/**
 * Generate and downloadd Leads Spreadsheet
 */
exports.download = catchAsync(async (req, res) => {
  const filterQuery = {};
  let from = new Date();
  let to = from;

  dateRange = req.query.dateRange;
  if (dateRange && dateRange.replace("dateRange=").length > 9) {
    if (dateRange.includes("to")) {
      const date = dateRange.replace("dateRange=", "").split(" to ");
      from = new Date(date[0].replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
      to = new Date(date[1].replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
    } else {
      from = to = new Date(
        dateRange.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
      );
    }
    filterQuery.createdAt = {
      $gte: from,
      $lte: endOfDay(to),
    };
  }

  if (req.query?.center && req.query?.center !== "any")
    filterQuery.center = req.query.center;

  if (req.query?.status && req.query?.status !== "any")
    filterQuery.status = req.query.status;

  const leads = await Promise.all([
    Lead.find(filterQuery)
      .sort("-createdAt")
      .select(
        "_id regNum contact address email phone course.name budget center discount finalBudget startAt endAt comment status agent.name createdAt"
      ),
  ]);
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Rendez-vous");
  worksheet.columns = [
    { header: "Numéro de Dossier", key: "regNum", width: 16 },
    { header: "Contact", key: "contact", width: 20 },
    { header: "Téléphone", key: "phone", width: 16 },
    { header: "Email", key: "email", width: 35 },
    { header: "Adresse", key: "address", width: 40 },
    { header: "Formation", key: "course", width: 40 },
    { header: "Centre", key: "center", width: 10 },
    { header: "Agent", key: "agent", width: 25 },
    { header: "Date", key: "createdAt", width: 16 },
    { header: "Status", key: "status", width: 12 },
    { header: "Budget", key: "budget", width: 8 },
    { header: "Réduction", key: "discount", width: 8 },
    { header: "Budget Final", key: "finalBudget", width: 8 },
    { header: "Date de début", key: "startAt", width: 16 },
    { header: "Date de fin", key: "endAt", width: 16 },
    { header: "Comment", key: "comment", width: 20 },
  ];
  // Add Array Rows
  leads[0].forEach((lead) => {
    const row = { ...lead.toJSON() };
    row.course = lead.course.name;
    row.agent = lead.agent.name;
    worksheet.addRow(row);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=" + "export.xlsx");
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
});

/**
 * Parse Search Query
 */
function parseSearchQuery(searchQuery) {
  let queryFilter = {
    $and: [],
  };
  let [search, center, dateRange, status] = searchQuery.split("&");
  if (dateRange && dateRange.replace("dateRange=").length > 9) {
    if (dateRange.includes("to")) {
      const date = dateRange.replace("dateRange=", "").split(" to ");

      queryFilter.$and.push({
        createdAt: {
          $gte: new Date(
            date[0].replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
          ),
          $lte: endOfDay(
            new Date(date[1].replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
          ),
        },
      });
    } else {
      queryFilter.$and.push({
        createdAt: {
          $gte: new Date(
            dateRange.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
          ),
          $lte: endOfDay(
            new Date(dateRange.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
          ),
        },
      });
    }
  }

  search &&
    queryFilter.$and.push({ contact: new RegExp(search.split("=")[1], "i") });

  status &&
    status !== "status=any" &&
    queryFilter.$and.push({ status: new RegExp(status.split("=")[1], "i") });

  center &&
    center !== "center=any" &&
    queryFilter.$and.push({ center: new RegExp(center.split("=")[1], "i") });

  if (queryFilter?.$and.length === 0) {
    queryFilter = {};
  }
  return queryFilter;
}

function recap(lead) {
  return `
  Num: ${lead.regNum} <br>
  Nom: ${lead.contact}<br>
  Email: ${lead.email}<br>
  Téléphone: ${lead.phone}<br>
  Formation: ${lead.course.name}<br>
  Budget: ${lead.budget}<br>
  Réduction: ${lead.discount}<br>
  Prix Final: ${lead.finalBudget}<br>
  Date de début de la formation: ${formatDate(lead.startAt)}<br>
  Date de fin de la formation: ${formatDate(lead.endAt)}<br>
  Adresse: ${lead.address}<br>
  `;
}
