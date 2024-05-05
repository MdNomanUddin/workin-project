import React from "react";
import Avatar from "./Avatar"; // Assuming Avatar component in a separate file
import { useNavigate} from "react-router-dom";
const navigate = useNavigate();

interface ProfileProps {
  userData: any; // Interface for user data props
}

const Profile: React.FC<ProfileProps> = ({ userData }) => {
  return (
    <div className="profile">
      <Avatar name={userData.name} />
      <p>Welcome, {userData.name}!</p>
      {/* Add other profile details based on your userData object */}
      <button onClick={() => {localStorage.removeItem("loggedIn");
    navigate("/login");}}>Logout</button>
    </div>
  );
};

export default Profile;
