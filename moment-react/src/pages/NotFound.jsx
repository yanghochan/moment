// src/pages/NotFound.jsx
import { useNavigate } from "react-router-dom";
import "../styles/NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <img src="/images/lost-memory.svg" alt="길을 잃은 기억" className="notfound-illustration" />
      <h1>이 순간은 어디에도 없어요.</h1>
      <p className="notfound-message">
        마치 잊혀진 추억처럼,<br />
        찾으시는 페이지가 존재하지 않아요.<br />
        다시 추억의 페이지로 돌아가볼까요?
      </p>
      <button className="btn" onClick={() => navigate("/")}>🏠 메인으로 돌아가기</button>
    </div>
  );
}
