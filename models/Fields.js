// these fields should match the model and formData
// if it doesn't match then add a mapping array/object set

const volunteerFields = [
  "mode",
  "name",
  "email",
  "mobile",
  "address",
  "region",
  "pin",
  "area",
  "notes",
  "services",
  "act",
  "availability",
  "individual",
  "organization",
  "ref",
];

const appealFields = ["act", "region", "pin", "services", "desc", "tags"];

const requestFields = [
  "act",
  "name",
  "mobile",
  "address",
  "area",
  "region",
  "pin",
  "desc",
  "poc_mobile",
  "poc_name",
  "nop",
];

const ngoFields = [
  "act",
  "name",
  "email",
  "mobile",
  "alt_mob",
  "address",
  "reg",
  "person",
  "region",
  "bbmp",
  "nov",
  "covid19",
];

// fields which are only applicable to queries
const queryFields = ["createdAt", "status"];

const fields = [...volunteerFields, ...appealFields];

// build unique all fields list
const tempMap = {};
fields.forEach((f) => {
  tempMap[f] = 1;
});
const allFields = Object.keys(tempMap) || [];

const actMap = {
  volunteer: volunteerFields,
  kind: volunteerFields,
  appeal: appealFields,
  request: requestFields,
  ngo: ngoFields,
  all: allFields,
};

exports.getFieldList = (act = "all") => {
  if (act in actMap) {
    return actMap[act];
  }
  return [];
};

exports.getQueryFieldList = (act = "all") => {
  if (act in actMap) {
    return actMap[act].concat(queryFields);
  }
  return [];
};

// volunteer query formats
exports.queryFormats = {
  region: "in",
  service_communications: "in",
  service_entrepreneurial: "in",
  service_essential: "in",
  service_health: "in",
  createdAt: "between",
};

exports.queryFieldFn = {
  default: (value) => value,
  in: (value) => ({ $in: value }),
  between: (value) => ({ $gte: value[0], $lt: value[1] }),
};
