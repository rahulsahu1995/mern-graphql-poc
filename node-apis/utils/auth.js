const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Extract user info from token in request headers
const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // { id, username, role }
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return null;
  }
};

// Role check helper
const requireRole = (user, roles) => {
  if (!user) throw new Error("Unauthorized: No user logged in");
  if (!roles.includes(user.role))
    throw new Error("Forbidden: Insufficient permissions");
};

module.exports = { getUserFromToken, requireRole };
