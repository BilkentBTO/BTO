import React, { useState } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import { useLocation, useNavigate } from "react-router-dom";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormTextAreaGlobal from "../GlobalClasses/FormTextAreaGlobal";

function SchoolRegistrationContinuePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract initial form data from location.state or provide defaults
  const initialFormData = location?.state?.formData || {
    city: "",
    school: "",
    visitDate: "",
    visitTime: "",
    visitorCount: "",
    supervisorName: "",
    supervisorDuty: "",
    supervisorPhone: "",
    supervisorEmail: "",
    notes: "",
  };

  // Initialize formData state
  const [formData, setFormData] = useState(initialFormData);

  // Generic handler for updating form state
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
      !formData.supervisorName ||
      !formData.supervisorDuty ||
      !formData.supervisorPhone ||
      !formData.supervisorEmail
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Debugging log
    console.log("Final Form Data:", formData);

    // Navigate to confirmation page with updated formData
    navigate("/schoolConfirmation", { state: { formData } });
  };

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name="SCHOOL REGISTRATION FORM" />
      <div className="innerSchoolRegPage">
        <div className="schoolRegForm">
          {/* Supervisor Name */}
          <FormInputGlobal
            question="Supervisor Name*"
            type="text"
            value={formData.supervisorName}
            onChange={(value) => handleChange("supervisorName", value)}
          />

          {/* Supervisor Duty */}
          <FormInputGlobal
            question="Supervisor Duty*"
            type="text"
            value={formData.supervisorDuty}
            onChange={(value) => handleChange("supervisorDuty", value)}
          />

          {/* Supervisor Phone */}
          <FormInputGlobal
            question="Supervisor Cell Phone*"
            type="tel"
            value={formData.supervisorPhone}
            onChange={(value) => handleChange("supervisorPhone", value)}
          />

          {/* Supervisor Email */}
          <FormInputGlobal
            question="Supervisor E-Mail*"
            type="email"
            value={formData.supervisorEmail}
            onChange={(value) => handleChange("supervisorEmail", value)}
          />

          {/* Notes */}
          <FormTextAreaGlobal
            question="Notes"
            value={formData.notes}
            onChange={(value) => handleChange("notes", value)}
          />

          {/* Submit Button */}
          <button onClick={handleSubmit} className="submitButton">
            Submit
          </button>
        </div>
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}

export default SchoolRegistrationContinuePage;
