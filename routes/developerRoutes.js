const express = require("express");
const {
  createDeveloperHandler,
  getAllDevelopersHandler,
  getDeveloperByIdHandler,
  updateDeveloperHandler,
  putAttachmentDeveloper,
  deleteDeveloperHandler,
} = require("../controllers/developerController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// CREATE Developer
router.post("/", upload.single("attachments"), createDeveloperHandler);
router.post("/:id/attachments", upload.single("attachments"), putAttachmentDeveloper);

// GET All Developers
router.get("/", getAllDevelopersHandler);

// GET Developer by ID
router.get("/:id", getDeveloperByIdHandler);

// UPDATE Developer
router.put("/:id", updateDeveloperHandler);

// DELETE Developer
router.delete("/:id", deleteDeveloperHandler);

module.exports = router;
