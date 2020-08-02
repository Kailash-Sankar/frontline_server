const { handleSearch, handleExport } = require("./report");
const { handleSave, handleSaveAsync } = require("./save");
const { handleStatus } = require("./status");
const { handleStatusUpdate, updateOne } = require("./update");
const { ValidationError } = require("./customError");
const { findRecordById, validateAndGetId } = require("./record");
const { paginateRecords } = require("./paginate");

module.exports = {
  handleSearch,
  handleExport,
  handleSave,
  handleSaveAsync,
  handleStatus,
  handleStatusUpdate,
  ValidationError,
  updateOne,
  findRecordById,
  validateAndGetId,
  paginateRecords
};
