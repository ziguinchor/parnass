const express = require("express");
const res = require("express/lib/response");
const mongoose = require("mongoose");
const { Lead } = require("../models/lead");
const { Agent } = require("../models/agent");
const { getCenters } = require("../controllers/centerController");
const { curMonthRange, CurrMonthRange } = require("../utils/helpers");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Console } = require("winston/lib/winston/transports");

var ObjectId = require("mongoose").Types.ObjectId;

exports.index = catchAsync(async (req, res, next) => {
  const { start, end, today } = CurrMonthRange();
  const stats = await profitPerAgent(start, end, "confirmed");

  const champion =
    stats.length &&
    stats.reduce((a, b) => {
      return b.totalBudget > a.totalBudget ? b : a;
    });
  res.render("dashboard/index", {
    champion: { ...champion, id: champion._id },
    totalSales: await calcMonthlyStat(start, end, "confirmed"),
  });
});

exports.getStats = async (req, res, next) => {
  const { start, end, today } = CurrMonthRange();

  const [dailyConfirmedLeads, dailyCancelledLeads] = await Promise.all([
    calcDailyStats(start, today, "confirmed"),
    calcDailyStats(start, today, "cancelled"),
  ]);
  // REV : STATUS WISE
  console.log(await totalMonthlyLeads(start, end, "confirmed"));
  console.log(await totalMonthlyLeads(start, end, "cancelled"));
  const [confirmed, cancelled] = await Promise.all([
    totalMonthlyLeads(start, end, "confirmed"),
    totalMonthlyLeads(start, end, "cancelled"),
  ]);
  // REV : CENTER WISE
  let centers = getCenters();
  let centerRevs = await Promise.all(
    centers.map((center) =>
      totalLeadsPerCenter(start, end, center, "confirmed")
    )
  );

  res.send({
    conversionRate: {
      series: [confirmed, cancelled],
      labels: ["Confirmé", "Annulé"],
    },
    revPerCenter: {
      series: centerRevs,
      labels: [...centers],
    },
    dailyConfirmedLeads: dailyConfirmedLeads,
    dailyCancelledLeads: dailyCancelledLeads,
  });
};
/**
 * Get Shampion
 */
async function getLeadsPerAgent(start, end, status) {
  const leadsPerAgent = await Lead.aggregate([
    {
      $match: {
        $and: [
          { createdAt: { $gte: start, $lt: end } },
          {
            status: status,
          },
        ],
      },
    },
    {
      $group: {
        _id: "$agent._id",
        totalBudget: { $sum: { $add: "$finalBudget" } },
        sum: { $sum: 1 },
      },
    },
  ]);
  return leadsPerAgent;
}

/**
 * Calc Revenue Per Center
 */
async function calcMonthlyStat(start, end, status) {
  const tn = await Lead.aggregate([
    {
      $match: {
        $and: [
          { createdAt: { $gte: start, $lt: end } },
          {
            status: status,
          },
        ],
      },
    },
    {
      $group: {
        _id: "$status",
        total: { $sum: { $add: "$finalBudget" } },
        // _id: { $month: "$createdAt" },
        totalBudget: { $sum: "$finalBudget" },
      },
    },
  ]);
  if (tn.length) return tn[0].total;
  else return 0;
}
/**
 * Calc Daily Revenues / status
 */
async function calcDailyStats(start, end, status) {
  const dailyStats = await Lead.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
        status: status,
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: "$createdAt" },
        totalBudget: { $sum: "$finalBudget" },
        sum: { $sum: 1 },
      },
    },
  ]);
  const computedStats = [];
  // formulate output for each day within the specified time
  const diffInTime = end.getTime() - start.getTime();
  let DiffInDays = diffInTime / (1000 * 3600 * 24);

  for (let i = 1; i <= DiffInDays; i++) {
    const isRetreived = dailyStats.filter((s) => s._id === i)[0];
    computedStats.push({
      day: i,
      data: isRetreived?.totalBudget
        ? isRetreived
        : { _id: i, sum: 0, totalBudget: 0 },
    });
  }
  return computedStats;
}

/**
 * Get Current Month Total Confirmed Leads
 */
async function totalMonthlyLeads(start, end, status) {
  const totalData = await Lead.aggregate([
    {
      $match: {
        $and: [
          { createdAt: { $gte: start, $lt: end } },
          {
            status: status,
          },
        ],
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $add: 1 } },
      },
    },
  ]);

  if (totalData.length) return totalData[0].total;
  else return 0;
}

async function totalLeadsPerCenter(start, end, center, status) {
  const totalData = await Lead.aggregate([
    {
      $match: {
        $and: [
          { createdAt: { $gte: start, $lt: end } },
          {
            center: center,
          },
          {
            status: status,
          },
        ],
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $add: "$finalBudget" } },
      },
    },
  ]);

  return totalData.length ? totalData[0].total : 0;
}

async function profitPerAgent(start, end, status) {
  const stats = await getLeadsPerAgent(start, end, status);

  let agents = [];
  agents = await Promise.all(
    stats.map((d) =>
      Agent.findById(d._id).select(
        "fullName username phone email status createdAt"
      )
    )
  );

  const statsPetAgent = stats.map((stat) => {
    const correspondingAgent = agents.filter((agent) => {
      if (!agent) return false;
      return agent._id.toString() === stat._id.toString();
    })[0];
    if (!correspondingAgent) return;
    return {
      ...stat,
      ...correspondingAgent.toJSON(),
    };
  });
  return statsPetAgent.filter((v) => !!v);
}
