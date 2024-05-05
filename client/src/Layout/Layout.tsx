// import { Outlet } from "react-router-dom";

// export default function Layout() {
//   return (
//     <section>
//       <div className="flex items-center justify-between py-8 px-12">
//         <a href="/">Pothole Reporting</a>
//         <div className="space-x-2">
//           <a href="/complaint">Complaint</a>
//           <a href="/login">Login</a>
//           <a>Logout</a>
//         </div>
//       </div>
//       <Outlet />
//     </section>
//   );
// }



//== layout working fine and without user profile option
import { Outlet, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";



export default function Layout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const isLoggedInBool = isLoggedIn as boolean;
  // console.log(isLoggedInBool)
  // console.log(isLoggedIn)

  useEffect(() => {
    // Check login state on component mount
    if (!isLoggedInBool) {
      navigate("/login");
    }
  }, []); // Empty dependency array for initial render only

  return (
    <section>
      <div className="flex items-center justify-between py-8 px-12">
        <a href="/">Pothole Reporting</a>
        <div className="space-x-2">
          <a href="/complaint">Complaint</a>
          <a href="/status">Status</a>
          {isLoggedInBool && (
            <button onClick={handleLogout} type="button">
              Logout
            </button>
          )}
        </div>
      </div>
      <Outlet />
    </section>
  );
}


// code note working for showing user profile
// import React from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Profile from "../components/Profile"; // Import the Profile component

// export default function Layout() {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState<any>({}); // State for user data

//   const handleLogout = () => {
//     localStorage.removeItem("loggedIn");
//     localStorage.removeItem("loggedInUser"); // Remove user data as well
//     navigate("/login");
//   };

//   const isLoggedIn = localStorage.getItem("loggedIn") === "true";
//   const isLoggedInBool = isLoggedIn as boolean;

//   useEffect(() => {
//     // Check login state on component mount
//     if (!isLoggedInBool) {
//       navigate("/login");
//     }
//     // Fetch user data from localStorage (for demonstration only)
//     else{const storedUserData = localStorage.getItem("loggedInUser");
//     if (storedUserData) {
//       try {
//         const parsedData = JSON.parse(storedUserData);
//         setUserData(parsedData); // Update state with parsed user data
//       } catch (error) {
//         console.error("Error parsing user data from localStorage:", error);
//         // Handle parsing errors (optional: clear localStorage or display error message)
//       }
//     }}
    
//   }, []); // Empty dependency array for initial render only

//   return (
//     <section>
//       <div className="flex items-center justify-between py-8 px-12">
//         <a href="/">Pothole Reporting</a>
//         <div className="space-x-2">
//           <a href="/complaint">Complaint</a>
//           {isLoggedInBool && (
//             <>
//               {/* Display user profile information */}
//               <Profile userData={userData} />  {/* Pass user data as props */}
//               <button onClick={handleLogout} type="button">
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//       <Outlet />
//     </section>
//   );
// }
