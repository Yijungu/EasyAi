// backend/routes/qrRoutes.js
const express = require("express");
const {
  generateQRCodes,
  processQRCode,
} = require("../controllers/qrController");
const router = express.Router();

router.post("/generate", generateQRCodes);
router.post("/process", processQRCode);

module.exports = router;
