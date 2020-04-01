var express = require("express");
const MainController = require("../controllers/MainController");

var router = express.Router();

// volunteer singup
router.post("/volunteer/", MainController.VolunteerStore);

// search
router.post("/search", MainController.search);

module.exports = router;
