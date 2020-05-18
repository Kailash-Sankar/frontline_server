const Ngo = require("../models/NgoModel");
const Request = require("../models/RequestModel");

const { body } = require("express-validator");
const auth = require("../middlewares/jwt");
const { generateId } = require("uq-id");
const params = require('params');

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// helpers
const {
  successResponseWithData,
  asyncH
} = require("../helpers/apiResponse");
const { sendVerMail, createNgoUser } = require("../services")

const {
  handleSearch,
  handleExport,
  handleSaveAsync,
  updateOne,
  handleFindReturn
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

// Verify the NGO Registration details (Update Status)
exports.updateStatus = [
  auth,
  asyncH(async (req, res) => {
    const update = { status: req.body.status }
    const query = { _id: req.params.id }

    const ngo = await updateOne(Ngo, query, update)
    await createNgoUser(ngo)

    return successResponseWithData(
      res,
      "Updated the status successfully.",
      ngo || {}
    );
  }),
];

exports.verifyEmail = [
  asyncH(async (req, res) => {
    let query = params(req.body).only(['email', 'vcode'])
    query.email_verified = false
    query.email = Buffer.from(query.email, 'base64').toString('ascii');
    const update = { email_verified: true, vcode: "null" }

    const ngo = await updateOne(Ngo, query, update)
    await createNgoUser(ngo)

    return successResponseWithData(
      res,
      "Verified the email successfully.",
      ngo || {}
    );
  })
];

exports.NgoReq=[
  auth,
  async function(req, res){
    var NgoData = await handleFindReturn(req, res, Ngo);
    req = {};
    req.body = {};
    req.body.query = {};
    req.body.query.region = NgoData[0].region;
    req.body.query.act = 'request';
    handleSearch(req, res,Request);
  }
];