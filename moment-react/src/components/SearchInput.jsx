// SearchInput.jsx
export default function SearchInput({ value, onChange }) {
    return (
      <div className="search-box">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 제목, 내용, 작성자 검색"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
  