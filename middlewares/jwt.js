const jwt = require("express-jwt");
const secret = process.env.JWT_SECRET;

const authenticate = jwt({
  secret: secret,
});

// repurposed express jwt middleware for socket auth
const authenticateWS = jwt({
  secret: secret,
  getToken: function (req) {
    return req.token;
  },
});

module.exports = authenticate;

module.exports.authenticateWS = authenticateWS;
