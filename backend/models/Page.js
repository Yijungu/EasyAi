const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
  page_id: { type: Number, required: true, unique: true },
  story_id: { type: Number, required: true, ref: "Story" },
  page_number: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("Page", PageSchema);
