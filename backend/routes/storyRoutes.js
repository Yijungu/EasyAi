const express = require("express");
const router = express.Router();
const {
  getStories,
  createStory,
  updateStory,
  deleteStory,
} = require("../controllers/storyController");

// GET /api/story - 모든 스토리 가져오기
router.get("/", getStories);

// POST /api/story - 새로운 스토리 생성
router.post("/", createStory);

// PUT /api/story/:id - 기존 스토리 업데이트
router.put("/:id", updateStory);

// DELETE /api/story/:id - 기존 스토리 삭제
router.delete("/:id", deleteStory);

module.exports = router;
