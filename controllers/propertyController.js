const { addProperty, updateProperty, uploadPropertyImages } = require("../models/propertyModel");
const { propertySchema } = require("../validations/propertyValidation");

/**
 * Create a new property
 */
const createProperty = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = propertySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    var images=[]
    // Upload images to Firebase Storage
    if (req.files && req.files.length > 0) {
         images = await uploadPropertyImages(req.files, "properties");

      }
      
     
      
    // Save property details in Firestore
    const property = await addProperty({ ...value, images });

    res.status(201).json({ message: "Property added successfully", property });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update existing property
 */
const updatePropertyDetails = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = propertySchema.validate(req.body, { allowUnknown: true });
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Upload new images if provided
    const images = req.files.length > 0 ? await uploadPropertyImages(req.files, "properties") : value.images;

    // Update property details
    const updatedProperty = await updateProperty(req.params.id, { ...value, images });

    res.status(200).json({ message: "Property updated successfully", updatedProperty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createProperty, updatePropertyDetails };
