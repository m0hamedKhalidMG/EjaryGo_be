const { db } = require("../config/firebase");
const { collection, doc,addDoc, getDoc, getDocs, setDoc, deleteDoc, updateDoc,arrayUnion, query,
  where,  } = require("firebase/firestore/lite");
const { v4: uuidv4 } = require('uuid');
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
// const getDeveloperById = async (developerId) => {
//   const developerRef = doc(db, "developers", developerId);
//   const developerSnap = await getDoc(developerRef);
//   if (!developerSnap.exists()) throw new Error("Developer not found");

//   return { id: developerSnap.id, ...developerSnap.data() };
// };

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


const addTeam = async (developerId, teamData) => {
  const { name, role, managerId } = teamData;

  try {
    // Check if the developer exists
    const developerRef = doc(db, 'developers', developerId);
    const developerDoc = await getDoc(developerRef);

    if (!developerDoc.exists()) {
      throw new Error('Developer not found.');
    }

    // Check if the manager exists
    const employeeRef = doc(db, 'employees', managerId);
    const employeeDoc = await getDoc(employeeRef);

    if (!employeeDoc.exists()) {
      throw new Error('Manager (Employee) not found.');
    }
    const teamId = uuidv4();
    // Add the team to the developer's record
    await updateDoc(developerRef, {
      teams: arrayUnion({
        id: teamId,
        name,
        role,
        managerId,
        employees: [],  // You can later add employees to this team
      }),
    });

    return 'Team added successfully.';
  } catch (err) {
    throw new Error(err.message);
  }
};

const addEmployeeToTeamModel = async (developerId, teamId, employeeId) => {
  try {
    // Check if employee exists
    const employeeRef = doc(db, 'employees', employeeId);
    const employeeDoc = await getDoc(employeeRef);

    if (!employeeDoc.exists()) {
      throw new Error('Employee not found.');
    }

    // Check if developer exists
    const developerRef = doc(db, 'developers', developerId);
    const developerDoc = await getDoc(developerRef);

    if (!developerDoc.exists()) {
      throw new Error('Developer not found.');
    }

    const developerData = developerDoc.data();

    // Find the team by id
    const teamIndex = developerData.teams.findIndex((team) => team.id === teamId);

    if (teamIndex === -1) {
      throw new Error('Team not found.');
    }

    // Check if employee is already in the team
    if (developerData.teams[teamIndex].employees.includes(employeeId)) {
      throw new Error('Employee already assigned to this team.');
    }

    // Add employee to the team
    developerData.teams[teamIndex].employees.push(employeeId);

    // Update the developer document
    await updateDoc(developerRef, { teams: developerData.teams });

    return `Employee ${employeeId} added to team ${teamId} successfully.`;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getdeveloperByEmail = async (email) => {
  try {
     const q = query(collection(db, "developers"), where("email", "==", email));
     const querySnapshot = await getDocs(q);
 
     if (querySnapshot.empty) {
       return null; // No user found
     }
     const docSnapshot = querySnapshot.docs[0];

     return {
      id: docSnapshot.id,   // Return developer ID
      ...docSnapshot.data() // Return developer data
    };
   } catch (error) {
     console.error("Error retrieving developer:", error);
     throw error;
   }
};

const fetchDeveloperById = async (developerId) => {
  try {
    // Reference to the developer document
    const developerRef = doc(db, "developers", developerId);
    const developerSnap = await getDoc(developerRef);

    if (!developerSnap.exists()) {
      return null; // Developer not found
    }

    let developerData = developerSnap.data();

    // Remove password before sending response
    delete developerData.password;

    // Fetch manager and employees' details for each team
    if (developerData.teams && developerData.teams.length > 0) {
      const teamPromises = developerData.teams.map(async (team) => {
        let managerDetails = null;
        let employeesDetails = [];

        // Fetch manager details
        if (team.managerId) {
          const managerRef = doc(db, "employees", team.managerId);
          const managerSnap = await getDoc(managerRef);

          if (managerSnap.exists()) {
            managerDetails = managerSnap.data();
            delete managerDetails.password; // Remove password
          }
        }

        // Fetch details of all employees in the team
        if (team.employees && team.employees.length > 0) {
          const employeePromises = team.employees.map(async (employeeId) => {
            const employeeRef = doc(db, "employees", employeeId);
            const employeeSnap = await getDoc(employeeRef);

            if (employeeSnap.exists()) {
              let employeeData = employeeSnap.data();
              delete employeeData.password; // Remove password
              return employeeData;
            }
            return null;
          });

          employeesDetails = await Promise.all(employeePromises);
        }

        return {
          ...team,
          managerDetails,
          employees: employeesDetails.filter((emp) => emp !== null), // Remove null values
        };
      });

      // Resolve all team data fetching operations
      developerData.teams = await Promise.all(teamPromises);
    }

    return developerData;
  } catch (error) {
    throw new Error(error.message);
  }
};


module.exports = {fetchDeveloperById, getdeveloperByEmail,createDeveloper, getAllDevelopers, updateDeveloper, deleteDeveloper,updateDeveloperAttachment,addTeam,addEmployeeToTeamModel };
