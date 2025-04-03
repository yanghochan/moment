// routes/auth/admin-register.js
const express = require("express");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const USERS_JSON = path.join(__dirname, "..", "..", "data", "user.json");
const USERS_DIR = path.join(__dirname, "..", "..", "users");

// ✅ 유틸 함수
const loadUsers = () => {
  if (!fs.existsSync(USERS_JSON)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_JSON, "utf-8") || "[]");
  } catch (err) {
    console.error("❌ 사용자 데이터 파싱 오류:", err);
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(USERS_JSON, JSON.stringify(users, null, 2));
};

const createUserDir = (username, nickname) => {
  const userDir = path.join(USERS_DIR, username);
  fs.mkdirSync(path.join(userDir, "posts"), { recursive: true });
  fs.writeFileSync(
    path.join(userDir, "profile.json"),
    JSON.stringify({ nickname }, null, 2)
  );
};

// ✅ 관리자 인증 미들웨어
function requireAdmin(req, res, next) {
  const { requester } = req.body;
  if (!requester) {
    return res.status(401).json({ success: false, message: "요청자 정보 누락" });
  }

  const users = loadUsers();
  const isAdmin = users.some((u) => u.username === requester && u.role === "admin");

  if (!isAdmin) {
    return res.status(403).json({ success: false, message: "관리자 권한 필요" });
  }

  next();
}

// ✅ 관리자 등록
router.post("/", requireAdmin, async (req, res) => {
  const { username, password, nickname } = req.body;

  if (!username || !password || !nickname) {
    return res.json({ success: false, message: "모든 항목을 입력해주세요." });
  }

  try {
    const users = loadUsers();

    if (users.find((u) => u.username === username)) {
      return res.json({ success: false, message: "이미 존재하는 아이디입니다." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashed, nickname, role: "admin" };

    users.push(newUser);
    saveUsers(users);
    createUserDir(username, nickname);

    res.json({ success: true, message: "👑 관리자 등록 완료" });
  } catch (err) {
    console.error("🚨 관리자 등록 실패:", err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

module.exports = router;
