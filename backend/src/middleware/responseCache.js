module.exports = (maxAge = 3600) => {
  return (req, res, next) => {
    // Cache GET requests only
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    } else {
      res.setHeader('Cache-Control', 'no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
    }
    next();
  };
};
