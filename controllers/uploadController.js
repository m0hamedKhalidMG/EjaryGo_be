const { format } = require("util");
const {bucket} = require('../config/firebase');

// Initialize Firebase Cloud Storage

/**
 * Upload a file to Firebase Storage
 * @param {Object} file - The uploaded file from multer
 * @param {string} folder - The storage path
 * @returns {Promise<string>} - Public URL of uploaded file
 */
const uploadFile = (file, folder) => {
  return new Promise((resolve, reject) => {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: { contentType: file.mimetype },
      public: true,
    });

    blobStream.on("error", (error) => {
      console.error("Upload Error:", error);
      reject({ message: "Upload failed", error });
    });

    blobStream.on("finish", async () => {
      const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${fileName}`);
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { uploadFile };
