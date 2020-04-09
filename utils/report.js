const { parseQueryData, formatQueryLimit, buildQuery } = require("./helper");
const apiResponse = require("../helpers/apiResponse");

const { exportLimit, excludeKeys } = require("./constant");

// handle standard report api
function handleSearch(req, res, Model) {
  try {
    const parsedData = parseQueryData(req.body.query);
    const query = buildQuery(parsedData);
    const limit = formatQueryLimit(req.body.limit);
    const page = req.body.page || 1;

    console.log("search", query, limit, page);

    Model.paginate(query, {
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
    return apiResponse.ErrorResponse(res, err);
  }
}

function handleExport(req, res, Model) {
  try {
    const parsedData = parseQueryData(req.body.query);
    const query = buildQuery(parsedData);

    console.log("export", query);
    Model.find(query, excludeKeys)
      .limit(exportLimit)
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
    return apiResponse.ErrorResponse(res, err);
  }
}

module.exports = {
  handleSearch,
  handleExport,
};
