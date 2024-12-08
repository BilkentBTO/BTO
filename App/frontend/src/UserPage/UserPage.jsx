import React, { useStat, useEffect } from "react";
import profileImage from "../assets/profile_image.png";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import "./UserPage.css";

function UserPage({ username }) {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("email@example.com"); // Only email is customizable

  const handleEdit = () => {
    setIsEditing(true); // Enter edit mode
  };

  const handleSave = () => {
    setIsEditing(false); // Exit edit mode
    console.log("Updated Email:", email); // Save the new email (can be sent to a server)
  };

  const handleCancel = () => {
    setIsEditing(false); // Exit edit mode without saving
  };
  useEffect(() => {
    document.title = "View Profile - BTO"; // Set the tab title
  }, []);
  return (
    <div>
      <HeaderPanelGlobal name={"Profile Page"} />
      <div className="profileSection">
        <img src={profileImage} alt="Profile" />
        <div className="infoLog">
          <div className="box">
            <p>Name:</p>
          </div>
          <div className="info">
            <p>Kerem</p>
          </div>
        </div>
        <div className="infoLog">
          <div className="box">
            <p>Surname:</p>
          </div>
          <div className="info">
            <p>Cindaruk</p>
          </div>
        </div>
        <div className="infoLog">
          <div className="box">
            <p>Username:</p>
          </div>
          <div className="info">
            <p>kcindaruk</p>
          </div>
        </div>
        <div className="infoLog">
          <div className="box">
            <p>Email:</p>
          </div>
          <div className="info">
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="emailEdit"
              />
            ) : (
              <p>{email}</p>
            )}
          </div>
        </div>
        {isEditing ? (
          <div className="buttonGroup">
            <button onClick={handleSave} className="saveButton">
              Save
            </button>
            <button onClick={handleCancel} className="cancelButton">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={handleEdit}>Change Email</button>
        )}
      </div>
    </div>
  );
}

export default UserPage;
