const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  story_id: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true, ref: "User" },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publication_status: { type: String, required: true },
  question_depth: { type: String, required: true },
  question_count: { type: Number, required: true },
  question_extension_enabled: { type: Boolean, default: false },
});

module.exports = mongoose.model("Story", StorySchema);
