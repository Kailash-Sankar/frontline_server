const Request = require("../models/RequestModel");

const { body } = require("express-validator");
const auth = require("../middlewares/jwt");

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const {
  handleSearch,
  handleSave,
  handleStatus,
  handleStatusUpdate,
} = require("../utils");

// create a new request record
exports.RequestStore = [
  body("region", "Region must not be empty").isLength({ min: 1 }),
  body("pin", "Pin must not be empty.").isLength({ min: 1 }).trim(),
  (req, res) => {
    handleSave(req, res, Request);
  },
];

exports.search = [
  auth,
  function (req, res) {
    handleSearch(req, res, Request);
  },
];

exports.status = [
  function (req, res) {
    const query = [{ $group: { _id: "$status", status: { $sum: 1 } } }];
    handleStatus(res, query, Request);
  },
];

// Update the status of a request record
exports.updateStatus = [
  auth,
  function (req, res) {
    handleStatusUpdate(req, res, Request);
  },
];
