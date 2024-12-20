import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddUser.css"; // Make sure to style the popup in this file
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";

function AddUser() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize formData with location state or default values
  const [formData, setFormData] = useState(() => {
    return (
      location?.state?.formData || {
        name: "",
        surname: "",
        username: "",
        email: "",
        role: "", // Additional field for user role
      }
    );
  });

  // Popup state
  const [showPopup, setShowPopup] = useState(false);

  // Generic handler for form state updates
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.surname ||
      !formData.username ||
      !formData.email ||
      !formData.role
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Show the confirmation popup
    setShowPopup(true);
  };

  const handleConfirm = () => {
    // Proceed with form submission (save data, navigate, etc.)
    console.log("Form Data confirmed:", formData);
    // Navigate or save data (e.g., API call)
    setShowPopup(false);
    // IMPLEMENT !!!!!!!!!
  };

  const handleBack = () => {
    // Close the popup and return to the form
    setShowPopup(false);
  };

  useEffect(() => {
    document.title = "Add User - Admin Panel"; // Set the tab title
  }, []);

  const roles = ["Guide", "Advisor", "Coordinator"];

  return (
    <div>
      <HeaderPanelGlobal name="ADMIN PANEL" />
      <div className="addUserPage">
        <div className="innerAddUserPage">
          <div className="userForm">
            <FormDropDownGlobal
              question="Role*"
              arr={roles}
              initialValue={formData.role}
              onChange={(value) => handleChange("role", value)}
            />
            <FormInputGlobal
              question="Name*"
              type="text"
              value={formData.name}
              onChange={(value) => handleChange("name", value)}
            />
            <FormInputGlobal
              question="Surname*"
              type="text"
              value={formData.surname}
              onChange={(value) => handleChange("surname", value)}
            />
            <FormInputGlobal
              question="Username*"
              type="text"
              value={formData.username}
              onChange={(value) => handleChange("username", value)}
            />
            <FormInputGlobal
              question="Email*"
              type="email"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
            />

            {/* Submit Button */}
            <button onClick={handleSubmit} className="submitButton">
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Popup for confirming user information */}
      {showPopup && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h2>Confirm User Information</h2>

            {/* Displaying form data in a table */}
            <table className="userInfoTable">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Name</strong>
                  </td>
                  <td>{formData.name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Surname</strong>
                  </td>
                  <td>{formData.surname}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Username</strong>
                  </td>
                  <td>{formData.username}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Email</strong>
                  </td>
                  <td>{formData.email}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Role</strong>
                  </td>
                  <td>{formData.role}</td>
                </tr>
              </tbody>
            </table>

            <div className="popupActions">
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  width: "100%",
                  maxWidth: "120px",
                  textAlign: "center",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                }}
                className="popupButton"
                onClick={handleConfirm}
              >
                Confirm
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "grey",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  width: "100%",
                  maxWidth: "120px",
                  textAlign: "center",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                }}
                className="popupButton"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddUser;
