// post.js
const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cheerio = require("cheerio");
const router = express.Router();
const { escapeHtml } = require("../utils/html");

const USERS_DIR = path.join(__dirname, "../users");
const COMMENTS_DIR = path.join(__dirname, "../comments");
const ALL_POSTS_JSON = path.join(__dirname, "../data/user.json");
const TEMPLATE_PATH = path.join(__dirname, "../templates", "post-template.html");

// ✅ 글 가져오기
router.get("/:username/:category/:slug", async (req, res) => {
  const { username, category, slug } = req.params;
  const filePath = path.join(USERS_DIR, username, "posts", category, `${slug}.html`);

  try {
    await fs.access(filePath);
    const html = await fs.readFile(filePath, "utf-8");
    const $ = cheerio.load(html);

    const title = $("h1").first().text();
    const date = $(".date").first().text();
    const content = $(".post-content").html();
    const tags = $(".tag").map((i, el) => $(el).text().replace("#", "")).get();

    res.json({ success: true, post: { title, date, content, tags } });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ success: false, message: "파일이 존재하지 않습니다." });
  }
});

// ✅ 글 작성
router.post("/write", async (req, res) => {
  const { username, category, title, content, tags } = req.body;
  if (!username || !title || !content) {
    return res.status(400).json({ success: false, message: "필수 항목이 누락되었습니다." });
  }

  const slug = title.replace(/\s+/g, "-").toLowerCase();
  const date = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, "-").replace(".", "");

  const userPostsDir = path.join(USERS_DIR, username, "posts", category || "default");
  try {
    await fs.mkdir(userPostsDir, { recursive: true });

    const template = await fs.readFile(TEMPLATE_PATH, "utf-8");
    const safeTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim())
      : [];

    const html = template
      .replace(/{{escapedTitle}}/g, escapeHtml(title))
      .replace(/{{title}}/g, title)
      .replace(/{{date}}/g, date)
      .replace(/{{content}}/g, escapeHtml(content))
      .replace(/{{tags}}/g, safeTags.map((tag) => `<span class="tag">${tag}</span>`).join(" "))
      .replace(/{{username}}/g, username)
      .replace(/{{category}}/g, category)
      .replace(/{{slug}}/g, slug)
      .replace(/{{path}}/g, `/users/${username}/posts/${category}/${slug}.html`);

    await fs.writeFile(path.join(userPostsDir, `${slug}.html`), html, "utf-8");
    res.json({ success: true, message: "글 작성 완료!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// ✅ 글 수정
router.put("/edit", async (req, res) => {
  const { username, oldCategory, oldSlug, title, category, content, tags } = req.body;
  if (!username || !title || !content) {
    return res.json({ success: false, message: "필수 항목이 누락되었습니다." });
  }

  const oldPath = path.join(USERS_DIR, username, "posts", oldCategory || "default", `${oldSlug}.html`);
  try {
    await fs.access(oldPath);

    const newSlug = title.replace(/\s+/g, "-").toLowerCase();
    const newDir = path.join(USERS_DIR, username, "posts", category || "default");
    await fs.mkdir(newDir, { recursive: true });

    const date = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, "-").replace(".", "");

    const template = await fs.readFile(TEMPLATE_PATH, "utf-8");
    const escapedTitle = escapeHtml(title);
    const safeTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim())
      : [];

    const html = template
      .replace(/{{escapedTitle}}/g, escapedTitle)
      .replace(/{{title}}/g, title)
      .replace(/{{date}}/g, date)
      .replace(/{{content}}/g, escapeHtml(content))
      .replace(/{{tags}}/g, safeTags.map((tag) => `<span class="tag">${tag}</span>`).join(" "))
      .replace(/{{username}}/g, username)
      .replace(/{{category}}/g, category)
      .replace(/{{slug}}/g, newSlug)
      .replace(/{{path}}/g, `/users/${username}/posts/${category}/${newSlug}.html`);

    const newPath = path.join(newDir, `${newSlug}.html`);
    await fs.writeFile(newPath, html, "utf-8");

    if (oldPath !== newPath) await fs.unlink(oldPath);

    res.json({ success: true, message: "글이 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("[글 수정 오류]", error);
    res.status(500).json({ success: false, message: "서버 오류", error: error.message });
  }
});

// ✅ 글 삭제 (댓글 및 post 목록 정리 포함)
router.delete("/delete", async (req, res) => {
  const { username, category, slug } = req.body;
  if (!username || !category || !slug) {
    return res.status(400).json({ success: false, message: "필수 정보 누락" });
  }

  const filepath = path.join(USERS_DIR, username, "posts", category, `${slug}.html`);
  const commentFile = path.join(COMMENTS_DIR, `${username}_${category}_${slug}.json`);

  try {
    await fs.access(filepath);
    await fs.unlink(filepath);

    if (await fs.access(commentFile).then(() => true).catch(() => false)) {
      await fs.unlink(commentFile);
    }

    if (await fs.access(ALL_POSTS_JSON).then(() => true).catch(() => false)) {
      const data = JSON.parse(await fs.readFile(ALL_POSTS_JSON, "utf-8"));
      const filtered = data.filter(p => !(p.username === username && p.category === category && p.slug === slug));
      await fs.writeFile(ALL_POSTS_JSON, JSON.stringify(filtered, null, 2));
    }

    res.json({ success: true, message: "글이 완전히 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

module.exports = router;
