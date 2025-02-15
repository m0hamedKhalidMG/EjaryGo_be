const express = require("express");
const { registerEmployee, loginEmployee } = require("../controllers/employeeController");

const router = express.Router();
router.post("/register", registerEmployee);
router.post("/login", loginEmployee);

module.exports = router;
