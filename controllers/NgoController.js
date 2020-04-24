const Ngo = require("../models/NgoModel");

const { body } = require("express-validator");
const auth = require("../middlewares/jwt");

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const {
  handleSearch,
  handleExport,
  handleSave,
  handleStatus,
  handleStatusUpdate,
} = require("../utils");

// create a new ngo record
exports.NgoStore = [
  //auth,
  body("mobile", "Mobile must not be empty.").isLength({ min: 1 }).trim(),
  body("name", "Name must not be empty.").isLength({ min: 1 }).trim(),
  body("email", "Email must not be empty.").isLength({ min: 1 }).trim(),
  (req, res) => {
    handleSave(req, res, Ngo);
  },
];

exports.search = [
  auth,
  function (req, res) {
    handleSearch(req, res, Ngo);
  },
];

// export data
exports.export = [
  auth,
  function (req, res) {
    handleExport(req, res, Ngo);
  },
];

// TODO: not used for now
exports.NgoStatus = [
  function (req, res) {
    const query = [{ $group: { _id: "$mode", nov: { $sum: 1 } } }];
    handleStatus(res, query, Ngo);
  },
];

exports.status = [
  function (req, res) {
    const query = [{ $group: { _id: "$status", status: { $sum: 1 } } }];
    handleStatus(res, query, Ngo);
  },
];

// Update the status of a record
exports.updateStatus = [
  auth,
  function (req, res) {
    handleStatusUpdate(req, res, Ngo);
  },
];
