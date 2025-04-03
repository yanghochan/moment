
// server/routes/userPage.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/:username/posts", (req, res) => {
  const { username } = req.params;
  const userDir = path.join(__dirname, "../users", username, "posts");

  if (!fs.existsSync(userDir)) {
    return res.json([]); // 빈 배열로 응답
  }

  const allPosts = [];

  const categories = fs.readdirSync(userDir);
  categories.forEach((category) => {
    const categoryDir = path.join(userDir, category);
    if (!fs.existsSync(categoryDir)) return;

    const files = fs.readdirSync(categoryDir);
    files.forEach((file) => {
      const slug = file.replace(".html", "");
      const filePath = path.join(categoryDir, file);
      const html = fs.readFileSync(filePath, "utf-8");

      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
      const dateMatch = html.match(/<time[^>]*>(.*?)<\/time>/);
      const descMatch = html.match(/<p[^>]*class="desc"[^>]*>(.*?)<\/p>/);

      allPosts.push({
        username,
        category,
        slug,
        url: `/users/${username}/posts/${category}/${file}`,
        title: titleMatch?.[1] || slug,
        date: dateMatch?.[1] || "날짜 없음",
        desc: descMatch?.[1] || "",
      });
    });
  });

  res.json(allPosts);
});

module.exports = router;
