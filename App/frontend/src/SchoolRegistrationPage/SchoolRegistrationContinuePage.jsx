import React from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import { useLocation, useNavigate } from "react-router-dom";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormTextAreaGlobal from "../GlobalClasses/FormTextAreaGlobal";

function SchoolRegistrationContinuePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize formData with all fields
  const initialFormData = location.state || {};

  const [formData, setFormData] = React.useState({
    city: initialFormData?.city || "",
    school: initialFormData?.school || "",
    visitDate: initialFormData?.visitDate || "",
    visitTime: initialFormData?.visitTime || "",
    visitorCount: initialFormData?.visitorCount || "",
    supervisorName: initialFormData?.supervisorName || "",
    supervisorDuty: initialFormData?.supervisorDuty || "",
    supervisorPhone: initialFormData?.supervisorPhone || "",
    supervisorEmail: initialFormData?.supervisorEmail || "",
    notes: initialFormData?.notes || "",
  });
  console.log("initial", initialFormData);

  // Handle input changes
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev, // Retain all previous fields
      [key]: value, // Update only the specific key
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (
      !formData.supervisorName ||
      !formData.supervisorDuty ||
      !formData.supervisorPhone ||
      !formData.supervisorEmail
    ) {
      alert("Please fill in all the required fields.");
      return;
    }
    console.log("Final Form Data:", formData); // Debugging log
    navigate("/schoolConfirmation", { state: { formData } }); // Pass updated formData to next page
  };

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"SCHOOL REGISTRATION FORM"} />
      <div className="innerSchoolRegPage">
        <div className="schoolRegForm">
          {/* Supervisor Name */}
          <FormInputGlobal
            question={"Supervisor Name*"}
            type="text"
            value={formData.supervisorName || ""}
            onChange={(e) => handleChange("supervisorName", e.target.value)}
          />

          {/* Supervisor Duty */}
          <FormInputGlobal
            question="Supervisor Duty*"
            type="text"
            value={formData.supervisorDuty || ""}
            onChange={(e) => handleChange("supervisorDuty", e.target.value)}
          />

          {/* Supervisor Phone */}
          <FormInputGlobal
            question="Supervisor Cell Phone*"
            type="tel"
            value={formData.supervisorPhone || ""}
            onChange={(e) => handleChange("supervisorPhone", e.target.value)}
          />

          {/* Supervisor Email */}
          <FormInputGlobal
            question="Supervisor E-Mail*"
            type="email"
            value={formData.supervisorEmail || ""}
            onChange={(e) => handleChange("supervisorEmail", e.target.value)}
          />

          {/* Notes */}
          <FormTextAreaGlobal
            value={formData.notes || ""}
            onChange={(value) => handleChange("notes", value)}
          />

          {/* Submit Button */}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default SchoolRegistrationContinuePage;
