const UserModel = require("../models/UserModel");
const { body, validationResult } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/jwt");

exports.register = [
  // Validate fields.
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
        bcrypt.hash(req.body.password, 10, function(err, hash) {
          // Create User object with escaped and trimmed data
          var user = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash
          });

          console.log("user", user);

          // Save user.
          user.save(function(err) {
            console.log("saved", err);
            if (err) {
              return apiResponse.ErrorResponse(res, err);
            }
            let userData = {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            };
            console.log("out", userData);
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
  }
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
            bcrypt.compare(req.body.password, user.password, function(
              err,
              same
            ) {
              if (same) {
                // Check User's account active or not.
                if (user.status) {
                  let userData = {
                    _id: user._id,
                    name: user.fullName,
                    email: user.email
                  };
                  //Prepare JWT token for authentication
                  const jwtPayload = userData;
                  const jwtData = {
                    expiresIn: process.env.JWT_TIMEOUT_DURATION
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
  }
];

exports.check = [
  auth,
  function(req, res) {
    try {
      if (req.user) {
        let userData = {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email
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
  }
];
