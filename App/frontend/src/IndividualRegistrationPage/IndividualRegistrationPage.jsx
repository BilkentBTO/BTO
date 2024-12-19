import "../SchoolRegistrationPage/SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import FormTextAreaGlobal from "../GlobalClasses/FormTextAreaGlobal";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

function IndividualRegistrationPage() {
  const majors = ["CS", "POLS", "EE", "IE"];
  const schools = ["TED", "Nesibe", "Jale Tezer"];
  const visitTimes = ["09.00", "11.00", "13.00", "16.00"];
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize formData with location state or default values
  const [formData, setFormData] = useState(() => {
    return (
      location?.state?.formData || {
        name: "",
        surname: "",
        visitDate: "",
        visitTime: "",
        major: "",
        notes: "",
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
      !formData.visitDate ||
      !formData.visitTime ||
      !formData.major
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Log and navigate with form data
    console.log("Form Data:", formData);
    navigate("/individualConfirmation", { state: { formData } });
  };
  useEffect(() => {
    document.title = "Individual Tour Registration - BTO"; // Set the tab title
  }, []);

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"INDIVIDUAL REGISTRATION FORM"} />
      <div className="innerSchoolRegPage">
        <div className="schoolRegForm">
          {/* City Dropdown */}
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
            question="Date of visit*"
            type="date"
            value={formData.visitDate}
            onChange={(value) => handleChange("visitDate", value)}
          />

          <FormDropDownGlobal
            arr={visitTimes}
            question="Preferred Time of Visit*"
            onChange={(value) => handleChange("visitTime", value)}
            initialValue={formData.visitTime}
          />

          <FormDropDownGlobal
            arr={majors}
            question="Preferred Major**"
            onChange={(value) => handleChange("major", value)}
            initialValue={formData.major}
          />
          <FormTextAreaGlobal
            question="Notes"
            value={formData.notes}
            onChange={(value) => handleChange("notes", value)}
          />
        </div>
      </div>
      <button onClick={handleSubmit} className="submitButton">
        Continue
      </button>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}

export default IndividualRegistrationPage;
