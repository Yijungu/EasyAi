// backend/routes/authRoutes.js
const express = require("express");
const { teacherLogin } = require("../controllers/authController");
const router = express.Router();

router.post("/login", teacherLogin);

module.exports = router;
