const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate");

const Schema = mongoose.Schema;

const LookupModel = new Schema(
  {
    bbmp_zones: [ // Areas operating in Bangalore Urban (BBMP)
      {
        _id: false,
        label: { type: String },
        value: { type: String },
        wards: [
          {
            _id: false,
            label: { type: String },
            value: { type: String },
            ward_no: { type: Number },
            pin: { type: Number },
            areas: { type: [String] }
          }
        ],
      }
    ],
  }
);

// LookupModel.plugin(mongoosePaginate);

module.exports = mongoose.model("Lookup", LookupModel);
