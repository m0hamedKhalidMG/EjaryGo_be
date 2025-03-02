const {
    getResetToken,
    verifyResetToken,
    updateEmployeePassword,
    deleteResetToken
  } = require("../models/passwordResetModel");
  
  const resetPassword = async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        console.error("❌ Error resetting password:",req.body);

      const { token, id } = req.query;
      const { newPassword } = req.body;
  
      // ✅ Validate password
      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters." });
      }
  
      // ✅ Get token from Firestore
      const resetData = await getResetToken(id);
      if (!resetData) return res.status(400).json({ message: "Invalid or expired token." });
  
      // ✅ Verify token
      const isValid = await verifyResetToken(token, resetData);
      if (!isValid) return res.status(400).json({ message: "Invalid token." });
  
      // ✅ Update password
      await updateEmployeePassword(id, newPassword);
  
      // ✅ Delete reset token
      await deleteResetToken(id);
  
      res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
      console.error("❌ Error resetting password:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  module.exports = { resetPassword };
  