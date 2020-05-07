const { apiResponse } = require("../helpers/apiResponse");
const { ValidationError } = require("./customError")

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

async function updateOne(Model, query, update) {
  let record = await Model.findOne(query)
  if(!record) {
    throw new ValidationError("Record not found!")
  }
  record.set(update);
  record = await record.save()
  return record
}

module.exports = {
  handleStatusUpdate,
  updateOne,
};
