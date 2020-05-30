const mongoose = require("mongoose");
const TokenModel = require("../models/TokenModel");

const toObjectId = (str) => mongoose.Types.ObjectId(str);

// authenticate websocket token
async function authWebSocketToken(token) {
  try {
    const res = await TokenModel.findById(toObjectId(token));
    if (res) {
      return res;
    }
    throw "Token not found";
  } catch (err) {
    throw "Websocket token authentication failed.";
  }
}

module.exports = authWebSocketToken;
