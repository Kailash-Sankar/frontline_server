var express = require("express");
const AuthController = require("../controllers/AuthController");

var router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/check", AuthController.check);
router.get("/init", AuthController.init);

router.get("/token/ws", AuthController.generateToken);

module.exports = router;
