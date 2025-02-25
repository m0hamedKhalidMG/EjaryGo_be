const { addProperty, updateProperty, uploadPropertyImages ,getPropertyById,getPropertiesByProjectId} = require("../models/propertyModel");
const { propertySchema } = require("../validations/propertyValidation");
const { paginateResults } = require("../utils/pagination");
const { medicalUnitSchema } = require("../validations/medicalUnitValidation");
const { OtherUnitSchema } = require("../validations/Otherunitvalidation");

/**
 * Create a new property
 */
const createProperty = async (req, res) => {
  try {
    let schema;
    if (typeof req.body.totalPrice === "string") {
      req.body.totalPrice = JSON.parse(req.body.totalPrice);
    }
    if (typeof req.body.roomSizes === "string") {
      req.body.roomSizes = JSON.parse(req.body.roomSizes);
    }
    // Determine the correct schema based on property type
    if (["medicalUnit", "administrative"].includes(req.body.type)) {
      schema = medicalUnitSchema;
    } else if (["apartment", "villa", "studio", "penthouse"].includes(req.body.type)) {
      schema = propertySchema;
    }else if (["Entertainment","Commercial"].includes(req.body.type)) {
      schema = OtherUnitSchema;
    } else {
      return res.status(400).json({ error: "Invalid property type." });
    }

    // Validate request body
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let images = [];

    // Upload images to Firebase Storage if provided
    if (req.files && req.files.length > 0) {
      images = await uploadPropertyImages(req.files, "properties");
    }

    // Save property details in Firestore
    const property = await addProperty({ ...value, images });

    res.status(201).json({ message: "Property added successfully", property });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: error.message });
  }
};


const getPropertybyId = async (req, res) => {
    try {
      const { propertyId } = req.params; // Extract property ID from request parameters
  
      if (!propertyId) {
        return res.status(400).json({ message: "Property ID is required." });
      }
  
      const property = await getPropertyById(propertyId);
  
      if (!property) {
        return res.status(404).json({ message: "Property not found." });
      }
  
      res.status(200).json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
   

  const getPropertiesByProject = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { page = 1, pageSize = 10 } = req.query;
  
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }
  
      const properties = await getPropertiesByProjectId(projectId);
      const paginatedData = paginateResults(properties, parseInt(page), parseInt(pageSize));
  
      res.status(200).json(paginatedData);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving properties", error: error.message });
    }
  
  };
  
/**
 * Update existing property
 */
const updatePropertyDetails = async (req, res) => {
  try {
    // const { error, value } = propertySchema.validate(req.body, { allowUnknown: true });

    // Validate request body
    const { error, value } = req.body;
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

module.exports = { createProperty, getPropertybyId,updatePropertyDetails ,getPropertiesByProject};
