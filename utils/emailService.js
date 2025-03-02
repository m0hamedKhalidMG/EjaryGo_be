const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure email transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port:465,
  secure:true,

  auth: {
    user: process.env.EMAIL_USER, // Set in .env
    pass: process.env.EMAIL_PASS  // Set in .env
  }
});

// Function to send an email invitation
const sendEmailInvite = async (email, resetUrl, developerName) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🎉 Welcome to the Team! Complete Your Employee Account Setup",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <div style="text-align: center;">
              <img src="https://yourcompany.com/logo.png" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;">
            </div>
            
            <h2 style="color: #333; text-align: center;">Welcome to Our Team! 🎉</h2>
            
            <p style="color: #555; font-size: 16px;">
              Hello,  
              <br><br>
              You have been added as an employee by <strong>${developerName}</strong>. We’re excited to have you on board!  
              To get started, please set up your password using the link below:
            </p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #007bff; color: #fff; padding: 12px 20px; font-size: 16px; text-decoration: none; border-radius: 5px;">Set Up Your Password</a>
            </div>
  
            <p style="color: #555; font-size: 14px;">
              <strong>Note:</strong> This link expires in 1 hour for security reasons.
            </p>
  
            <hr style="border: 0; border-top: 1px solid #ddd;">
            
            <p style="color: #777; font-size: 12px; text-align: center;">
              If you did not request this, please ignore this email.  
              <br><br>
              Regards,  
              <strong>Your Company Team</strong>
            </p>
          </div>
        `,
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`✅ Password setup email sent to ${email}`);
    } catch (error) {
      console.error("❌ Error sending email:", error.message);
    }
  };
  
  

module.exports = { sendEmailInvite };
