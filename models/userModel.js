const {db} = require("../config/firebase");
const {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  getDoc
} = require("firebase/firestore/lite");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  img: Joi.string().uri().optional(),
  balance: Joi.number().min(0).required(),
  email: Joi.string().email().required(),
  password: Joi.alternatives().conditional("authMethod", {
    is: "manual",
    then: Joi.string().min(6).required(),
    otherwise: Joi.allow(null),
  }),
  authMethod: Joi.string().valid("manual", "google").required(),
  mobile: Joi.array()
    .items(Joi.string().min(10))
    .min(1)
    .when("authMethod", {
      is: "manual",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    })
    .when("authMethod", {
      is: "manual",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    isProfileComplete: Joi.boolean().default(false).when("authMethod", {
      is: "manual",
      then: Joi.valid(true),
      otherwise: Joi.valid(false),
    }),
    
});

// Function to Create a User
const createUser = async (data) => {
  try {
    // Validate User Input
    const { error } = userSchema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Extract user data
    const { name, email, mobile, password, img, authMethod, location } = data;

    // Prepare user data
    
    // Prepare user data
    const userData = {
      name,
      email,
      mobile: Array.isArray(mobile) ? mobile : mobile ? [mobile] : [],
      balance: 0,
      img: img || "",
      authMethod, // "google" or "manual"
      location: location || "",
    };
    // If the user signs up manually, hash the password
    if (authMethod === "manual") {
      if (!password) {
        throw new Error("Password is required for manual sign-up");
      }
      userData.password = await bcrypt.hash(password, 10); // Hash password
    }else{
      userData.isProfileComplete=false
    }

    console.log("Saving user:", userData);

    // Add user to Firestore
    const docRef = await addDoc(collection(db, "users"), userData);

    return { id: docRef.id, message: "User created successfully!" };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};


// Function to Get a User by ID
const getUserById = async (id) => {
  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("User not found");
    }

    return docSnap.data();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Function to Get a User by Email
const getUserByEmail = async (email) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; // No user found
    }

    return querySnapshot.docs[0].data(); // Return user data
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

// Export functions
module.exports = { createUser, getUserById, getUserByEmail };
