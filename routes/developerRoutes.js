const express = require("express");
const {
  createDeveloperHandler,
  getAllDevelopersHandler,
  getDeveloperByIdHandler,
  updateDeveloperHandler,
  putAttachmentDeveloper,
  deleteDeveloperHandler,
  addEmployeeToTeam,
  addTeamToDeveloper,
} = require("../controllers/developerController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


router.post("/:developerId/add-team", addTeamToDeveloper);
router.post('/add-employee-to-team', addEmployeeToTeam);

// CREATE Developer
router.post("/:id/attachments", upload.single("attachments"), putAttachmentDeveloper);
// GET All Developers
router.get("/", getAllDevelopersHandler);
router.post("/", upload.single("attachments"), createDeveloperHandler);

// GET Developer by ID
router.get("/:id", getDeveloperByIdHandler);

// UPDATE Developer
router.put("/:id", updateDeveloperHandler);

// DELETE Developer
router.delete("/:id", deleteDeveloperHandler);

module.exports = router;
