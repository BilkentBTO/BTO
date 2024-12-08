import "../SchoolRegistrationPage/SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

function JoinBTOPage() {
  const majors = ["CS", "POLS", "EE", "IE"];
  const years = ["1. Year", "2. Year", "3. Year", "4. Year"];
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    document.title = "Join BTO - BTO"; // Set the tab title
  }, []);

  // Initialize formData with location state or default values
  const [formData, setFormData] = useState(() => {
    return (
      location?.state?.formData || {
        name: "",
        surname: "",
        id: "",
        major: "",
        year: "",
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
      !formData.id ||
      !formData.major ||
      !formData.year
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Log and navigate with form data
    console.log("Form Data:", formData);
    navigate("/joinConfirmation", { state: { formData } });
  };

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"JOIN BTO"} />
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
            question="Bilkent ID*"
            type="text"
            value={formData.id}
            onChange={(value) => handleChange("id", value)}
          />
          <FormDropDownGlobal
            arr={majors}
            question="Major*"
            onChange={(value) => handleChange("major", value)}
            initialValue={formData.major}
          />

          {/* Preferred Time Dropdown */}
          <FormDropDownGlobal
            arr={years}
            question="Current Year*"
            onChange={(value) => handleChange("year", value)}
            initialValue={formData.year}
          />

          <button onClick={handleSubmit} className="submitButton">
            Submit
          </button>
        </div>

        <div className="contactSection">
          <p className="contactInfo"></p>
        </div>
      </div>
    </div>
  );
}

export default JoinBTOPage;
