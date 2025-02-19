const multer = require('multer');
const express = require('express');
const {createProperty, updatePropertyDetails } = require("../controllers/propertyController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Handle file uploads

// router.post("/", upload.array("images"), createProperty);
// router.get("/", listProperties);
// router.get("/:id", getProperty);
// router.put("/:id", updatePropertyDetails);
// router.delete("/:id", removeProperty);



router.post("/", upload.array("images"), createProperty);
router.put("/:id", upload.array("images"), updatePropertyDetails);
module.exports = router;
