const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|mp4|pdf|obj|mov|gltf/;
    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

    if (extName) return cb(null, true);
    cb(new Error("File type not supported"));
  },
});

module.exports = upload;
