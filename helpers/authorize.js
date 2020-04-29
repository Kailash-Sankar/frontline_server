const { unauthorizedResponse } = require("./apiResponse");

// validate user roles
// accepts array of roles
function authorizeRole(roles = []) {
  return (req, res, next) => {
    // auth step in middleware pushed user object in to req
    const user = req.user;
    if (user && roles.includes(user.role)) {
      next();
    } else {
      // return error response
      unauthorizedResponse(res, "Unauthorized");
    }
  };
}

exports.authorizeRole = authorizeRole;
