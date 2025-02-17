const { db } = require("../config/firebase");
const { collection, doc,addDoc, getDoc, getDocs, setDoc, deleteDoc, updateDoc } = require("firebase/firestore/lite");

// CREATE Developer
const createDeveloper = async ( developerData) => {
     const developerRef = await addDoc(collection(db, "developers"), developerData);
  return { id: developerRef.id, ...developerData };
};
const updateDeveloperAttachment = async (developerId, attachmentUrl) => {
  const developerRef = doc(db, "developers", developerId);
  const developerSnap = await getDoc(developerRef);

  if (!developerSnap.exists()) {
    throw new Error("Developer not found");
  }

  await updateDoc(developerRef, { attachment: attachmentUrl });

  return { id: developerId, attachmentUrl };
};
// GET ALL Developers
const getAllDevelopers = async () => {
  const developersSnapshot = await getDocs(collection(db, "developers"));
  if (developersSnapshot.empty) return [];

  let developers = [];
  developersSnapshot.forEach((docSnap) => {
    developers.push({ id: docSnap.id, ...docSnap.data() });
  });

  return developers;
};

// GET Developer by ID
const getDeveloperById = async (developerId) => {
  const developerRef = doc(db, "developers", developerId);
  const developerSnap = await getDoc(developerRef);
  if (!developerSnap.exists()) throw new Error("Developer not found");

  return { id: developerSnap.id, ...developerSnap.data() };
};

// UPDATE Developer
const updateDeveloper = async (developerId, updatedData) => {
  const developerRef = doc(db, "developers", developerId);
  await updateDoc(developerRef, updatedData);
  return { id: developerId, ...updatedData };
};

// DELETE Developer
const deleteDeveloper = async (developerId) => {
  await deleteDoc(doc(db, "developers", developerId));
  return { message: "Developer deleted successfully" };
};

module.exports = { createDeveloper, getAllDevelopers, getDeveloperById, updateDeveloper, deleteDeveloper,updateDeveloperAttachment };
