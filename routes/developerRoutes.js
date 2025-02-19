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
  developerLogin,
  getDeveloperById
} = require("../controllers/developerController");
const upload = require("../middleware/uploadMiddleware");
const {isAuthenticated,verifyJWT }= require("../middleware/authMiddleware")

const router = express.Router();


router.post("/:developerId/add-team", addTeamToDeveloper);
router.post('/add-employee-to-team', addEmployeeToTeam);
router.post('/login', developerLogin);
router.get('/developer_details',verifyJWT, getDeveloperById);

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
