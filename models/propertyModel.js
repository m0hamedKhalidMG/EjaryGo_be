const { db } = require("../config/firebase");
const { addDoc, updateDoc, getDoc,collection, doc} = require("firebase/firestore/lite");
const { uploadFile } = require("./../controllers/uploadController");

/**
 * Add a new property to Firestore
 * @param {Object} propertyData - The property details
 * @returns {Promise<Object>}
 */
const addProperty = async (propertyData) => {
    const { projectId } = propertyData;
  console.log(projectId)
    // Check if project exists before creating property
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);
  
    if (!projectSnap.exists()) {
      throw new Error("Project does not exist. Cannot create property.");
    }
  
    // If project exists, proceed with property creation
    const propertiesCollection = collection(db, "properties");
    const docRef = await addDoc(propertiesCollection, propertyData);
  
    return { id: docRef.id, ...propertyData };
  };

/**
 * Update property details in Firestore
 * @param {string} propertyId - ID of the property to update
 * @param {Object} updatedData - Updated property details
 * @returns {Promise<Object>}
 */
const updateProperty = async (propertyId, updatedData) => {
  const propertyRef = doc(db, "properties", propertyId); // Correct reference
  await updateDoc(propertyRef, updatedData);
  return { id: propertyId, ...updatedData };
};

/**
 * Get property by ID
 * @param {string} propertyId - ID of the property
 * @returns {Promise<Object>}
 */
const getPropertyById = async (propertyId) => {
  const propertyRef = doc(db, "properties", propertyId);
  const propertySnap = await getDoc(propertyRef);
  if (!propertySnap.exists()) return null;
  return { id: propertySnap.id, ...propertySnap.data() };
};

/**
 * Upload multiple images and return URLs
 * @param {Array} files - List of image files
 * @param {string} folder - Storage folder
 * @returns {Promise<Array>} - List of image URLs
 */
const uploadPropertyImages = async (files, folder) => {
  const uploadPromises = files.map((file) => uploadFile(file, folder));
  return Promise.all(uploadPromises);
};

module.exports = { addProperty, updateProperty, getPropertyById, uploadPropertyImages };
