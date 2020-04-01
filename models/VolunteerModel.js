const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VolunteerModel = new Schema(
  {
    mode: { type: String, required: true },
    name: { type: String, required: true },
    mobile: { type: String, require: true },

    region: { type: [String], required: true },
    pin: { type: String, required: true },
    availability: { type: String, required: true },

    email: { type: String, required: false },
    dob: { type: Date, required: false },
    gender: { type: String, required: false },

    profession: { type: String, required: false },
    qualification: { type: String, required: false },
    address: { type: String, required: false },

    service_communications: { type: [String], required: false },
    service_entrepreneurial: { type: [String], required: false },
    service_essential: { type: [String], required: false },
    service_health: { type: [String], required: false },

    org_head: { type: String, required: false },
    org_person: { type: String, required: true },
    org_nov: { type: String, required: false },
    org_reg: { type: String, required: false },
    org_type: { type: String, required: false },

    notes: { type: String, required: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", VolunteerModel);
