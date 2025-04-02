// src/pages/PostEditor.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/PostEditor.css";

export default function PostEditor() {
  const navigate = useNavigate();
  const { username, category, slug } = useParams();
  const location = useLocation();

  const isEditMode = !!(username && category && slug); // 경로 기반으로 edit 감지
  const currentUsername = localStorage.getItem("moment_user");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [cat, setCat] = useState(category || "default");

  // ✅ 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEditMode) {
      fetch(`/users/${username}/posts/${category}/${slug}.html`)
        .then((res) => res.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, "text/html");
          setTitle(doc.querySelector("h1")?.textContent || "");
          setDesc(doc.querySelector("meta[name='description']")?.getAttribute("content") || "");
          setContent(doc.querySelector("main")?.innerHTML || "");
        });
    }
  }, [isEditMode, username, category, slug]);

  // ✅ 저장 핸들러
  const handleSubmit = async () => {
    const payload = {
      username: currentUsername,
      title,
      desc,
      content,
      category: cat,
      tags: [],
    };

    let url = "/api/post/write";
    let method = "POST";

    if (isEditMode) {
      payload.oldSlug = slug;
      payload.oldCategory = category;
      url = "/api/post/edit";
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result.success) {
      alert(isEditMode ? "✅ 수정 완료" : "✅ 작성 완료");
      navigate(`/user/${currentUsername}`);
    } else {
      alert("❌ 실패: " + result.message);
    }
  };

  return (
    <div className="editor-container">
      <h2 className="editor-title">
        {isEditMode ? "✏️ 글 수정" : "📝 새 글 작성"}
      </h2>

      <form className="editor-form" onSubmit={(e) => e.preventDefault()}>
        <label>제목</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>설명 (미리보기)</label>
        <input value={desc} onChange={(e) => setDesc(e.target.value)} required />

        <label>카테고리</label>
        {isEditMode ? (
          <input value={cat} disabled />
        ) : (
          <input value={cat} onChange={(e) => setCat(e.target.value)} required />
        )}

        <label>본문 내용 (HTML 가능)</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />

        <div className="editor-buttons">
          <button className="btn cancel" onClick={() => navigate(-1)}>취소</button>
          <button className="btn save" onClick={handleSubmit}>
            {isEditMode ? "수정 완료" : "작성 완료"}
          </button>
        </div>
      </form>

      <div className="post-editor-preview mt-8">
        <h3 className="text-gray">미리보기</h3>
        <h4>{title}</h4>
        <p className="text-gray">{desc}</p>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  );
}
