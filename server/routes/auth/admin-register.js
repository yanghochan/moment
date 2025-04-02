// routes/auth/admin-register.js
// routes/auth/admin-register.js
const express = require("express");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const USERS_JSON = path.join(__dirname, "..", "..", "data", "user.json");
const USERS_DIR = path.join(__dirname, "..", "..", "users");

// ✅ 관리자 인증 미들웨어
function requireAdmin(req, res, next) {
  const { requester } = req.body;
  if (!requester) {
    return res.status(401).json({ success: false, message: "요청자 정보 누락" });
  }

  let users = fs.existsSync(USERS_JSON)
    ? JSON.parse(fs.readFileSync(USERS_JSON, "utf-8") || "[]")
    : [];

  const adminUser = users.find((u) => u.username === requester && u.role === "admin");
  if (!adminUser) {
    return res.status(403).json({ success: false, message: "관리자 권한 필요" });
  }

  next();
}

router.post("/", requireAdmin, async (req, res) => {
  const { username, password, nickname } = req.body;

  if (!username || !password || !nickname) {
    return res.json({ success: false, message: "모든 항목을 입력해주세요." });
  }

  let users = fs.existsSync(USERS_JSON)
    ? JSON.parse(fs.readFileSync(USERS_JSON, "utf-8") || "[]")
    : [];

  if (users.find((u) => u.username === username)) {
    return res.json({ success: false, message: "이미 존재하는 아이디입니다." });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashed, nickname, role: "admin" }; // ✅ 관리자
  users.push(newUser);
  fs.writeFileSync(USERS_JSON, JSON.stringify(users, null, 2));

  const userDir = path.join(USERS_DIR, username);
  fs.mkdirSync(path.join(userDir, "posts"), { recursive: true });
  fs.writeFileSync(
    path.join(userDir, "profile.json"),
    JSON.stringify({ nickname }, null, 2)
  );

  res.json({ success: true, message: "👑 관리자 등록 완료" });
});

module.exports = router;
