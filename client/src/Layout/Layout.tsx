//== layout working fine and without user profile option
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
          <a href="/complaint">Report Pothole</a>
          <a href="MyComplaints"> My Complaints</a>
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