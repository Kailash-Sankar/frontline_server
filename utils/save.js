const apiResponse = require("../helpers/apiResponse");
const { parseFormData, valErrorHandler } = require("./helper");
const { validationResult } = require("express-validator");

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

module.exports = {
  handleSave,
};
