const { db } = require("../config/firebase");
const { addDoc, updateDoc, getDoc,getDocs,collection, doc,query,where} = require("firebase/firestore/lite");
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
  try {
    const propertyRef = doc(db, "properties", propertyId);
    const propertySnap = await getDoc(propertyRef);

    if (!propertySnap.exists()) throw new Error("Property not found");

    let propertyData = propertySnap.data();

    // Fetch project details using projectId
    if (propertyData.projectId) {
      const projectRef = doc(db, "projects", propertyData.projectId);
      const projectSnap = await getDoc(projectRef);

      propertyData.project = projectSnap.exists()
        ? { id: projectSnap.id, ...projectSnap.data() }
        : null;
    }

    return { id: propertySnap.id, ...propertyData };
  } catch (error) {
    console.error("Error fetching property:", error);
    throw new Error("Failed to fetch property.");
  }
};

const getPropertiesByProjectId = async (projectId) => {
  try {
    const propertiesRef = collection(db, "properties");
    const q = query(propertiesRef, where("projectId", "==", projectId));
    const querySnapshot = await getDocs(q);

    let properties = [];
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() });
    });

    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Failed to retrieve properties.");
  }
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

module.exports = { addProperty, updateProperty, getPropertyById, uploadPropertyImages,getPropertiesByProjectId };
