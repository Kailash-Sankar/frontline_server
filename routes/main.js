var express = require("express");
const MainController = require("../controllers/MainController");

var router = express.Router();

// volunteer singup
router.post("/volunteer/", MainController.VolunteerStore);

// search
router.post("/search", MainController.search);

// status
router.get("/status", MainController.status);

module.exports = router;
