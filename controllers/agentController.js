const express = require("express");
const { Agent, validate } = require("../models/agent");
const { Lead } = require("../models/lead");
const catchAsync = require("../utils/catchAsync");

const bcrypt = require("bcrypt");
let ObjectId = require("mongoose").Types.ObjectId;

/**
 * Display a listing of the resource.
 */
exports.index = catchAsync(async (req, res) => {
  const accept = req.accepts(["html", "json"]);
  if (accept === "json") {
    const count = await Agent.find().count();
    const search = req.query?.search
      ? new RegExp(req.query.search.value, "i")
      : "";

    // DATA
    const agents = await Agent.find({
      $or: [
        { fullName: search },
        { username: search },
        { email: search },
        { phone: search },
      ],
    })
      .sort("-createdAt")
      .select("fullName username phone email status role createdAt")
      .skip(req.query?.start ?? 10)
      .limit(req.query?.length ?? 10);

    // COUNT FILTERED DATA
    const totalFitlered = await Agent.find({
      $or: [
        { fullName: search },
        { username: search },
        { email: search },
        { phone: search },
      ],
    }).count();
    return res.send({
      status: "success",
      results: agents.length,

      recordsTotal: count,
      recordsFiltered: totalFitlered,
      data: agents,
    });
  }
  res.render("agents/index");
});
/**
 * Show the form for creating a new resource.
 * * DONE
 */
exports.create = catchAsync(async (req, res) => {
  res.render("agents/create", {
    resource: "agents",
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

  let agent = await Agent.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });

  if (agent) {
    return res.status(400).send({
      status: "fail",
      message: "Nom d'utilisateur ou email déja utilisé!",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  agent = new Agent({
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    password: hashed,
    phone: req.body.phone,
    role: req.body.role,
  });
  try {
    agent = await agent.save();
    res.send({
      status: "success",
      message: "Agent Crée Avec Succés!",
      data: agent,
    });
  } catch (e) {
    res.status(400).send({
      status: "fail",
      message: "Une erreur s'est produite!",
    });
  }
});
/**
 * Display the specified resource.
 */
exports.show = catchAsync(async (req, res) => {
  const agent = await Agent.findById(req.params.id).select(
    "_id fullName username password phone email status role"
  );
  if (!agent) return res.status(404).render("404");
  res.render("agents/details", agent);
});
/**
 * Show the form for editing the specified resource.
 */
exports.edit = catchAsync(async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(404).render("404");
  const agent = await Agent.findById(req.params.id).select(
    "_id fullName username password phone email status role"
  );
  if (!agent) return res.status(404).render("404");
  res.render("agents/details", {
    agent,
    resource: "agents",
  });
});
/**
 * Update the specified resource in storage.
 * * API
 */
exports.update = catchAsync(async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message,
    });

  const updateQuery = {
    fullName: req.body.fullName,
    // username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    role: req.body.role,
    status: req.body.status,
    updatedAt: new Date(Date.now()).toISOString(),
  };

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  if (req.body.password !== "______") updateQuery.password = hashed;

  const agent = await Agent.findByIdAndUpdate(req.params.id, updateQuery);
  if (!agent) return res.status(404).render("404");

  res.send({
    status: "success",
    message: "Agent Ajouté avec succes!",
    data: agent,
    resource: agent,
  });
});
/**
 * Remove the specified resource from storage.
 * * API
 */
exports.destroy = catchAsync(async (req, res) => {
  const agent = await Agent.findByIdAndRemove(req.params.id);
  if (!agent)
    return res.status(404).send({
      status: "fail",
      message: "Agent Introuvable!",
    });
  res.send({
    status: "success",
    message: "Agent suprimé avec Succes!",
  });
});
