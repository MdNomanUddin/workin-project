import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { notifyError, notifySuccess } from "./notification";
export default function Signup() {
  const navigate = useNavigate();
  const[uname,setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


   

  // Function to check if a user already exists in Firestore
const checkIfUserExists = async (email:String|null) => {
  const userRef = collection(db, "users");
  const userQuery = query(userRef, where("email", "==", email));
  const querySnapshot = await getDocs(userQuery);
  return !querySnapshot.empty;
};

  //Function to check if an admin already exists in firestore
const checkIfUserIsAdmin = async (email:String|null) => {
  const userRef = collection(db, "admin");
  const userQuery = query(userRef, where("email", "==", email));
  const querySnapshot = await getDocs(userQuery);
  return !querySnapshot.empty;

};



  // Function to sign up with email and password
  const signupWithEmailPassword = async () => {
    if (!email || !password) {
      notifyError("Please fill all fields");
      return;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!emailRegex.test(email)) {
      notifyError("Please enter a valid email");
      return;
    }

   

    try {
      // Create user with email and password
      const auth = getAuth();
      const userExists = await checkIfUserExists(email);
      const adminExists = await checkIfUserIsAdmin(email);

    if (userExists || adminExists) {
      // Show pop-up message for already signed up user
      notifyError("User Already Signed!!");
      // Reset input values
      setEmail("");
      setPassword("");
      setName("");
      return;
    }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = {
        email: userCredential.user.email,
        name:uname, 
        password:password// Optionally, you can save the user's UID in your database
      };

    
      
      // Add the new user to the "users" collection
      await addDoc(collection(db, "users"), newUser);
      console.log("New user added with name: ", uname);
      notifySuccess("Account Created!!");
      navigate("/login"); // Navigate to home page after successful signup
    } catch (error) {
      console.error("Error signing up with email and password: ", error);
    }
  };

  // Function to sign up with Google
  // const signupWithGoogle = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const auth = getAuth();
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     // Extract user's email and name
  //   const userEmail = user.email;
  //   const userName = user.displayName;

  //   // Check if the user already exists in Firestore
  //   const userExists = await checkIfUserExists(userEmail);
  //   const adminExists = await checkIfUserIsAdmin(userEmail);

  //   if (userExists || adminExists) {
  //     // Show pop-up message for already signed up user
  //     alert("User already signed up");
  //     // Reset input values
  //     setEmail("");
  //     setPassword("");
  //     setName("");
  //     return;
  //   }

  //   // Add user data to Firestore database
  //   const userRef = collection(db, "users");
  //   await addDoc(userRef, {
  //     email: userEmail,
  //     name: userName,
  //   });
  //   console.log(userName,userEmail);
  //     // Optionally, you can save user data to your database here as well
  //     console.log("Signed up with Google: ", user);
  //     navigate("/login"); // Navigate to home page after successful signup
  //   } catch (error) {
  //     console.error("Error signing up with Google: ", error);
  //   }
  // };

  return (
    <section className="flex h-screen w-screen items-center justify-center">
      <div className="rounded-2xl bg-gray-300 p-8 shadow-xl">
        <h1 className="mb-6 text-center text-xl font-semibold">Create an Account</h1>
        <div className="flex flex-col space-y-4">
        <label htmlFor="name" className="w-80 space-y-1">
            <p>Name:</p>
            <input
              type="text"
              id="uname"
              className="w-full rounded bg-gray-100 p-1 px-2 placeholder:text-gray-400"
              placeholder="Username"
              value={uname}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label htmlFor="name" className="w-80 space-y-1">
            <p>Email:</p>
            <input
              type="email"
              id="email"
              className="w-full rounded bg-gray-100 p-1 px-2 placeholder:text-gray-400"
              placeholder="Enter an email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label htmlFor="password" className="w-80 space-y-1">
            <p>Password:</p>
            <input
              type="password"
              id="password"
              className="w-full rounded bg-gray-100 p-1 px-2 placeholder:text-gray-400"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white"
            onClick={signupWithEmailPassword}
          >
            Sign Up with Email
          </button>
          
          
        </div>
        <div className="text-right">
            <p className="text-sm mt-2 mb-2 ">Already have an account? <a href="/login" className="text-blue-500 underline" onClick={(e) => { e.preventDefault(); navigate("/login") }}>Login here</a> </p>
        </div>
      </div>
    </section>
  );
}
