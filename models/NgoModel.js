const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const Schema = mongoose.Schema;

const NgoModel = new Schema(
  {
    act: { type: String, required: true },

    name: { type: String, required: true }, // NGO's name
    email: { type: String, required: true },
    mobile: { type: Number, require: true },
    alt_mob: { type: Number },

    address: { type: String, required: false }, // NGO's address
    reg: { type: String, required: true },
    person: { type: String, required: true }, // NGO's point of contact (nodal person)

    region: { type: [String], required: true }, // Operating districts
    bbmp: [
      {
        zone: { type: String },
        ward: { type: String },
        pincodes: { type: [Number] },
      }
    ], // Areas operating in Bangalore Urban (BBMP)

    nov: { type: Number, required: true }, // Number of volunteers available
    covid19: { type: String, required: true }, // Activities undertaken for covid 19
    status: { type: String, required: true, enum: ['new', 'verified'], default: 'new' },
  },
  { timestamps: true }
);

NgoModel.plugin(mongoosePaginate);

module.exports = mongoose.model("Ngo", NgoModel);
