const Appeal = require("../models/AppealModel");

const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const {
  parseFormData,
  parseQueryData,
  buildQuery,
  formatQueryLimit,
} = require("./utils");

// handle generic errors
const valErrorHandler = (res, errors) =>
  apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());

// create a new volunteer record
exports.AppealStore = [
  auth,
  body("region", "Region must not be empty").isLength({ min: 1 }),
  body("pin", "Pin must not be empty.").isLength({ min: 1 }).trim(),
  //sanitizeBody("*").escape(),
  (req, res) => {
    console.log("Appeal post", req.body);
    try {
      const errors = validationResult(req);
      const parsedData = parseFormData(req.body);

      console.log("appeal", parsedData);

      let appealObj = new Appeal(parsedData);
      console.log("appeal", appealObj);

      if (!errors.isEmpty()) {
        return valErrorHandler(res, errors);
      } else {
        //Save
        appealObj.save(function (err) {
          if (err) {
            return apiResponse.ErrorResponse(res, err);
          }
          return apiResponse.successResponseWithData(
            res,
            "Appeal added successfully.",
            {}
          );
        });
      }
    } catch (err) {
      console.log("errors", err);
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.search = [
  //auth, kept disabled for home page search, ideally we need another route for this
  function (req, res) {
    try {
      const parsedData = parseQueryData(req.body.query);
      const query = buildQuery(parsedData);
      const limit = formatQueryLimit(req.body.limit);

      console.log("query", query, limit);
      console.log("user info", req.user);

      Appeal.find(query, {}) // _id: 0
        .sort({ updatedAt: -1 })
        .limit(limit)
        .then((records) => {
          if (records.length > 0) {
            return apiResponse.successResponseWithData(
              res,
              "Operation success",
              records
            );
          } else {
            return apiResponse.successResponseWithData(
              res,
              "Operation success",
              []
            );
          }
        });
    } catch (err) {
      console.log("errors", err);
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.status = [
  function (req, res) {
    try {
      Appeal.find({})
        .count()
        .then((count) => {
          if (count) {
            return apiResponse.successResponseWithData(
              res,
              "Operation success",
              { appeals: count }
            );
          } else {
            return apiResponse.successResponseWithData(
              res,
              "Operation success",
              { appeals: 0 }
            );
          }
        });
    } catch (err) {
      console.log("errors", err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
