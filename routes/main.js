var express = require("express");
const MainController = require("../controllers/MainController");
const AppealController = require("../controllers/AppealController");
const RequestController = require("../controllers/RequestController");

var router = express.Router();

// --- volunteer and kind ---
// save
router.post("/volunteer", MainController.VolunteerStore);
// search
router.post("/search", MainController.search);
// overall status
router.get("/status", MainController.status);
// Update the status of a appeal
router.put("/update/:id", MainController.updateStatus);

// --- appeals ---
// save
router.post("/appeal", AppealController.AppealStore);
// search
router.post("/appeal/search", AppealController.search);
// overall status
router.get("/appeal/status", AppealController.status);
// Update the status of a appeal
router.put("/appeal/update/:id", AppealController.updateStatus);

// --- Request for Help ---
// save
router.post("/request", RequestController.RequestStore);
// search
router.post("/request/search", RequestController.search);
// overall status
router.get("/request/status", RequestController.status);
// Update the status of the request
router.put("/request/update/:id", RequestController.updateStatus);

module.exports = router;
