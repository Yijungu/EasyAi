const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors"); // CORS 패키지 추가

const app = express();

// 미들웨어 설정
app.use(bodyParser.json());
app.use(cors()); // CORS 설정 추가

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, "public")));

// 라우트 파일을 가져옵니다
const authRoutes = require("./routes/authRoutes");
const storyRoutes = require("./routes/storyRoutes");
const qrRoutes = require("./routes/qrRoutes");

// 라우트 설정
app.use("/api/auth", authRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/qr", qrRoutes);

module.exports = app;
