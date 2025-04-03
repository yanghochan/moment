// routes/auth/deleteUser.js
const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const USERS_JSON = path.join(__dirname, '..', '..', 'data', 'user.json');
const USERS_DIR = path.join(__dirname, '..', '..', 'users');
const COMMENTS_DIR = path.join(__dirname, '..', '..', 'comments');
const ALL_POSTS_PATH = path.join(__dirname, '..', '..', 'data', 'allPosts.json');

// DELETE /api/auth/deleteUser/:username
router.delete('/:username', async (req, res) => {
  const { username } = req.params;
  const { password } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: "❌ 사용자명이 없습니다." });
  }

  if (!fs.existsSync(USERS_JSON)) {
    return res.status(404).json({ success: false, message: "❌ 회원 데이터 없음" });
  }

  let users = JSON.parse(fs.readFileSync(USERS_JSON, 'utf-8') || '[]');
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ success: false, message: "❌ 유저를 찾을 수 없음" });
  }

  if (user.password && password) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "❌ 비밀번호 불일치" });
    }
  }

  // 1. 사용자 제거
  users = users.filter((u) => u.username !== username);
  fs.writeFileSync(USERS_JSON, JSON.stringify(users, null, 2));

  // 2. 유저 디렉토리 제거
  const userDir = path.join(USERS_DIR, username);
  if (fs.existsSync(userDir)) {
    fs.rmSync(userDir, { recursive: true, force: true });
  }

  // 3. 댓글에서 유저 관련 삭제
  if (fs.existsSync(COMMENTS_DIR)) {
    const files = fs.readdirSync(COMMENTS_DIR);
    files.forEach((file) => {
      const filePath = path.join(COMMENTS_DIR, file);
      const content = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");

      const filterUser = (arr) => arr
        .filter(c => c.user !== username)
        .map(c => ({
          ...c,
          replies: Array.isArray(c.replies) ? filterUser(c.replies) : []
        }));

      const filtered = filterUser(content);
      if (filtered.length === 0) {
        fs.unlinkSync(filePath);
      } else {
        fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
      }
    });
  }

  // 4. 전체 글 목록에서 제거
  if (fs.existsSync(ALL_POSTS_PATH)) {
    const allPosts = JSON.parse(fs.readFileSync(ALL_POSTS_PATH, 'utf-8') || '[]');
    const updatedPosts = allPosts.filter(p => p.username !== username);
    fs.writeFileSync(ALL_POSTS_PATH, JSON.stringify(updatedPosts, null, 2));
  }

  // 완료 응답
  res.json({ success: true, message: "✅ 회원 탈퇴 완료" });
});

module.exports = router;
