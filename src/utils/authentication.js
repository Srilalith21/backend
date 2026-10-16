// JWT
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export default function generateJWTToken(current_user_id) {
  const token = jwt.sign({ id: current_user_id }, config.SECRET_KEY, {
    expiresIn: "1h",
  });
  if (!token) {
    throw new Error("Error generating JWT token");
  }
  return token;
}
