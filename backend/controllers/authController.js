// backend/controllers/authController.js
const User = require("../models/User");
const memory = require("../utils/memory");

exports.teacherLogin = async (req, res) => {
  const { email } = req.body;
  console.log(1);
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const affiliation = user.affiliation;
    if (!memory[affiliation]) {
      memory[affiliation] = {
        users: [],
        currentMode: null,
        teams: null,
      };
    }

    res.status(200).json({
      message: "Login successful",
      affiliation,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
