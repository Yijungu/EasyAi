const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: { type: String },
  author: { type: String, required: true },
  publication_status: { type: String, required: true },
  question_depth: { type: String, required: true },
  question_count: { type: Number, required: true },
  question_extension_enabled: { type: Boolean, default: false },
});

module.exports = mongoose.model("Story", StorySchema);
