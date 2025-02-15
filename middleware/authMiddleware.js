const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next(); // Google session-based authentication
  return res.status(401).json({ error: "Unauthorized" });
};

const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Token required!" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token!" });
    req.user = decoded;
    next();
  });
};

module.exports = { isAuthenticated, verifyJWT };
