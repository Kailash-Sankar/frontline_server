const apiResponse = require("../helpers/apiResponse");

function handleStatusUpdate(req, res, Model) {
  try {
    const query = req.params.id;
    const status = req.body.status;

    Model.findByIdAndUpdate(
      query,
      { status: status },
      { new: true },
      (err, record) => {
        if (err) {
          console.log("errors", err);
          return apiResponse.ErrorResponse(res, err);
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            record || {}
          );
        }
      }
    );
  } catch (err) {
    console.log("errors", err);
    return apiResponse.ErrorResponse(res, err);
  }
}

module.exports = {
  handleStatusUpdate,
};
