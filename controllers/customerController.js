const express = require("express");
const catchAsync = require("../utils/catchAsync");

/**
 * Display a listing of the resource.
 */
exports.index = catchAsync(async (req, res, next) => {
  res.render("customers/index", {
    breadCrumbs: {
      page: "Liste",
      parent: "Clients",
    },
  });
});
/**
 * Show the form for creating a new resource.
 */
exports.create = catchAsync(async (req, res, next) => {
  res.render("customers/create", {
    breadCrumbs: {
      page: "Nouveau",
      parent: "Client",
    },
  });
});
/**
 * Store a newly created resource in storage.
 */
exports.store = catchAsync(async (req, res, next) => {});
/**
 * Display the specified resource.
 */
exports.show = catchAsync(async (req, res, next) => {
  res.render("customers/details");
});
/**
 * Show the form for editing the specified resource.
 */
exports.edit = catchAsync(async (req, res, next) => {
  res.render("customers/details", {
    breadCrumbs: {
      page: "Détails",
      parent: "Comptes",
    },
  });
});
/**
 * Update the specified resource in storage.
 */
exports.update = catchAsync(async (req, res, next) => {});
/**
 * Remove the specified resource from storage.
 */
exports.destroy = catchAsync(async (req, res, next) => {});
