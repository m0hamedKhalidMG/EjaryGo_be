const { db } = require("../config/firebase");

const employeeSchema = {
  name: "string",
  email: "string",
  password: "string",
  position: "string",
  salary: "number",
  target: "number",
  achievement: "number",
  total_commission: "number",
  profile_img: "string",
  contact: "array",
};

const createEmployee = async (data) => {
  return await db.collection("employees").add(data);
};

const getEmployeeByEmail = async (email) => {
  const snapshot = await db.collection("employees").where("email", "==", email).get();
  return snapshot.empty ? null : snapshot.docs[0];
};

module.exports = { createEmployee, getEmployeeByEmail };
