const { getDoc, deleteDoc, updateDoc, doc, setDoc } = require("firebase/firestore");
const bcrypt = require("bcrypt");
const { db } = require("../config/firebase");

// ✅ Get reset token data
const getResetToken = async (id) => {
  const resetRef = doc(db, "password_resets", id);
  const resetSnap = await getDoc(resetRef);
  return resetSnap.exists() ? resetSnap.data() : null;
};

// ✅ Store reset token in Firestore
const saveResetToken = async (id, token) => {
  const hashedToken = await bcrypt.hash(token, 10);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Expires in 1 hour
  await setDoc(doc(db, "password_resets", id), { token: hashedToken, expiresAt });
};

// ✅ Verify token validity
const verifyResetToken = async (token, resetData) => {
  if (!resetData || new Date() > resetData.expiresAt.toDate()) return false;
  return await bcrypt.compare(token, resetData.token);
};

// ✅ Update password in Firestore
const updateEmployeePassword = async (id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const employeeRef = doc(db, "employees", id);
  await updateDoc(employeeRef, { password: hashedPassword });
};

// ✅ Delete reset token after use
const deleteResetToken = async (id) => {
  const resetRef = doc(db, "password_resets", id);
  await deleteDoc(resetRef);
};

module.exports = {
  getResetToken,
  saveResetToken,
  verifyResetToken,
  updateEmployeePassword,
  deleteResetToken
};
