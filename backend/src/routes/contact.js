const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
} = require("../controllers/contactController");
const verifyCaptcha = require("../middleware/verifyCaptcha");

router.get("/messages", getMessages); // Route pour obtenir les messages

router.post("/send", verifyCaptcha, sendMessage);

module.exports = router;
