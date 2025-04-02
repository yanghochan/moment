// auth.js

function requireLogin(req, res, next) {
    const user = req.body.user || req.query.user;
  
    if (!user) {
      return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
    }
  
    next();
  }
  
  module.exports = { requireLogin };
  