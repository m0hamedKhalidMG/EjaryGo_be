const {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    setDoc,
    addDoc,
    doc,
    getDoc
  } = require("firebase/firestore/lite");
  const { db } = require("../config/firebase");

  const createProject = async (projectId, projectData) => {
    try {
      const projectRef = doc(db, "projects", projectId);
      await setDoc(projectRef, projectData, { merge: true }); // Merge to update existing projects
      return projectId;
    } catch (error) {
      console.error("Error creating/updating project:", error);
      throw new Error("Failed to create or update project.");
    }
  };
  
module.exports = { createProject };
