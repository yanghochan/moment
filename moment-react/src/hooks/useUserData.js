// useUserData.js
import { useEffect, useState } from "react";

export default function useUserData(username) {
  const [nickname, setNickname] = useState(username);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`/users/${username}/profile.json`)
      .then(res => res.json())
      .then(profile => {
        const nick = profile.nickname || username;
        setNickname(nick);
        return nick;
      })
      .then(nick => {
        fetch(`/users/${username}/posts`)
          .then(res => res.json())
          .then(data => {
            const updated = data.map(post => ({
              ...post,
              date: post.date || "날짜 없음",
              nickname: nick
            }));
            setPosts(updated);
          });
      })
      .catch(() => {
        setNickname(username);
        fetch(`/users/${username}/posts`)
          .then(res => res.json())
          .then(data => {
            const updated = data.map(post => ({
              ...post,
              date: post.date || "날짜 없음",
              nickname: username
            }));
            setPosts(updated);
          });
      });
  }, [username]);

  return { nickname, setNickname, posts, setPosts };
}
