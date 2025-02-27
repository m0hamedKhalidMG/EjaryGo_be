const { db } = require("../config/firebase");
const { collection, doc, addDoc, getDoc, getDocs, setDoc, deleteDoc, updateDoc,query,where } = require("firebase/firestore/lite");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// CREATE Employee

// Function to check if an email already exists
const isEmailTaken = async (email) => {
    const employeesRef = collection(db, "employees");
    const emailQuery = query(employeesRef, where("email", "==", email));
    const querySnapshot = await getDocs(emailQuery);
    return !querySnapshot.empty; // Returns true if email exists, false otherwise
  };
  
  // Function to create a new employee
  const createEmployee = async (employeeData) => {
    employeeData.password = await bcrypt.hash(employeeData.password, 10); // Hash the password
    const employeesRef = collection(db, "employees");
    const employeeRef = await addDoc(employeesRef, employeeData);
    return { id: employeeRef.id, ...employeeData }; // Return new employee data
  };
// GET ALL Employees
const getAllEmployees = async () => {
    const employeesSnapshot = await getDocs(collection(db, "employees"));
    if (employeesSnapshot.empty) return [];

    let employees = [];
    employeesSnapshot.forEach((docSnap) => {
        employees.push({ id: docSnap.id, ...docSnap.data() });
    });

    return employees;
};

// GET Employee by ID
const getEmployeeById = async (employeeId) => {
    const employeeRef = doc(db, "employees", employeeId);
    const employeeSnap = await getDoc(employeeRef);
    if (!employeeSnap.exists()) throw new Error("Employee not found");

    return { id: employeeSnap.id, ...employeeSnap.data() };
};

// UPDATE Employee
const updateEmployee = async (employeeId, updatedData) => {
    const employeeRef = doc(db, "employees", employeeId);
    await updateDoc(employeeRef, updatedData);
    return { id: employeeId, ...updatedData };
};

// DELETE Employee
const deleteEmployee = async (employeeId) => {
    await deleteDoc(doc(db, "employees", employeeId));
    return { message: "Employee deleted successfully" };
};
const uploadProfile  = async (employeeId, attachmentUrl) => {
  const employeeIdRef = doc(db, "employees", employeeId);
  const employeeIdSnap = await getDoc(employeeIdRef);

  if (!employeeIdSnap.exists()) {
    throw new Error("employee not found");
  }

  await updateDoc(employeeIdRef, { profile_img: attachmentUrl });

  return { id: employeeId, attachmentUrl };
};
module.exports = {isEmailTaken, createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee,uploadProfile };
