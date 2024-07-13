const mongoose = require("mongoose");

const QrcodeSchema = new mongoose.Schema({
  qr_id: { type: Number, required: true, unique: true },
  qr_code: { type: String, required: true },
  request_qr_code: { type: String, required: true },
  user_id: { type: Number, required: true, ref: "User" },
});

module.exports = mongoose.model("Qrcode", QrcodeSchema);
