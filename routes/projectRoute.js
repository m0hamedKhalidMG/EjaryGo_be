const multer = require('multer');
const express = require('express');
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { addProject,getProjects } = require("../controllers/projectController");
// router.put('/update-profile-image/:userId',upload.single('image'),updateimage);
const {isAuthenticated,verifyJWT }= require("../middleware/authMiddleware")


router.post(
  "/add",verifyJWT,
  upload.fields([
    { name: "images", maxCount: 20 },
    { name: "video", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "ministerialDecision", maxCount: 1 }, // قرار وزاري
    { name: "landOwnershipDocs", maxCount: 1 },   // مستندات ملكية الأرض
    { name: "constructionDocs", maxCount: 1 },   // مستندات إنشائية
    { name: "threeD", maxCount: 5 }
  ]),
  addProject
);
router.get("/getprojects",getProjects)


module.exports = router;
