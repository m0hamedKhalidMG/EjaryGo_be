const { createUser,getUserByEmail  } = require("../models/userModel");
const { getFirestore, collection, addDoc, doc, getDoc,query ,where,getDocs,setDoc} = require('firebase/firestore/lite');
const { db } = require("../config/firebase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const addUser = async (req, res) => {
    try {
      const user=req.body;
      user.authMethod="manual";
      const userId = await createUser(user);
      res.status(201).json({ success: true, id: userId, message: "User added successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password!" });
      }
  
      // Verify Password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password!" });
      }
      // Generate JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET ,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({ token, message: "Login successful!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  
 

const completeProfile = async (req, res) => {
  try {
    const email = req.user.email; 
    console.log(email)
    const { mobile, location,img } = req.body;

    if (!mobile || !location) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    // Firestore Query to Find User by Email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the first matching user document
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);

    // Update User Data
    const updatedData = {
      mobile,
      location,
      isProfileComplete: true,
    };

    await setDoc(userRef, updatedData, { merge: true }); 

    res.json({ message: "Profile completed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  


module.exports = { addUser,loginUser,completeProfile  };
