// logger.js
function logger(req, res, next) {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.originalUrl}`);
    next();
  }
  
  module.exports = logger;
  