// these fields should match the model and formData
// if it doesn't match then add a mapping array/object set
exports.fieldMap = {
  individual: [
    "mode",
    "name",
    "email",
    "dob",
    "gender",
    "mobile",
    "co_mobile",
    "address",
    "region",
    "pin",
    "availability",
    "qualification",
    "profession",
    "service_essential",
    "service_health",
    "service_communications",
    "service_entrepreneurial",
    "notes"
  ],
  organization: [
    "mode",
    "name",
    "org_head",
    "org_type",
    "org_reg",
    "org_nov",
    "address",
    "region",
    "pin",
    "org_person",
    "email",
    "mobile",
    "co_mobile",
    "availability",
    "service_essential",
    "service_health",
    "service_communications",
    "service_entrepreneurial",
    "notes"
  ]
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
  service_health: "in"
};

exports.queryFieldFn = {
  default: (value) => value,
  in: (value) => ({ $in: value })
};
