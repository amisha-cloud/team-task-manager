const express = require("express");
const router = express.Router();

// ✅ correct names
const { signup, login } = require("../controllers/authController");

router.post("/signup", signup);   // ✅ FIXED
router.post("/login", login);

module.exports = router;