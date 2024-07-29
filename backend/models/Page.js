const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
  story_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Story",
  },
  page_number: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("Page", PageSchema);
