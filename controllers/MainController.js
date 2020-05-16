const Volunteer = require("../models/VolunteerModel");
const Lookup = require("../models/LookupModel");

const { body } = require("express-validator");
const auth = require("../middlewares/jwt");

// helpers
const {
  successResponseWithData,
  asyncH
} = require("../helpers/apiResponse");

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const {
  handleSearch,
  handleExport,
  handleSave,
  handleStatus,
  handleStatusUpdate,
} = require("../utils");

// create a new volunteer record
exports.VolunteerStore = [
  //auth,
  body("mobile", "Mobile must not be empty.").isLength({ min: 1 }).trim(),
  body("name", "Name must not be empty.").isLength({ min: 1 }).trim(),
  (req, res) => {
    handleSave(req, res, Volunteer);
  },
];

exports.search = [
  auth,
  function (req, res) {
    handleSearch(req, res, Volunteer);
  },
];

// export data
exports.export = [
  auth,
  function (req, res) {
    handleExport(req, res, Volunteer);
  },
];

// TODO: not used for now
exports.VolunteerStatus = [
  function (req, res) {
    const query = [{ $group: { _id: "$mode", nov: { $sum: 1 } } }];
    handleStatus(res, query, Volunteer);
  },
];

exports.status = [
  function (req, res) {
    const query = [{ $group: { _id: "$status", status: { $sum: 1 } } }];
    handleStatus(res, query, Volunteer);
  },
];

// Update the status of a record
exports.updateStatus = [
  auth,
  function (req, res) {
    handleStatusUpdate(req, res, Volunteer);
  },
];

exports.lookup = [
  asyncH(async (req, res) => {
    const records = await Lookup.find({bbmp_zones : { $exists: true }})

    return successResponseWithData(
      res,
      "Operation success",
      records || {}
    );
  })
]
