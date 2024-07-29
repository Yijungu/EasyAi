const mongoose = require("mongoose");

const ProtagonistSchema = new mongoose.Schema({
  protagonist_id: { type: Number, required: true, unique: true },
  story_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Story",
  },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("Protagonist", ProtagonistSchema);
