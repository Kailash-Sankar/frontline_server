const Ngo = require("../models/NgoModel");

const { body } = require("express-validator");
const auth = require("../middlewares/jwt");
const { generateId } = require("uq-id");
const params = require('params');

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// helpers
const {
  successResponseWithData,
  validationErrorWithData,
  asyncH
} = require("../helpers/apiResponse");
const { sendVerMail, createNgoUser } = require("../services")

const {
  handleSearch,
  handleExport,
  handleSaveAsync,
  handleStatusUpdate,
} = require("../utils");

// create a new ngo record
exports.NgoStore = [
  body("mobile", "Mobile must not be empty.").isLength({ min: 1 }).trim(),
  body("name", "Name must not be empty.").isLength({ min: 1 }).trim(),
  body("email", "Email must not be empty.").isLength({ min: 1 }).trim(),
  asyncH(async (req, res) => {
    req.body.vcode = generateId();
    await handleSaveAsync(req, Ngo);

    // Send verification email to the NGO
    let options = {
      toList: [req.body.email],
      name: req.body.name,
      token: req.body.vcode
    }
    await sendVerMail(options)

    return successResponseWithData(
      res,
      "Record added successfully.",
      {}
    );
  }),
];

exports.search = [
  auth,
  function (req, res) {
    handleSearch(req, res, Ngo);
  },
];

// export data
exports.export = [
  auth,
  function (req, res) {
    handleExport(req, res, Ngo);
  },
];

// Verify the NGO Registration details
exports.updateStatus = [
  auth,
  function (req, res) {
    // Todo: check email verification and create user
    handleStatusUpdate(req, res, Ngo);
  },
];

exports.verifyEmail = [
  asyncH(async (req, res) => {
    let query = params(req.body).only(['email', 'vcode'])
    query.email_verified = false
    query.email = Buffer.from(query.email, 'base64').toString('ascii');

    const ngo = await Ngo.findOneAndUpdate(
      query,
      { email_verified: true, vcode: null },
      { new: true },
    );

    if(!ngo) {
      return validationErrorWithData(
        res,
        "Email and token are not matching or email is already verified"
      )
    }

    await createNgoUser(ngo)
    return successResponseWithData(
      res,
      "Record added successfully.",
      ngo || {}
    );
  })
];
