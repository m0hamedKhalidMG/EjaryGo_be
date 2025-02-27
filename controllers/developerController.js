const {
    createDeveloper,
    getAllDevelopers,
    updateDeveloper,
    deleteDeveloper,
    addTeam,
    addEmployeeToTeamModel,
    updateDeveloperAttachment,
    getdeveloperByEmail,
    fetchDeveloperById,
    getTeamsByAttribute,
    getAllTeams,
  } = require("../models/developerModel");
  const Joi = require('joi');
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const {uploadFile} =require("./uploadController")
  const createDeveloperHandler = async (req, res) => {
    try {
         let attachmentUrl = null;
         const developerId = Date.now().toString();

    if (req.file) {
      attachmentUrl = await uploadFile(req.file, `developers/${developerId}/developers`);
    }

    let DeveloperData=req.body
    DeveloperData.password = await bcrypt.hash(DeveloperData.password, 10);
      const developer = await createDeveloper( { ...DeveloperData, attachmentUrl });
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
  const fetchAllTeams = async (req, res) => {
    try {
      const developerId = req.user.id; // Assuming developer ID is coming from auth middleware
  
      if (!developerId) {
        return res.status(400).json({ message: "Developer ID is required" });
      }
  
      const data = await getAllTeams(developerId);
  
      res.status(200).json({ data });
    } catch (error) {
      console.error("❌ Error fetching teams:", error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
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
  const developerLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const developer = await getdeveloperByEmail(email);
      if (!developer) {
        return res.status(400).json({ error: "Invalid email or password!" });
      }
  
      // Verify Password
      const isPasswordValid = await bcrypt.compare(password, developer.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password!" });
      }
  console.log(developer)
      // Generate JWT Token
      const token = jwt.sign(
        { id: developer.id, email: developer.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
  
      return res.status(200).json({
        message: "Login successful",
        token,
        developer: {
          id: developer.id,
          name: developer.name,
          email: developer.email,
          role: "developer",
        },
      });
  
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ error: error.message });
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
const addTeamToDeveloper = async (req, res) => {
      const { developerId } = req.params;
      const { name, role, managerId } = req.body;
    
      const teamSchema = Joi.object({
        name: Joi.string().trim().min(3).required(),
        role: Joi.string()
          .valid('Freelancing', 'Marketing', 'Sales', 'Finance', 'Broker')
          .required(),
        managerId: Joi.string().trim().required(),
      });
    
      const { error } = teamSchema.validate({ name, role, managerId });
    
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
    
      try {
        const result = await addTeam(developerId, { name, role, managerId });
        res.status(200).json({ message: result });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };
const addEmployeeToTeam = async (req, res) => {
      const { developerId, teamId, employeeId } = req.body;

      try {
        const message = await addEmployeeToTeamModel( developerId, teamId, employeeId);
        res.status(200).json({ message });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
const getDeveloperById = async (req, res) => {
      try {
        //const { developerId } = req.params;
        const developerId = req.user.id; 
console.log(req.user)
        // Fetch developer and their teams' employee details
        const developerData = await fetchDeveloperById(developerId);
    
        if (!developerData) {
          return res.status(404).json({ error: "Developer not found." });
        }
    
        return res.status(200).json({ developer: developerData });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }
    };

    const searchTeamByAttribute = async (req, res) => {
      try {
        const { teamName, attribute, value, page, pageSize } = req.query;
        const developerId = req.user.id; // ✅ Extract developer ID from authenticated user
    
        console.log("🔍 Searching with:", { teamName, attribute, value, developerId });
    
        // ✅ Fetch employees based on team name and specified attribute
        const results = await getTeamsByAttribute(teamName, attribute, value, developerId, Number(page), Number(pageSize));
    
     
    
        res.status(200).json(results);
      } catch (error) {
        console.error("❌ Error while searching:", error);
        console.log(error);
        res.status(500).json({ error: "Internal server error." });
      }
    };
    
    
    module.exports = { searchTeamByAttribute };
    
  module.exports = {
    createDeveloperHandler,
    getAllDevelopersHandler,
    getDeveloperByIdHandler,
    updateDeveloperHandler,
    deleteDeveloperHandler,
    putAttachmentDeveloper,
    addTeamToDeveloper,
    addEmployeeToTeam,
    developerLogin,
    getDeveloperById,
    searchTeamByAttribute,
    fetchAllTeams
  };
  