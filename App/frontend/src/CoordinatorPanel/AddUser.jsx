import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddUser.css"; // Create this CSS file for styles
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

    // Log and navigate with form data
    console.log("Form Data:", formData);
    navigate("/coordinatorPanel/addUserConfirmation", { state: { formData } });
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
    </div>
  );
}

export default AddUser;
