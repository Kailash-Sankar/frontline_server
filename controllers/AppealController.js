const Appeal = require("../models/AppealModel");
const { body } = require("express-validator");
const auth = require("../middlewares/jwt");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const {
  handleSearch,
  handleSave,
  handleStatus,
  handleStatusUpdate,
} = require("../utils");

// create a new appeal record
exports.AppealStore = [
  auth,
  body("region", "Region must not be empty").isLength({ min: 1 }),
  body("pin", "Pin must not be empty.").isLength({ min: 1 }).trim(),
  (req, res) => {
    handleSave(req, res, Appeal);
  },
];

// search appeals
exports.search = [
  //auth, kept disabled for home page search, ideally we need another route for this
  function (req, res) {
    handleSearch(req, res, Appeal);
  },
];

// get count grouped by status
exports.status = [
  function (req, res) {
    const query = [{ $group: { _id: "$status", status: { $sum: 1 } } }];
    handleStatus(res, query, Appeal);
  },
];

// Update the status of a appeal record
exports.updateStatus = [
  auth,
  function (req, res) {
    handleStatusUpdate(req, res, Appeal);
  },
];
