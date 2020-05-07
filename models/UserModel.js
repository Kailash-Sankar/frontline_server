var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'staff', 'ngo'],
      default: "staff"
    },
  },
  { timestamps: true }
);

// Virtual for user's full name
UserSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model("User", UserSchema);
