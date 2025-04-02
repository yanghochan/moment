// comments.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const COMMENTS_DIR = path.join(__dirname, "..", "comments");
if (!fs.existsSync(COMMENTS_DIR)) fs.mkdirSync(COMMENTS_DIR, { recursive: true });

const getCommentFilePath = (username, category, slug) =>
  path.join(COMMENTS_DIR, `${username}_${category}_${slug}.json`);

const getNested = (list, chain) => {
  let node = list;
  for (let i = 0; i < chain.length - 1; i++) {
    const nextNode = node[chain[i]];
    if (!nextNode) throw new Error("❌ 유효하지 않은 chain 경로: node 없음");
    if (!Array.isArray(nextNode.replies)) {
      nextNode.replies = [];
    }
    node = nextNode.replies;
  }
  return node;
};

router.get("/", (req, res) => {
  const { username, category, slug, sort = "latest" } = req.query;
  const filePath = getCommentFilePath(username, category, slug);
  if (!fs.existsSync(filePath)) return res.json([]);
  let comments = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");

  const sortRecursive = (list) => {
    return list
      .map(comment => ({
        ...comment,
        replies: comment.replies ? sortRecursive(comment.replies) : []
      }))
      .sort((a, b) => {
        if (sort === "likes") return (b.likes || 0) - (a.likes || 0);
        return new Date(b.time) - new Date(a.time);
      });
  };

  comments = sortRecursive(comments);
  res.json(comments);
});

router.post("/", (req, res) => {
  const { username, category, slug, user, text } = req.body;
  const filePath = getCommentFilePath(username, category, slug);
  const comments = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]") : [];
  comments.push({ user, text, time: new Date().toISOString(), likedUsers: [], likes: 0, replies: [] });
  fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));
  res.json({ success: true });
});

router.post("/reply", (req, res) => {
  try {
    const { username, category, slug, user, text, chain } = req.body;
    if (!Array.isArray(chain)) {
      return res.status(400).json({ success: false, message: "❌ chain은 배열이어야 합니다." });
    }
    const filePath = getCommentFilePath(username, category, slug);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false });

    const comments = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (chain.length === 0) return res.status(400).json({ success: false, message: "❌ chain이 비어 있습니다." });

    const target = getNested(comments, chain);
    const parentIndex = chain[chain.length - 1];
    const parent = target[parentIndex];

    if (!parent || typeof parent !== "object") return res.status(404).json({ success: false, message: "❌ 부모 댓글 없음" });

    if (!Array.isArray(parent.replies)) parent.replies = [];

    parent.replies.push({
      user,
      text,
      time: new Date().toISOString(),
      likedUsers: [],
      likes: 0,
      replies: [],
      parentUser: parent.user || null // ✅ 알림용 정보
    });

    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("[reply error]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/edit", (req, res) => {
  const { username, category, slug, user, chain, newText } = req.body;
  try {
    const filePath = getCommentFilePath(username, category, slug);
    const comments = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const target = getNested(comments, chain);
    const comment = target[chain[chain.length - 1]];
    if (!comment || comment.user !== user) return res.status(403).json({ success: false });
    comment.text = newText;
    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("[edit error]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/delete", (req, res) => {
  const { username, category, slug, user, chain } = req.body;
  try {
    const filePath = getCommentFilePath(username, category, slug);
    const comments = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const target = getNested(comments, chain);
    const index = chain[chain.length - 1];
    if (!target[index] || target[index].user !== user) return res.status(403).json({ success: false });
    target.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("[delete error]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/likeToggle", (req, res) => {
  const { username, category, slug, chain, user } = req.body;
  try {
    const filePath = getCommentFilePath(username, category, slug);
    const comments = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const target = getNested(comments, chain);
    const comment = target[chain[chain.length - 1]];
    if (!comment) return res.status(404).json({ success: false });

    comment.likes = comment.likes || 0;
    comment.likedUsers = comment.likedUsers || [];

    const liked = comment.likedUsers.includes(user);
    if (liked) {
      comment.likedUsers = comment.likedUsers.filter((u) => u !== user);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likedUsers.push(user);
      comment.likes++;
    }

    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));
    res.json({ success: true, liked: !liked, likes: comment.likes });
  } catch (err) {
    console.error("[like error]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
