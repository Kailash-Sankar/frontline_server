const { ValidationError } = require("./customError");
var mongoose = require("mongoose");
async function findRecordById(req, Model) {
  let _Id = req.params.id;
  let record = await Model.findById(_Id);
  if (!record) {
    throw new ValidationError("Record not found!");
  }
  return record;
}

function validateAndGetId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError("Invalid request Id!");
  }
  return new mongoose.Types.ObjectId(id);
}

module.exports = {
  findRecordById,
  validateAndGetId,
};
