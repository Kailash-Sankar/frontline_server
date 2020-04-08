const Request = require("../models/RequestModel");

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

// create a new request record
exports.RequestStore = [
  body("region", "Region must not be empty").isLength({ min: 1 }),
  body("pin", "Pin must not be empty.").isLength({ min: 1 }).trim(),
  //sanitizeBody("*").escape(),
  (req, res) => {
    console.log("Request post", req.body);
    try {
      const errors = validationResult(req);
      const parsedData = parseFormData(req.body);

      console.log("request", parsedData);

      let reqObj = new Request(parsedData);
      console.log("request", reqObj);

      if (!errors.isEmpty()) {
        return valErrorHandler(res, errors);
      } else {
        //Save
        reqObj.save(function (err) {
          if (err) {
            return apiResponse.ErrorResponse(res, err);
          }
          return apiResponse.successResponseWithData(
            res,
            "Help request added successfully.",
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
  auth,
  function (req, res) {
    try {
      const parsedData = parseQueryData(req.body.query);
      const query = buildQuery(parsedData);
      const limit = formatQueryLimit(req.body.limit);
      const page = req.body.page || 1;

      console.log("query", query, limit, page);

      Request.paginate(query, {
        page,
        limit,
        sort: { updatedAt: -1 },
      }).then((records) => {
        if (records.total > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            records
          );
        } else {
          return apiResponse.successResponseWithData(res, "Operation success", {
            docs: [],
          });
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
      Request.find({})
        .count()
        .then((count) => {
          if (count) {
            return apiResponse.successResponseWithData(
              res,
              "Operation success",
              { requests: count }
            );
          } else {
            return apiResponse.successResponseWithData(
              res,
              "Operation success",
              { requests: 0 }
            );
          }
        });
    } catch (err) {
      console.log("errors", err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

// Update the status of a request record
exports.updateStatus = [
  // auth,
  function (req, res) {
    console.log("request body", req.body)
    const query = req.params.id
    const status = req.body.status

    Request.findByIdAndUpdate(query, { status: status }, { new: true },
      (err, record) => {
        if (err) {
          console.log("errors", err);
          //throw error in json response with status 500.
          return apiResponse.ErrorResponse(res, err);
        } else {
          console.log("updated record", record);
          console.log("updated record length", record.length);
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            record
          );
        }
      });
  },
];
