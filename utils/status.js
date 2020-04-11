const { formatStatusData } = require("./helper");
const apiResponse = require("../helpers/apiResponse");

function handleStatus(res, query, Model) {
  try {
    Model.aggregate(query).then((records) => {
      if (records.length > 0) {
        return apiResponse.successResponseWithData(
          res,
          "Operation success",
          formatStatusData(records)
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
    return apiResponse.ErrorResponse(res, err);
  }
}

module.exports = {
  handleStatus,
};
