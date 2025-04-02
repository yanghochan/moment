// profile.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const USERS_DIR = path.join(__dirname, "..", "users");

// ✅ 사용자 프로필 반환
router.get("/:username", (req, res) => {
  const { username } = req.params;
  const profilePath = path.join(USERS_DIR, username, "profile.json");

  if (!fs.existsSync(profilePath)) {
    return res.status(404).json({ success: false, message: "프로필 없음" });
  }

  const profile = JSON.parse(fs.readFileSync(profilePath, "utf-8"));
  res.json({ success: true, profile });
});

// ✅ 닉네임 저장
router.post("/nickname", (req, res) => {
  const { username, nickname } = req.body;
  if (!username || !nickname) {
    return res.status(400).json({ success: false, message: "필수 정보 누락" });
  }

  const profilePath = path.join(USERS_DIR, username, "profile.json");
  if (!fs.existsSync(profilePath)) {
    return res.status(404).json({ success: false, message: "유저 없음" });
  }

  const profile = JSON.parse(fs.readFileSync(profilePath, "utf-8"));
  profile.nickname = nickname;
  fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));

  res.json({ success: true, message: "닉네임 저장 완료" });
});

module.exports = router;
