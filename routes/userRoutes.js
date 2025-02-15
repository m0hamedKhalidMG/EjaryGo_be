const express = require("express");
const { addUser,loginUser } = require("../controllers/userController");
const {isAuthenticated }= require("../middleware/authMiddleware")
const router = express.Router();
router.post("/login", loginUser);
router.post("/", addUser);
module.exports = router;
