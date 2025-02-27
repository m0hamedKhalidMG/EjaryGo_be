const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createEmployee, getEmployeeByEmail,uploadProfile ,isEmailTaken} = require("../models/employeeModel");
const { validateEmployee } = require("../validations/employeeValidation");
const { v4: uuidv4 } = require('uuid');
const { uploadFile } = require("./uploadController");
const Joi = require('joi');
const { addTeam,addEmployeeToTeamModel } = require('../models/developerModel');

const registerEmployee = async (req, res) => {
  try {
    const { name, email, password, position, salary, contact } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = { name, email, password: hashedPassword, position, salary, contact };
    await createEmployee(newEmployee);

    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employeeDoc = await getEmployeeByEmail(email);
    
    if (!employeeDoc) return res.status(401).json({ error: "Invalid credentials" });

    const employee = employeeDoc.data();
    const passwordMatch = await bcrypt.compare(password, employee.password);

    if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: employeeDoc.id, email: employee.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



  
const addEmployee = async (req, res) => {
  try {
    const developerId = req.user.id;
    let data = { ...req.body, password: "SecurePass123!", developerId };
    if (!req.files || !req.files.National_Id || req.files.National_Id.length === 0) {
      return res.status(400).json({ message: ["National Id attachment (image) is required."] });
    }
    const { error } = validateEmployee(data);
    if (error) {
      return res.status(400).json({ message: error.details.map((e) => e.message) });
    }

    if (await isEmailTaken(data.email)) {
      return res.status(400).json({ message: "Email already exists. Please use a different email." });
    }

    const fileUrls = {};
    if (req.files) {
      if (req.files.National_Id) {
        fileUrls.National_Id = await uploadFile(req.files.National_Id[0], `Employee/${developerId}/National_Id`);
      }
      if (req.files.profile_img) {
        fileUrls.profile_img = await uploadFile(req.files.profile_img[0], `Employee/${developerId}/profile_img`);
      }
    }

    const employeeData = { ...data, fileUrls };
    const newEmployee = await createEmployee(employeeData);

    const { teamId } = req.body;
    if (teamId) {
      try {
        const message = await addEmployeeToTeamModel(developerId, teamId, newEmployee.id);
        return res.status(200).json({ message, employee: newEmployee });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    res.status(201).json({ message: "Employee created successfully", employee: newEmployee });

  } catch (error) {
    console.error("❌ Error creating employee:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
  






const getEmployees = async (req, res) => {
  try {
      const employees = await getAllEmployees();
      res.status(200).json(employees);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
// GET Employee by ID
const getEmployee = async (req, res) => {
  try {
      const employee = await getEmployeeById(req.params.id);
      res.status(200).json(employee);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
};
// UPDATE Employee
const modifyEmployee = async (req, res) => {
  try {
      const updatedEmployee = await updateEmployee(req.params.id, req.body);
      res.status(200).json({ message: "Employee updated", employee: updatedEmployee });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
// DELETE Employee
const removeEmployee = async (req, res) => {
  try {
      await deleteEmployee(req.params.id);
      res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
const uploadProfileImage  = async (req, res) => {
  try {
    const employeeId  = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload file to Firebase Storage
    const attachmentUrl = await uploadFile(file, `employees/${employeeId}/${Date.now()}_${file.originalname}`);

    // Update Firestore with attachment URL
    const updatedDeveloper = await uploadProfile(employeeId, attachmentUrl);

    res.status(200).json({ message: "Attachment uploaded", updatedDeveloper });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// controllers/developerController.js


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


module.exports = { registerEmployee, loginEmployee ,addEmployee, getEmployees, getEmployee, modifyEmployee, removeEmployee,uploadProfileImage ,addTeamToDeveloper };









