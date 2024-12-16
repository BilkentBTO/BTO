import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddCoordinatorPage.css"; // Create this CSS file for custom styles
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";

function AddCoordinator() {
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
      !formData.email
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Log and navigate with form data
    console.log("Form Data:", formData);
    navigate("/adminPanel/addCoordinatorConfirmation", { state: { formData } });
  };

  useEffect(() => {
    document.title = "Add Coordinator - Admin Panel"; // Set the tab title
  }, []);

  return (
    <div className="addCoordinatorPage">
      <HeaderPanelGlobal name="ADMIN PANEL" />
      <div className="innerAddCoordinatorPage">
        <div className="coordinatorForm">
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
            Add Coordinator
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCoordinator;
