const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createEmployee, getEmployeeByEmail } = require("../models/employeeModel");

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

module.exports = { registerEmployee, loginEmployee };
