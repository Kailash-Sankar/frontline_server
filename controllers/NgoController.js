const Ngo = require("../models/NgoModel");

const { body } = require("express-validator");
const auth = require("../middlewares/jwt");

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// helpers
const mailer = require("../helpers/mailer");
const {
  successResponseWithData,
  asyncH
} = require("../helpers/apiResponse");

const {
  handleSearch,
  handleExport,
  handleSaveAsync,
  handleStatus,
  handleStatusUpdate,
} = require("../utils");

// create a new ngo record
exports.NgoStore = [
  body("mobile", "Mobile must not be empty.").isLength({ min: 1 }).trim(),
  body("name", "Name must not be empty.").isLength({ min: 1 }).trim(),
  body("email", "Email must not be empty.").isLength({ min: 1 }).trim(),
  asyncH(async (req, res, next) => {
    await handleSaveAsync(req, res, next, Ngo);
    await mailer.send(
      'rtkanan@gmail.com',
      'rtkanan@gmail.com',
      'Hello',
      '<b>Hello world</b>'
    );
    return successResponseWithData(
      res,
      "Record added successfully.",
      {}
    );
  }),
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

exports.status = [
  function (req, res) {
    const query = [{ $group: { _id: "$status", status: { $sum: 1 } } }];
    handleStatus(res, query, Ngo);
  },
];

// Verify the NGO Registration details
exports.updateStatus = [
  auth,
  function (req, res) {
    handleStatusUpdate(req, res, Ngo);
  },
];
