const UserModel = require("../models/UserModel");
const TokenModel = require("../models/TokenModel");

const { body, validationResult } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/jwt");

const { authorizeRole } = require("../helpers/authorize");

exports.register = [
  auth,
  authorizeRole(["admin"]),
  // Validate fields
  body("firstName")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters.")
    .escape(),
  body("lastName")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Last name must be specified.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters.")
    .escape(),
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .custom((value) => {
      return UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    })
    .escape(),
  body("password")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be 6 characters or greater.")
    .escape(),
  // Process request after validation and sanitization.
  (req, res) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        //hash input password
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          // Create User object with escaped and trimmed data
          var user = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
          });

          console.log("user", user);

          // Save user.
          user.save(function (err) {
            if (err) {
              return apiResponse.ErrorResponse(res, err);
            }
            let userData = {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            };
            return apiResponse.successResponseWithData(
              res,
              "Registration Success.",
              userData
            );
          });
        });
      }
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.login = [
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .escape(),
  body("password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Password must be specified.")
    .escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        UserModel.findOne({ email: req.body.email }).then((user) => {
          if (user) {
            //Compare given password with db's hash.
            // convert back from base64
            const pwd = Buffer.from(req.body.password, "base64").toString();
            bcrypt.compare(pwd, user.password, function (err, same) {
              if (same) {
                // Check User's account active or not.
                if (user.status) {
                  let userData = {
                    _id: user._id,
                    name: user.fullName,
                    email: user.email,
                    role: user.role || "na",
                  };
                  //Prepare JWT token for authentication
                  const jwtPayload = userData;
                  const jwtData = {
                    expiresIn: process.env.JWT_TIMEOUT_DURATION,
                  };
                  const secret = process.env.JWT_SECRET;
                  //Generated JWT token with Payload and secret.
                  userData.token = jwt.sign(jwtPayload, secret, jwtData);
                  return apiResponse.successResponseWithData(
                    res,
                    "Login Success.",
                    userData
                  );
                } else {
                  return apiResponse.unauthorizedResponse(
                    res,
                    "Account is not active. Please contact admin."
                  );
                }
              } else {
                return apiResponse.validationErrorWithData(
                  res,
                  "Email or Password wrong.",
                  {}
                );
              }
            });
          } else {
            return apiResponse.validationErrorWithData(
              res,
              "Email or Password wrong.",
              {}
            );
          }
        });
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.check = [
  auth,
  function (req, res) {
    try {
      if (req.user) {
        let userData = {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        };
        return apiResponse.successResponseWithData(
          res,
          "Operation success",
          userData
        );
      } else {
        return apiResponse.validationErrorWithData(
          res,
          "Operation success",
          {}
        );
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.init = [
  function (req, res) {
    try {
      if (process.env.ADMIN_EMAIL && process.env.ADMIN_PWD) {
        // check if user already exists
        UserModel.findOne({ email: process.env.ADMIN_EMAIL }).then((user) => {
          if (user) {
            return apiResponse.successResponseWithData(
              res,
              "Already Initializated, contact admin for more info.",
              {}
            );
          } else {
            // create admin account
            bcrypt.hash(process.env.ADMIN_PWD, 10, function (err, hash) {
              const user = new UserModel({
                firstName: "Admin",
                lastName: "User",
                email: process.env.ADMIN_EMAIL,
                password: hash,
                role: "admin",
              });

              // Save user.
              user.save(function (err) {
                if (err) {
                  console.log("error", err);
                  return apiResponse.ErrorResponse(res, err);
                }
                return apiResponse.successResponseWithData(
                  res,
                  "Setup complete.",
                  {}
                );
              });
            });
          }
        });
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Missing env, contact admin for more info.",
          {}
        );
      }
    } catch (err) {
      console.log("inti error", err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.generateToken = [
  auth,
  function (req, res) {
    try {
      const tokenObj = new TokenModel({
        token_type: "ws",
        user_id: req.user._id,
      });

      tokenObj.save(function (err) {
        if (err) {
          throw err;
        }
        return apiResponse.successResponseWithData(
          res,
          "Token generated successfully",
          { token: tokenObj._id }
        );
      });
    } catch (err) {
      console.log("error", err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
