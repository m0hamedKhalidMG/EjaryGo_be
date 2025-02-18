const express = require("express");
const { addEmployee, getEmployees, getEmployee, modifyEmployee, removeEmployee,registerEmployee, loginEmployee,uploadProfileImage  } = require("../controllers/employeeController");
const upload = require("../middleware/uploadimage");



const router = express.Router();

router.post("/", addEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployee);
router.put("/:id", modifyEmployee);
router.delete("/:id", removeEmployee);
router.put("/upload-profile/:id", upload.single("profile_img"), uploadProfileImage);

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);

module.exports = router;
