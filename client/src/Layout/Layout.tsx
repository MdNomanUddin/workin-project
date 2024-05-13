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