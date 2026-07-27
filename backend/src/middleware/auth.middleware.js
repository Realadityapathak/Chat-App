import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    console.log("========== AUTH DEBUG ==========");
    console.log("URL:", req.originalUrl);
    console.log("Cookies:", req.cookies);
    console.log("Header Cookie:", req.headers.cookie);

    const token = req.cookies.jwt;

    if (!token) {
      console.log("TOKEN NOT FOUND");
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    console.log("JWT:", token.substring(0, 20) + "...");

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    console.log("Decoded:", decoded);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Authenticated:", user.fullName);

    req.user = user;
    next();
  } catch (error) {
    console.log("AUTH ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
