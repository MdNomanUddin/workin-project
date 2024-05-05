import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { QuerySnapshot, DocumentData  } from "firebase/firestore";
import { notifyError, notifySuccess } from "./notification";

export default function Login() {
  
const navigate = useNavigate();

// State
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

// Handlers
async function loginHandler() {
  // Input validation
  if (!email || !password) {
    notifyError("Please fill all fields");
    setEmail("");
    setPassword("");
    return;
  }

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email");
    setEmail("");
    setPassword("");
    return;
  }

  // Firestore queries
  const adminQuery = query(collection(db, "admins"), where("email", "==", email));
  const userQuery = query(collection(db, "users"), where("email", "==", email));

  try {
    const adminSnapshot = await getDocs(adminQuery) as QuerySnapshot<DocumentData>;
    const userSnapshot = await getDocs(userQuery) as QuerySnapshot<DocumentData>;

    // Check for user or admin
    if (adminSnapshot.empty && userSnapshot.empty) {
      notifyError("Invalid email or password");
      setEmail("");
      return;
    }

    if (!adminSnapshot.empty) {
      const adminDoc = adminSnapshot.docs.find((doc) => doc.data().password === password);
      if (adminDoc) {
        localStorage.setItem("loggedInUser", JSON.stringify(adminDoc.data()));
        localStorage.setItem("loggedIn", "true");
        notifySuccess("Welcome admin");
        navigate("/"); // Navigate to admin page
        return;
      } else {
        notifyError("Incorrect password");
        setPassword("");
      }
    } else if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs.find((doc) => doc.data().password === password);
      if (userDoc) {
        localStorage.setItem("loggedInUser", JSON.stringify(userDoc.data()));
        localStorage.setItem("loggedIn", "true");
        notifySuccess("Login Successfull");
        navigate("/"); // Navigate to user page (or homepage)
        return;
      } else {
      notifyError("Incorrect Password");
      setPassword("");
      }
    }
  } catch (error) {
    console.error("Error getting documents:", error);
    notifyError("Login failed. Please try again!!");
  }
  }


  return (
    <section className="flex h-screen w-screen items-center justify-center">
      <div className="rounded-2xl bg-gray-300 p-8 shadow-xl">
        <h1 className="mb-6 text-center text-xl font-semibold">Login Page</h1>
        <div className="flex flex-col space-y-4">
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
        <button
          className="mt-4 w-full rounded-md bg-blue-500 py-2 font-semibold"
          onClick={loginHandler}
        >
          Login
        </button>
        <div className="text-center">
            <p className="text-sm mt-2 mb-2 ">Don't have an account? <a href="/signup" className="text-blue-500 underline" onClick={(e) => { e.preventDefault(); navigate("/signup") }}>Signup here</a> </p>
        </div>
      </div>
    </section>
  );
}
