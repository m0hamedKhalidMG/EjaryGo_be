const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { resetPassword } = require("../controllers/authController");

const {isAuthenticated,verifyJWT }= require("../middleware/authMiddleware")
const {completeProfile} =require("../controllers/userController")
const router = express.Router();
require('dotenv').config();


router.patch("/user/complete-profile", verifyJWT, completeProfile);

// 🔹 Google OAuth
router.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google/failure" }),
  (req, res) => {
    res.status(200).json({
      message: "Google login successful",
      token: req.user.token,
      user: req.user.user,
    });
  }
);

router.get("/auth/google/failure", (req, res) => res.status(401).json({ error: "Google Authentication Failed" }));

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.clearCookie("connect.sid"); // Adjust cookie name if needed
        res.json({ message: "Logged out successfully" });
      });
    });
  });
  
router.post("/verify-otp", async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "idToken is required" });
    }
  
    try {
      // Verify Firebase ID Token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      const { uid, phone_number } = decodedToken;
      console.log(decodedToken)
  
      return res.status(200).json({
        message: "Phone number verified successfully",
        user: { uid, phone_number },
      });
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired OTP", details: error.message });
    }
  });
  
  
  router.post("/reset-password", resetPassword);
  
  
module.exports = router;

