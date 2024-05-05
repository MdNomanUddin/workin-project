import React from "react";

interface AvatarProps {
  name: string; // User's name
  backgroundColor?: string; // Optional background color for initials
  textColor?: string; // Optional text color for initials
}

const Avatar: React.FC<AvatarProps> = ({ name, backgroundColor, textColor }) => {
  const initials = getInitials(name);

  function getInitials(name: string): string {
    const words = name.split(" ");
    return words.reduce((initials, word) => initials + word.charAt(0).toUpperCase(), "");
  }

  const style = {
    backgroundColor: backgroundColor || "#ccc", // Default background color
    color: textColor || "#fff", // Default text color
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
  };

  return (
    <div style={style}>
      {initials}
    </div>
  );
};

export default Avatar;
