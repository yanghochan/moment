// login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const USERS_JSON = path.join(__dirname, '..', '..', 'data', 'user.json');
const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ success: false, message: '아이디와 비밀번호를 입력해주세요.' });
  }

  if (!fs.existsSync(USERS_JSON)) {
    return res.json({ success: false, message: '회원정보가 없습니다.' });
  }

  let users;
  try {
    users = JSON.parse(fs.readFileSync(USERS_JSON, 'utf-8') || '[]');
  } catch (e) {
    return res.json({ success: false, message: '회원 데이터 파싱 오류' });
  }

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.json({ success: false, message: '존재하지 않는 아이디입니다.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.json({ success: false, message: '비밀번호가 틀렸습니다.' });
  }

  // ✅ 관리자 여부를 함께 응답
  const role = user.role === "admin" ? "admin" : "user";

  res.json({
    success: true,
    message: '로그인 성공!',
    username: user.username,
    role, // ✅ 추가
  });
});

module.exports = router;
