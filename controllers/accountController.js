const express = require("express");

/**
 * Display a listing of the resource.
 */
exports.index = (req, res) => {
  res.render("account/index");
};
/**
 * Show the form for creating a new resource.
 */
// exports.create = (req, res) => {};
/**
 * Store a newly created resource in storage.
 */
exports.store = (req, res) => {};
/**
 * Display the specified resource.
 */
exports.show = (req, res) => {
  res.render("account/details");
};
/**
 * Show the form for editing the specified resource.
 */
// exports.edit = (req, res) => {};
/**
 * Update the specified resource in storage.
 */
exports.update = (req, res) => {};
/**
 * Remove the specified resource from storage.
 */
exports.destroy = (req, res) => {};

/**
 * Display a listing of the resource.
 */
exports.index = (req, res) => {
  res.render("account/index", {
    breadCrumbs: {
      page: "Liste",
      parent: "Comptes",
    },
  });
};
/**
 * Show the form for creating a new resource.
 */
exports.create = (req, res) => {
  res.render("account/create", {
    breadCrumbs: {
      page: "Nouveau Compte",
      parent: "Comptes",
    },
  });
};
/**
 * Store a newly created resource in storage.
 */
exports.store = (req, res) => {};
/**
 * Display the specified resource.
 */
exports.show = (req, res) => {
  res.render("account/details", {
    breadCrumbs: {
      page: "Nouveau Compte",
      parent: "Comptes",
    },
  });
};
/**
 * Show the form for editing the specified resource.
 */
exports.edit = (req, res) => {
  res.render("account/details", {
    breadCrumbs: {
      page: "Modifier Compte",
      parent: "Comptes",
    },
  });
};
/**
 * Update the specified resource in storage.
 */
exports.update = (req, res) => {};
/**
 * Remove the specified resource from storage.
 */
exports.destroy = (req, res) => {};
