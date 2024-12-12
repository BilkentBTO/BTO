import "./SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function SchoolRegistrationPage() {
  const cities = ["Ankara", "İstanbul", "İzmir", "Bursa"];
  const schools = ["TED", "Nesibe", "Jale Tezer"];
  const visitTimes = ["09.00", "11.00", "13.00", "16.00"];
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize formData with location state or default values
  const [formData, setFormData] = useState(() => {
    return (
      location?.state?.formData || {
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
      }
    );
  });
  const today = new Date().toISOString().split("T")[0];
  const dateFilter = {
    min: today, // Disable past dates
  };
  useEffect(() => {
    document.title = "School Tour Registration - BTO"; // Set the tab title
  }, []);
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
      !formData.visitDate ||
      !formData.visitTime ||
      !formData.visitorCount
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Log and navigate with form data
    console.log("Form Data:", formData);
    navigate("/continueSchoolReg", { state: { formData } });
  };

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"SCHOOL REGISTRATION FORM"} />
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

          {/* Visit Date Input */}
          <FormInputGlobal
            question="Date of visit*"
            type="date"
            value={formData.visitDate}
            onChange={(value) => handleChange("visitDate", value)}
            dateFilter={dateFilter}
          />

          {/* Preferred Time Dropdown */}
          <FormDropDownGlobal
            arr={visitTimes}
            question="Preferred Time of Visit*"
            onChange={(value) => handleChange("visitTime", value)}
            initialValue={formData.visitTime}
          />

          {/* Number of Visitors Input */}
          <FormInputGlobal
            question="Number of Visitors*"
            type="number"
            value={formData.visitorCount}
            onChange={(value) => handleChange("visitorCount", value)}
          />

          {/* Submit Button */}
          <button onClick={handleSubmit} className="submitButton">
            Continue
          </button>
        </div>

        <div className="contactSection">
          <p className="contactInfo"></p>
        </div>
      </div>
    </div>
  );
}

export default SchoolRegistrationPage;
