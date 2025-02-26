const { v4: uuidv4 } = require('uuid');
const { createProject } = require("../models/projectModel");
const projectSchema = require("../validations/projectValidation");
const { uploadFile } = require("./uploadController");
const { getAllProjects } = require("../models/projectModel");
const { paginateResults } = require("../utils/pagination");

const addProject = async (req, res) => {
  try {
    // Validate request body
    const developerId = req.user.id; 
    console.log(developerId)
let data=req.body;
data.ownerId=developerId
    const { error } = projectSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const projectId = Date.now().toString();
    const fileUrls = {};

    // رفع الملفات إذا كانت موجودة
    if (req.files) {
      if (req.files.images) {
        fileUrls.images = await Promise.all(
          req.files.images.map((file) => uploadFile(file, `projects/${projectId}/images`))
        );
      }
        if (req.files.logo) {
          fileUrls.logo = await uploadFile(req.files.logo[0], `projects/${projectId}/logo`);
        }
      
      if (req.files.video) {
        fileUrls.video = await uploadFile(req.files.video[0], `projects/${projectId}/videos`);
      }
      if (req.files.ministerialDecision) {
        fileUrls.ministerialDecision = await uploadFile(req.files.ministerialDecision[0], `projects/${projectId}/ministerialDecision`);
      }
      if (req.files.landOwnershipDocs) {
        fileUrls.landOwnershipDocs = await uploadFile(req.files.landOwnershipDocs[0], `projects/${projectId}/landOwnershipDocs`);
      }
      if (req.files.constructionDocs) {
        fileUrls.constructionDocs = await uploadFile(req.files.constructionDocs[0], `projects/${projectId}/constructionDocs`);
      }
      if (req.files.threeD) {

        fileUrls.threeDs = await Promise.all(
          req.files.threeD.map((file) => uploadFile(file, `projects/${projectId}/3D`))
        );

      }
    }

    // إعداد بيانات المشروع
    const projectData = { ...req.body, fileUrls };

    // حفظ المشروع في Firestore
    await createProject(projectId, projectData);

    res.json({ message: "Project created successfully!", projectId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


  // Controller function to handle fetching projects
  const getProjects = async (req, res) => {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const projects = await getAllProjects();
      const paginatedData = paginateResults(projects, parseInt(page), parseInt(pageSize));

      if (!Array.isArray(projects)) {
        console.error("Unexpected data format from getAllProjects.");
        return res.status(500).json({ message: "Internal Server Error" });
      }
  
      res.json(paginatedData);
    } catch (error) {
      console.error("Error in controller:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  module.exports = { addProject ,getProjects};