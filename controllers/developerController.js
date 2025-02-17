const {
    createDeveloper,
    getAllDevelopers,
    getDeveloperById,
    updateDeveloper,
    deleteDeveloper,
    updateDeveloperAttachment,
  } = require("../models/developerModel");
  const {uploadFile} =require("./uploadController")
  const createDeveloperHandler = async (req, res) => {
    try {
         let attachmentUrl = null;
         const developerId = Date.now().toString();

    if (req.file) {
      attachmentUrl = await uploadFile(req.file, `developers/${developerId}/developers`);
    }

      const developer = await createDeveloper( { ...req.body, attachmentUrl });
      res.status(201).json(developer);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  };
  
  // GET ALL Developers
  const getAllDevelopersHandler = async (req, res) => {
    try {
      const developers = await getAllDevelopers();
      res.json(developers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // GET Developer by ID
  const getDeveloperByIdHandler = async (req, res) => {
    try {
      const developer = await getDeveloperById(req.params.id);
      res.json(developer);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  
  // UPDATE Developer
  const updateDeveloperHandler = async (req, res) => {
    try {
      const updatedDeveloper = await updateDeveloper(req.params.id, req.body);
      res.json(updatedDeveloper);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // DELETE Developer
  const deleteDeveloperHandler = async (req, res) => {
    try {
      const result = await deleteDeveloper(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// Upload attachment and update developer record
const putAttachmentDeveloper = async (req, res) => {
  try {
    const developerId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload file to Firebase Storage
    const attachmentUrl = await uploadFile(file, `developers/${developerId}/${Date.now()}_${file.originalname}`);

    // Update Firestore with attachment URL
    const updatedDeveloper = await updateDeveloperAttachment(developerId, attachmentUrl);

    res.status(200).json({ message: "Attachment uploaded", updatedDeveloper });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
    // Upload file to Firebase

  module.exports = {
    createDeveloperHandler,
    getAllDevelopersHandler,
    getDeveloperByIdHandler,
    updateDeveloperHandler,
    deleteDeveloperHandler,
    putAttachmentDeveloper
  };
  