// allPosts.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");
const router = express.Router();

const USERS_DIR = path.join(__dirname, "../users");

// ✅ 전체 사용자 글을 최신순으로 반환
router.get("/", (req, res) => {
  const results = [];

  if (!fs.existsSync(USERS_DIR)) {
    return res.json(results);
  }

  const users = fs.readdirSync(USERS_DIR).filter((name) => {
    const fullPath = path.join(USERS_DIR, name);
    return fs.statSync(fullPath).isDirectory();
  });

  users.forEach((username) => {
    const postsPath = path.join(USERS_DIR, username, "posts");
    if (!fs.existsSync(postsPath)) return;

    const categories = fs.readdirSync(postsPath).filter((name) => {
      const fullPath = path.join(postsPath, name);
      return fs.statSync(fullPath).isDirectory();
    });

    categories.forEach((category) => {
      const categoryPath = path.join(postsPath, category);
      const files = fs.readdirSync(categoryPath).filter((file) => file.endsWith(".html"));

      files.forEach((file) => {
        const filePath = path.join(categoryPath, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const $ = cheerio.load(content);
        const title = $("h1").first().text();
        const date = $(".date").first().text();
        const desc = $("p").first().text();

        results.push({
          title: title || file.replace(".html", ""),
          date,
          desc,
          url: `/users/${username}/posts/${category}/${file}`,
          username,
          category,
          slug: file.replace(".html", ""),
        });
      });
    });
  });

  // 최신순 정렬
  results.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(results);
});

module.exports = router;