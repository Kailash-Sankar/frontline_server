const { parseQueryData, formatQueryLimit, buildQuery } = require("./helper");
const apiResponse = require("../helpers/apiResponse");

// handle standard report api
function handleSearch(req, res, Model) {
  try {
    const parsedData = parseQueryData(req.body.query);
    const query = buildQuery(parsedData);
    const limit = formatQueryLimit(req.body.limit);
    const page = req.body.page || 1;

    console.log("query", query, limit, page);

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
    //throw error in json response with status 500.
    return apiResponse.ErrorResponse(res, err);
  }
}

module.exports = {
  handleSearch,
};
