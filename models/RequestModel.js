const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const Schema = mongoose.Schema;

const SubRequestModel = new Schema(
  {
    relief_type: { type: [String], required: true },
    sr_status: { // sub request status
      type: String,
      required: true,
      enum: ['open', 'in-progress', 'fulfilled', 'check'],
      default: 'open'
    },
    priority: { type: String, required: true, enum: ['normal', 'high', 'escalated'], default: 'normal' },
    items: {
      type: [
        {
          item: { type: String, required: true },  // Item. It can be free text like wheat, rice, gloves etc.
          quantity: { type: Number, required: true },  // Requested Quantity
          unit: { type: String, required: true, enum: ['kg', 'count', 'pair', 'ltr'] },	// Unit of measurement

          rem_quantity: { type: Number, required: false }, // Remaining quantity, incase of partial acceptance

          ngos: { // To maintain the details of the partially accepted items by the NGOs
            type: [
              {
                ngo_id: {type: String, required: true}, // Ngo object id or ngo user
                accepted_quantity: { type: Number, required: true },  // Accepted Quantity
                notes: {type: String, required: false}, // To communicate any information about the item provided by the NGO
              }
            ],
            required: false
          },
        },
        { timestamps: true }
      ],
      required: false,
    },
    ngos_acceptance: { // Ngos acceptance status of the sub request
      type: [
        {
          ngo_id: {type: String, required: true}, // Ngo object id or ngo user
          acc_status: { type: String, required: true, enum: ['accepted', 'partial', 'denied'] }, // acceptance staus
        },
        { timestamps: true }
      ],
      required: false
    },
    comments: {
      type: [
        {
          user: {type: String, required: true},
          comment: {type: String, required: true},
        },
        { timestamps: true }
      ],
      required: false
    },
  },
  { timestamps: true}
);

const RequestModel = new Schema(
  {
    act: { type: String, required: true },
    name: { type: String, required: true },
    mobile: { type: String, require: true },

    address: { type: String, required: false },
    area: { type: String, required: true },
    region: { type: [String], required: true },
    ward: { type: String, required: false },
    zone: { type: String, required: false },
    pin: { type: String, required: false },
    longitude: { type: Number, required: false },
    lattitude: { type: Number, required: false },

    poc_name: { type: String, required: true },
    poc_mobile: { type: Number, required: true },
    nop: { type: Number, required: true }, // Number of persons need help

    desc: { type: String, required: true },
    status: { type: String, required: true, enum: ["open", "invalid", "in-progress", "partial", "closed"], default: "open" },

    device: { type: String, required: false },   // Type of device from where the request is created

    subrequest: [ SubRequestModel ]
  },
  { timestamps: true }
);

RequestModel.plugin(mongoosePaginate);

module.exports = mongoose.model("Request", RequestModel);
