// routes/auth/register.js
const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const USERS_JSON = path.join(__dirname, '..', '..', 'data', 'user.json');
const USERS_DIR = path.join(__dirname, '..', '..', 'users');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password, nickname, adminCode } = req.body;

  if (!username || !password || !nickname) {
    return res.json({ success: false, message: '모든 항목을 입력해주세요.' });
  }

  let users = [];
  if (fs.existsSync(USERS_JSON)) {
    try {
      users = JSON.parse(fs.readFileSync(USERS_JSON, 'utf-8') || '[]');
    } catch (e) {
      return res.json({ success: false, message: '회원 데이터 파싱 오류' });
    }
  }

  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: '이미 존재하는 아이디입니다.' });
  }

  // 기본 role은 user
  let role = "user";

  // adminCode가 전달된 경우 → 관리자 계정 요청
  if (adminCode !== undefined) {
    if (adminCode !== "moment2025") {
      return res.status(403).json({ success: false, message: "🚫 유효하지 않은 관리자 코드" });
    }
    role = "admin";
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashed, nickname, role };
  users.push(newUser);

  fs.writeFileSync(USERS_JSON, JSON.stringify(users, null, 2));

  const userDir = path.join(USERS_DIR, username);
  fs.mkdirSync(path.join(userDir, 'posts'), { recursive: true });
  fs.writeFileSync(
    path.join(userDir, 'profile.json'),
    JSON.stringify({ nickname }, null, 2)
  );

  res.json({ success: true, message: `${role === "admin" ? "👑 관리자" : "✅ 회원"} 가입 성공!` });
});

module.exports = router;
