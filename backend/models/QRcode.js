const mongoose = require("mongoose");

const QrcodeSchema = new mongoose.Schema({
  qr_code: { type: String, required: true },
  request_qr_code: { type: String, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Qrcode", QrcodeSchema);
