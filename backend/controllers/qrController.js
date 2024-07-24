// backend/controllers/qrController.js
const User = require("../models/User");
const QRCode = require("qrcode");
const memory = require("../utils/memory");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

exports.generateQRCodes = async (req, res) => {
  try {
    const { schoolId, userId } = req.body;
    const school = memory[schoolId];

    if (!school) {
      console.error(`School with ID ${schoolId} not found in memory.`);
      return res
        .status(404)
        .send(`School with ID ${schoolId} not found in memory.`);
    }

    const qrCodeData1 = `https://example.com/user/${schoolId}/qr1`;
    const qrCodeData2 = `https://example.com/user/${schoolId}/qr2`;

    const qrCode1 = await QRCode.toDataURL(qrCodeData1);
    const qrCode2 = await QRCode.toDataURL(qrCodeData2);
    const tempQr = "1";

    school.qrcodes = [];

    school.qrcodes.push({ tempQr, qrCode2 });

    res.json({
      qrCode1,
      qrCode2,
    });

    console.log(`QR codes generated for user in school ${schoolId}.`);
  } catch (error) {
    console.error("Error generating QR codes:", error);
    res.status(500).send("Error generating QR codes");
  }
};

exports.processQRCode = async (req, res) => {
  try {
    const { qrCode, nickname } = req.body;

    let schoolId;
    let isFirstQRCode = false;

    for (const [key, value] of Object.entries(memory)) {
      const foundQR = value.qrcodes.find(
        (qr) => qr.tempQr === qrCode || qr.qrCode2 === qrCode
      );
      if (foundQR) {
        schoolId = key;
        if (foundQR.tempQr === qrCode) {
          isFirstQRCode = true;
        }
        break;
      }
    }

    if (!schoolId) {
      return res.status(404).send("QR Code not found.");
    }

    const school = memory[schoolId];

    const existingUser = school.users.find((u) => u.nickname === nickname);
    let newUser = {};
    if (!existingUser) {
      newUser = {
        id: uuidv4(),
        nickname,
        websocket: null,
        isPaused: false,
        screenOwner: "selfScreen",
        start: false,
        state: null,
      };
      school.users.push(newUser);
    } else {
      newUser = existingUser;
    }

    if (isFirstQRCode) {
      const teacher = school.users.find((user) => user.nickname === "teacher");
      if (
        teacher &&
        teacher.websocket &&
        teacher.websocket.readyState === WebSocket.OPEN
      ) {
        teacher.websocket.send(JSON.stringify({ type: "newUser", newUser }));
      } else {
        console.error("Teacher websocket is not open or not available.");
      }
    }

    res.json({ message: "User added to school.", schoolId, isFirstQRCode });
  } catch (error) {
    console.error("Error processing QR Code:", error);
    res.status(500).send("Error processing QR Code");
  }
};
