// PostActions.jsx
import { useNavigate } from "react-router-dom";

export default function PostActions({ username, category, slug }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit/${username}/${category}/${slug}?mode=edit`);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const res = await fetch("/api/post/delete", {  // ✅ 수정된 경로
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, category, slug }),
    });

    const result = await res.json();
    if (result.success) {
      alert("✅ 글이 삭제되었습니다.");
      navigate(`/user/${username}`);
    } else {
      alert("❌ 실패: " + result.message);
    }
  };

  return (
    <div className="post-actions">
      <button className="btn" onClick={handleEdit}>✏️ 수정</button>
      <button className="btn delete" onClick={handleDelete}>🗑 삭제</button>
    </div>
  );
}
