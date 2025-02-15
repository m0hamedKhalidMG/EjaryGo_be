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
  const getAllProjects = async () => {
    try {
      const projectsCollection = collection(db, "projects");
      if (!projectsCollection) {
        console.error("Projects collection does not exist.");
        return [];
      }
  
      const projectsSnapshot = await getDocs(projectsCollection); // Fetch all projects
  
      if (!projectsSnapshot || projectsSnapshot.empty) {
        console.warn("No projects found in Firestore.");
        return [];
      }
  
      let projects = [];
  
      for (const docSnap of projectsSnapshot.docs) {
        if (!docSnap.exists()) continue; // Skip non-existent documents
  
        const projectData = docSnap.data();
        let ownerDetails = null;
  
        // Fetch owner details if an owner ID exists
        if (projectData.owner && projectData.owner.id) {
          try {
            const ownerRef = doc(db, "owners", projectData.owner.id);
            const ownerSnap = await getDoc(ownerRef);
  
            ownerDetails = ownerSnap.exists()
              ? { id: ownerSnap.id, ...ownerSnap.data() }
              : { id: projectData.owner.id, name: "Unknown Owner" };
          } catch (ownerError) {
            console.error("Error fetching owner details:", ownerError);
            ownerDetails = { id: projectData.owner.id, name: "Unknown Owner" };
          }
        }
  
        // Add project with full owner details
        projects.push({
          id: docSnap.id,
          ...projectData,
          owner: ownerDetails,
        });
      }
  
      return projects;
    } catch (error) {
      console.error("Error fetching projects with owner details:", error);
      return []; // Return an empty array instead of throwing an error
    }
  };
module.exports = { createProject,getAllProjects };
