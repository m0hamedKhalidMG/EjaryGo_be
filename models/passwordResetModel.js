const { doc, getDoc, setDoc, deleteDoc } = require("firebase/firestore/lite");
const bcrypt = require("bcrypt");
const { db } = require("../config/firebase");

// ✅ Get reset token data
const getResetToken = async (id) => {
  const resetRef = doc(db, "password_resets", id);
  const resetSnap = await getDoc(resetRef);
  return resetSnap.exists() ? resetSnap.data() : null;
};

// ✅ Store reset token in Firestore Lite
const saveResetToken = async (id, token) => {
  const hashedToken = await bcrypt.hash(token, 10);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Expires in 1 hour

  // Firestore Lite does not support `setDoc()`, so we use `doc()` correctly
  await setDoc(doc(db, "password_resets", id), { token: hashedToken, expiresAt });
};

// ✅ Verify token validity
const verifyResetToken = async (token, resetData) => {
    if (!resetData) {
        console.error("❌ Reset data not found for the provided ID.");
        return false;
      }
      if (!resetData.token) {
        console.error("❌ Token is missing in Firestore document:", resetData);
        return false;
      }
  if (!resetData || new Date() > resetData.expiresAt.toDate()) return false;
  return await bcrypt.compare(token, resetData.token);
};

// ✅ Update password in Firestore Lite
const updateEmployeePassword = async (id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Firestore Lite does not support `updateDoc()`, so we use `setDoc()`
  await setDoc(doc(db, "employees", id), { password: hashedPassword }, { merge: true });
};

// ✅ Delete reset token after use
const deleteResetToken = async (id) => {
  await deleteDoc(doc(db, "password_resets", id));
};

module.exports = {
  getResetToken,
  saveResetToken,
  verifyResetToken,
  updateEmployeePassword,
  deleteResetToken
};
