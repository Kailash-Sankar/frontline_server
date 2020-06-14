const Request = require("../models/RequestModel");

const { body, param  } = require("express-validator");
const auth = require("../middlewares/jwt");

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const {
  handleSearch,
  handleExport,
  handleSave,
  handleStatus,
  handleStatusUpdate,
  findRecordById,
  validateAndGetId,
} = require("../utils");

// helpers
const { successResponseWithData, asyncH } = require("../helpers/apiResponse");
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

// export data
exports.export = [
  auth,
  function (req, res) {
    handleExport(req, res, Request);
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

// Get request for given request id
exports.getRequest = [
  auth,
  param("id", "id must not be empty")
    .isLength({ min: 1 })
    .customSanitizer((id) => {
      return validateAndGetId(id);
    }),
  asyncH(async (req, res) => {
    const request = await findRecordById(req, Request);
    return successResponseWithData(res, "Record found successfully.", request);
  }),
];
