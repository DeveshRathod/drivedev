import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const middleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userid = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid token",
    });
  }
};
