const params = require('params');
const apiResponse = require("../helpers/apiResponse");
const { parseFormData, valErrorHandler } = require("./helper");
const { validationResult } = require("express-validator");
const { ValidationError } = require("./customError")
const { ngoFields } = require("../models/Fields")

// save standard form data
function handleSave(req, res, Model) {
  try {
    const errors = validationResult(req);
    const parsedData = parseFormData(req.body);
    let newObj = new Model(parsedData);
    if (!errors.isEmpty()) {
      return valErrorHandler(res, errors);
    } else {
      newObj.save(function (err) {
        if (err) {
          return apiResponse.ErrorResponse(res, err);
        }
        return apiResponse.successResponseWithData(
          res,
          "Record added successfully.",
          {}
        );
      });
    }
  } catch (err) {
    console.log("errors", err);
    //throw error in json response with status 500.
    return apiResponse.ErrorResponse(res, err);
  }
}

// validate form fields
function validateFormData(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array())
  }
}

// save form fields
async function saveForm(req, Model) {
  const parsedData = params(req.body).only(ngoFields)
  let Obj = new Model(parsedData);
  await Obj.save()
}

async function handleSaveAsync(req, Model) {
  validateFormData(req);
  await saveForm(req, Model)
}

module.exports = {
  handleSave,
  handleSaveAsync,
};
