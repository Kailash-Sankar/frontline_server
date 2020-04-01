const {
  fieldMap,
  queryFormats,
  queryFieldFn,
  allFields
} = require("../models/VolunteerFields");

// builds and maps form data, ignores unpsecified values
const parseFormData = (data) => {
  const res = {};
  if ("mode" in data) {
    const fields = fieldMap[data.mode] || [];
    fields.forEach((f) => {
      if (f in data) {
        res[f] = data[f];
      }
    });
  }
  return res;
};

// builds and maps query data, ignores unpsecified values
const parseQueryData = (data) => {
  const res = {};
  if ("mode" in data) {
    return parseFormData(data);
  } else {
    // consider all fields, ignore undefined values
    allFields.forEach((f) => {
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

module.exports = {
  parseFormData,
  parseQueryData,
  VolunteerData,
  buildQuery,
  formatStatusData
};
