// src/logic/postUtils.js
export const isValidPost = ({ title, content }) => {
    return title?.trim() && content?.trim();
  };
  