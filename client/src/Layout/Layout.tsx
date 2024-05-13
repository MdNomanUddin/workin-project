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
import Home from "../pages/Home";



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

        <div className="space-x-4">
          <a href="/home" className="mx-3 text-lg text-black cursor-pointer hover:text-gray-300">Home</a>

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
      {/* <div className=" container relative flex col items-start lg:w-3/5 xl:w-2/5 bg-slate-600">
          pothhole - Ai Based Pothhole Detection
        <span className="text-4xl ">
        </span>
      </div> */}
      <div className="container relative z-10 flex items-center px-6 py-32 mx-auto md:px-12 xl:py-40">
        <div className="relative z-10  lg:w-3/5 xl:w-2/5">
        <span className="mt-4 text-6xl font-bold leading-tight text-black sm:text-6xl ">
          Pothhole - Ai Based Pothhole Detection
        </span>
            {/* <span className="font-bold text-yellow-400 uppercase">
                Himalaya
            </span>
            <h1 className="mt-4 text-6xl font-bold leading-tight text-white sm:text-7xl">
                Let yourself be carried
                <br/>
                    by nature
            </h1> */}
            <div className=" py-12  ">

            <a href="/complaint"  className=" px-4 py-3 mt-10 text-lg font-bold text-gray-800 uppercase bg-white rounded-lg hover:bg-gray-500">
                New complaint
            </a>
            <a href="/status" className=" px-4 py-3 mt-10 text-lg font-bold text-gray-800 uppercase bg-white rounded-lg hover:bg-gray-500">
                Status
            </a>
            </div>
        </div>
    </div>
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
