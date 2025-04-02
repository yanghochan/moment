// useUserPostEditor.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function usePostEditor({ mode, username, category, slug }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [postCategory, setPostCategory] = useState(category || "default");

  // 원본 값을 별도로 저장
  const [oldSlug] = useState(slug);
  const [oldCategory] = useState(category);

  useEffect(() => {
    if (mode === "edit" && username && category && slug) {
      const url = `/users/${username}/posts/${category}/${slug}.html`;
      fetch(url)
        .then((res) => res.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          setTitle(doc.querySelector("h1")?.textContent || "");
          setContent(doc.querySelector(".post-content")?.innerHTML || "");
          setTags(Array.from(doc.querySelectorAll(".tag")).map((el) => el.textContent).join(", "));
        })
        .catch((err) => console.error("❌ 수정 모드 로딩 실패:", err));
    }
  }, [mode, username, category, slug]);

  const handleSubmit = async () => {
    const currentUser = localStorage.getItem("moment_user");
    if (!currentUser) return alert("로그인이 필요합니다.");

    const data = {
      username: currentUser,
      category: postCategory,
      title,
      content,
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    const endpoint = mode === "edit" ? "/api/post/edit" : "/api/post/write";
    if (mode === "edit") {
      data.oldCategory = oldCategory; // 🔥 기존값 유지
      data.oldSlug = oldSlug;
    }

    const res = await fetch(endpoint, {
      method: mode === "edit" ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      alert(mode === "edit" ? "✏️ 수정 완료!" : "✅ 글 작성 완료!");
      navigate(`/user/${currentUser}`);
    } else {
      alert("❌ 실패: " + result.message);
    }
  };

  return {
    title, setTitle,
    content, setContent,
    tags, setTags,
    postCategory, setPostCategory,
    handleSubmit
  };
}
