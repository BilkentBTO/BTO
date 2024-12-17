import React, { useState } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import { useLocation, useNavigate } from "react-router-dom";
import "./ConfirmAddUser.css"; // Create or reuse a similar CSS file

function ConfirmAddUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  // Retrieve the formData passed from the AddUser page
  const formData = location.state?.formData || {};
  console.log("FORM RECEIVED: ", formData);

  // Navigate back to the AddUser form for edits
  const handleEdit = () => {
    navigate("/coordinatorPanel/addUser", { state: { formData } });
  };

  // Function to handle the final confirmation
  const confirmAdd = () => {
    console.log("User Confirmed:", formData);

    // Navigate to a success page or perform additional actions
    navigate("/coordinatorPanel/successAddUser", { state: { formData } });
  };

  // Function to open and close the popup
  const handleConfirmClick = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  return (
    <div className="confirmAddUserPage">
      <HeaderGlobal name="User Confirmation Page" />
      <div className="innerUserConfirmation">
        <div className="topInner">
          <div className="leftInner">
            {/* User Details */}
            <div className="infoLog">
              <div className="box">
                <p>Role:</p>
              </div>
              <div className="info">
                <p>{formData.role}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Name:</p>
              </div>
              <div className="info">
                <p>{formData.name}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Surname:</p>
              </div>
              <div className="info">
                <p>{formData.surname}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Username:</p>
              </div>
              <div className="info">
                <p>{formData.username}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Email:</p>
              </div>
              <div className="info">
                <p>{formData.email}</p>
              </div>
            </div>
          </div>

          <div className="buttonLayout">
            <button onClick={handleEdit} className="editButton">
              Edit
            </button>
            <button onClick={handleConfirmClick} className="confirmButton">
              Confirm
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h2>Confirm User Addition</h2>
            <p>Are you sure you want to add this user?</p>
            <div className="popupActions">
              <button onClick={confirmAdd} className="confirmButton">
                Yes, Confirm
              </button>
              <button onClick={closePopup} className="cancelButton">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmAddUser;
