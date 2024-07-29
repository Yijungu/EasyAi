// backend/controllers/authController.js
const User = require("../models/User");
const memory = require("../utils/memory");
const { v4: uuidv4 } = require("uuid");

exports.teacherLogin = async (req, res) => {
  const { email } = req.body;
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

    const existingTeacher = memory[affiliation].users.find(
      (u) => u.nickname === "teacher"
    );

    if (!existingTeacher) {
      const teacher = {
        id: uuidv4(),
        nickname: "teacher",
        websocket: null,
        isPaused: false,
        screenOwner: "selfScreen",
        start: false,
        state: null,
      };
      memory[affiliation].users.push(teacher);
    }

    // 웹소켓이 비어 있지 않은 사용자들을 필터링하여 newUsers 배열에 저장
    const newUsers = memory[affiliation].users.filter(
      (user) => user.websocket !== null
    );

    res.status(200).json({
      message: "Login successful",
      affiliationId: user._id,
      affiliation,
      newUsers, // newUsers 배열을 응답에 포함
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
