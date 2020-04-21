const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const Schema = mongoose.Schema;

const VolunteerModel = new Schema(
  {
    mode: { type: String, required: true },
    name: { type: String, required: true },
    mobile: { type: String, require: true },
    act: { type: String, required: true },

    availability: { type: String, required: false },
    email: { type: String, required: false },
    address: { type: String, required: false },

    region: { type: [String], required: true },
    pin: { type: String, required: true },
    area: { type: String, required: false },

    services: {
      type: [
        {
          id: { type: String, required: true },
          values: {
            type: [
              {
                id: { type: String, required: true },
                attributes: { type: Object, required: false, default: {} },
              },
            ],
            required: false,
            default: [],
          },
        },
      ],
      required: true,
    },

    individual: {
      type: {
        dob: { type: Date, required: false },
        gender: { type: String, required: false },
        profession: { type: String, required: false },
        qualification: { type: String, required: false },
        aadhar: { type: String, required: false },
      },
      required: false,
      default: {},
    },

    organization: {
      type: {
        head: { type: String, required: false },
        person: { type: String, required: false },
        nov: { type: String, required: false },
        reg: { type: String, required: false },
        cat: { type: String, required: false },
      },
      required: false,
      default: {},
    },

    notes: { type: String, required: false },
    ref: {
      type: { appeal_id: { type: String, required: false } },
      required: false,
    },

    status: { type: String, required: true, default: "open" },
  },
  { timestamps: true }
);

VolunteerModel.plugin(mongoosePaginate);

module.exports = mongoose.model("Volunteer", VolunteerModel);
