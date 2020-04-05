var express = require("express");
const MainController = require("../controllers/MainController");
const AppealController = require("../controllers/AppealController");

var router = express.Router();

// --- volunteer and kind ---
// save
router.post("/volunteer", MainController.VolunteerStore);
// search
router.post("/search", MainController.search);
// status
router.get("/status", MainController.status);

// --- appeals ---
// save
router.post("/appeal", AppealController.AppealStore);
// search
router.post("/appeal/search", AppealController.search);
// status
router.get("/appeal/status", AppealController.status);

module.exports = router;
