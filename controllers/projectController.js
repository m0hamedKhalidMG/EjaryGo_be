const { v4: uuidv4 } = require('uuid');
const { createProject } = require("../models/projectModel");
const projectSchema = require("../validations/projectValidation");
const { uploadFile } = require("./uploadController");
const { getAllProjects } = require("../models/projectModel");

const addProject = async (req, res) => {
    try {
      // Validate request body
    const { error } = projectSchema.validate(req.body);
    //   console.log(error)
    if (error) return res.status(400).json({ error: error.details[0].message });
  
      const projectId = Date.now().toString();
      const fileUrls = {};
  
      // Upload files if present
      if (req.files) {
        if (req.files.images) {
          fileUrls.images = await Promise.all(
            req.files.images.map((file) => uploadFile(file, `projects/${projectId}/images`))
          );
        }
        if (req.files.video) {
          fileUrls.video = await uploadFile(req.files.video[0], `projects/${projectId}/videos`);
        }
        if (req.files.documents) {
          fileUrls.documents = await Promise.all(
            req.files.documents.map((file) => uploadFile(file, `projects/${projectId}/documents`))
          );
        }
        if (req.files.threeD) {
          fileUrls.threeD = await uploadFile(req.files.threeD[0], `projects/${projectId}/3D`);
        }
      }
  
      // Prepare project data
      const projectData = { ...req.body, fileUrls };
  
      // Save to Firestore
      await createProject(projectId, projectData);
  
      res.json({ message: "Project created successfully!", projectId, fileUrls });
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: error.message });
    }
  };

  // Controller function to handle fetching projects
  const getProjects = async (req, res) => {
    try {
      const projects = await getAllProjects();
  
      if (!Array.isArray(projects)) {
        console.error("Unexpected data format from getAllProjects.");
        return res.status(500).json({ message: "Internal Server Error" });
      }
  
      res.json(projects);
    } catch (error) {
      console.error("Error in controller:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  module.exports = { addProject ,getProjects};