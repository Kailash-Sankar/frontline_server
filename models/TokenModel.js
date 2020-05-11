const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  token_type: { type: String, required: true },
  user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, expires: "15m", default: Date.now },
});

module.exports = mongoose.model("Token", TokenSchema);
