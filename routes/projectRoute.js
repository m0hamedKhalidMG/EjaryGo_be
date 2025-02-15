const multer = require('multer');
const express = require('express');
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { addProject,getProjects } = require("../controllers/projectController");
// router.put('/update-profile-image/:userId',upload.single('image'),updateimage);

router.post(
  "/add",
  upload.fields([{ name: "images", maxCount: 20 }, { name: "video", maxCount: 1 }, { name: "documents", maxCount: 5 }, { name: "threeD", maxCount: 1 }]),
  addProject
);
router.get("/getprojects",getProjects)


module.exports = router;
