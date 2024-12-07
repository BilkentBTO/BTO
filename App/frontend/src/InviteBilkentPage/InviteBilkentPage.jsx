import "../SchoolRegistrationPage/SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import FormTextAreaGlobal from "../GlobalClasses/FormTextAreaGlobal";

function InviteBilkentPage() {
  const cities = ["Ankara", "İstanbul", "İzmir", "Bursa"];
  const schools = ["TED", "Nesibe", "Jale Tezer"];
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize formData with location state or default values
  const [formData, setFormData] = useState(() => {
    return (
      location?.state?.formData || {
        city: "",
        school: "",
        supervisorName: "",
        supervisorDuty: "",
        supervisorPhone: "",
        supervisorEmail: "",
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
      !formData.city ||
      !formData.school ||
      !formData.supervisorDuty ||
      !formData.supervisorEmail ||
      !formData.supervisorPhone ||
      !formData.supervisorName
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Log and navigate with form data
    console.log("Form Data:", formData);
    navigate("/fairConfirmation", { state: { formData } });
  };

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"INVITE BILKENT FOR SCHOOL FAIRS"} />
      <div className="innerSchoolRegPage">
        <div className="schoolRegForm">
          {/* City Dropdown */}
          <FormDropDownGlobal
            arr={cities}
            question="City*"
            onChange={(value) => handleChange("city", value)}
            initialValue={formData.city}
          />

          {/* School Dropdown */}
          <FormDropDownGlobal
            arr={schools}
            question="School Name*"
            onChange={(value) => handleChange("school", value)}
            initialValue={formData.school}
          />

          {/* Preferred Time Dropdown */}
          <FormInputGlobal
            question="Supervisor Name*"
            type="text"
            value={formData.supervisorName}
            onChange={(value) => handleChange("supervisorName", value)}
          />
          <FormInputGlobal
            question="Supervisor Duty*"
            type="text"
            value={formData.supervisorDuty}
            onChange={(value) => handleChange("supervisorDuty", value)}
          />
          <FormInputGlobal
            question="Supervisor Cell Phone*"
            type="tel"
            value={formData.supervisorPhone}
            onChange={(value) => handleChange("supervisorPhone", value)}
          />
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

export default InviteBilkentPage;
