export default function PostDetail({ post }) {
  return (
    <>
      <h1>{post.title}</h1>
      <p className="date">📅 {post.date}</p>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      <div className="tags">
        {post.tags.map((tag, idx) => (
          <span key={idx} className="tag">#{tag}</span>
        ))}
      </div>
    </>
  );
}
