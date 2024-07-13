const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  affiliation: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
