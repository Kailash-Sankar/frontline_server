const {
  getFieldList,
  queryFormats,
  queryFieldFn,
} = require("../models/Fields");

// builds and maps form data, ignores unpsecified values
const parseFormData = (data = {}) => {
  const res = {};
  if ("act" in data) {
    const fields = getFieldList(data.act);
    fields.forEach((f) => {
      if (f in data && data[f]) {
        res[f] = data[f];
      }
    });
  }
  return res;
};

// builds and maps query data, ignores unpsecified values
// redundant as above, but kept so for flexibility
const parseQueryData = (data = {}) => {
  const res = {};
  if ("act" in data) {
    const fields = getFieldList(data.act);
    // consider all fields, ignore undefined values
    fields.forEach((f) => {
      if (f in data && data[f]) {
        res[f] = data[f];
      }
    });
  }
  return res;
};

// buld query
const buildQuery = (params) => {
  const query = {};
  // filters out "all" cases
  // add additional processing if any here
  Object.keys(params).forEach((p) => {
    if (params[p] !== "all") {
      const qf = queryFormats[p] || "default";
      const queryGenFn = queryFieldFn[qf];
      query[p] = queryGenFn(params[p]);
    }
  });
  return query;
};

// formatting for essential data response
function VolunteerData(data) {
  this.id = data.id;
  this.name = data.name;
  this.createdAt = data.createdAt;
}

function formatStatusData(data) {
  const res = {};
  data.forEach((d) => {
    res[d._id] = d.nov;
  });
  return res;
}

function formatQueryLimit(limit) {
  if (Number.isInteger(limit) && limit > 0 && limit <= 50) {
    return limit;
  }
  return 25;
}

module.exports = {
  parseFormData,
  parseQueryData,
  VolunteerData,
  buildQuery,
  formatStatusData,
  formatQueryLimit,
};
