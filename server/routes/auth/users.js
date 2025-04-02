// server/routes/auth/users.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const USERS_JSON = path.join(__dirname, "..", "..", "data", "user.json");

router.get("/", (req, res) => {
  if (!fs.existsSync(USERS_JSON)) {
    return res.json([]);
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_JSON, "utf-8") || "[]");
    res.json(users);
  } catch (err) {
    console.error("❌ 유저 리스트 파싱 실패", err);
    res.status(500).json({ success: false, message: "유저 데이터 파싱 오류" });
  }
});

module.exports = router;
