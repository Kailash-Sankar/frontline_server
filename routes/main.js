var express = require("express");
const MainController = require("../controllers/MainController");
const AppealController = require("../controllers/AppealController");
const RequestController = require("../controllers/RequestController");
const NgoController = require("../controllers/NgoController");

var router = express.Router();

// --- volunteer and kind ---
// save
router.post("/volunteer", MainController.VolunteerStore);
// search
router.post("/search", MainController.search);
// export
router.post("/export", MainController.export);
// overall status
router.get("/status", MainController.status);
// Update the status of a appeal
router.put("/update/:id", MainController.updateStatus);

// --- appeals ---
// save
router.post("/appeal", AppealController.AppealStore);
// search
router.post("/appeal/search", AppealController.search);
// fetch for home
router.get("/appeal/recent", AppealController.fetchAppeals);
// export
router.post("/appeal/export", AppealController.export);
// overall status
router.get("/appeal/status", AppealController.status);
// Update the status of a appeal
router.put("/appeal/update/:id", AppealController.updateStatus);

// --- Request for Help ---
// save
router.post("/request", RequestController.RequestStore);
// search
router.post("/request/search", RequestController.search);
// export
router.post("/request/export", RequestController.export);
// overall status
router.get("/request/status", RequestController.status);
// Update the status of the request
router.put("/request/update/:id", RequestController.updateStatus);
// Get the request for given id
router.get("/request/:id", RequestController.getRequest);

// --- NGO ---
// save
router.post("/ngo", NgoController.NgoStore);
// search
router.post("/ngo/search", NgoController.search);
// export
router.post("/ngo/export", NgoController.export);
// Update the status of the NGO registration
// router.put("/ngo/update/:id", NgoController.updateStatus); # Commenting out as this functionality is put on temporary hold
// Verify NGO's email
// router.put("/ngo/verify/email", NgoController.verifyEmail); # Commenting out as this functionality is put on temporary hold

module.exports = router;
