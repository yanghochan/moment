import { useEffect, useState } from "react";

export default function useAllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/allPosts")
      .then(res => res.json())
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  return posts;
}
