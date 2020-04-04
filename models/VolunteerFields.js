// these fields should match the model and formData
// if it doesn't match then add a mapping array/object set

const common = [
  "mode",
  "name",
  "email",
  "mobile",
  "co_mobile",
  "address",
  "region",
  "pin",
  "notes",
  "services",
  "act",
];

exports.fieldMap = {
  individual: [...common, "individual"],
  organization: [...common, "organization"],
};

// build unique all fields list
const tempMap = [];
Object.values(this.fieldMap).forEach((ar) => {
  ar.forEach((i) => {
    tempMap[i] = 1;
  });
});

exports.allFields = Object.keys(tempMap) || [];

// volunteer query formats
exports.queryFormats = {
  region: "in",
  service_communications: "in",
  service_entrepreneurial: "in",
  service_essential: "in",
  service_health: "in",
};

exports.queryFieldFn = {
  default: (value) => value,
  in: (value) => ({ $in: value }),
};
