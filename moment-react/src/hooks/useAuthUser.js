import { useEffect, useState } from "react";

export default function useAuthUser() {
  const [username, setUsername] = useState(null);
  const [nickname, setNickname] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("moment_user");
    if (saved) {
      setUsername(saved);
      fetch(`/users/${saved}/profile.json`)
        .then(res => res.json())
        .then(data => setNickname(data.nickname || saved))
        .catch(() => setNickname(saved));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("moment_user");
    setUsername(null);
    setNickname(null);
  };

  return { username, nickname, logout };
}
