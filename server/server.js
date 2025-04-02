// server.js

require("dotenv").config(); // ✅ .env 로드
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

function createInitialAdmin() {
  if (process.env.INIT_ADMIN !== "true") return;

  const USERS_JSON = path.join(__dirname, "data", "user.json");
  const USERS_DIR = path.join(__dirname, "users");
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin1234";
  const nickname = "관리자계정";

  let users = [];
  if (fs.existsSync(USERS_JSON)) {
    users = JSON.parse(fs.readFileSync(USERS_JSON, "utf-8") || "[]");
  }

  if (users.some((u) => u.username === username)) {
    console.log("✅ 초기 관리자 계정 이미 존재");
    return;
  }

  const hashed = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashed, nickname, role: "admin" });
  fs.writeFileSync(USERS_JSON, JSON.stringify(users, null, 2));

  const userDir = path.join(USERS_DIR, username);
  fs.mkdirSync(path.join(userDir, "posts"), { recursive: true });
  fs.writeFileSync(
    path.join(userDir, "profile.json"),
    JSON.stringify({ nickname }, null, 2)
  );

  console.log(`🎉 관리자 계정 생성 완료! ID: ${username}`);
}

// ✅ 실행 전에 관리자 계정 생성
createInitialAdmin();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const history = require("connect-history-api-fallback");
const logger = require("./middleware/logger");

const app = express();
const PORT = 3000;

const { escapeHtml } = require("./utils/html");

app.use(logger);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());

// ✅ API 등록
app.use("/api/auth/register", require("./routes/auth/register"));
app.use("/api/auth/login", require("./routes/auth/login"));
app.use("/api/auth/deleteUser", require("./routes/auth/deleteUser"));
app.use("/api/auth/admin-register", require("./routes/auth/admin-register"));
app.use("/api/post", require("./routes/post"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/allPosts", require("./data/allPosts"));
app.use("/api/auth/users", require("./routes/auth/users"));

// ✅ 동적 유저 API 처리
app.use("/users", require("./routes/userPage"));

// ✅ HTML 파일은 static-users 경로로 분리 서빙
app.use("/static-users", express.static(path.join(__dirname, "users")));

// ✅ SPA 히스토리 fallback
app.use(history());
app.use(express.static(path.join(__dirname, "../client")));

// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});