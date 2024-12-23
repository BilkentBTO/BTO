import "../SchoolRegistrationPage/SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import FormTextAreaGlobal from "../GlobalClasses/FormTextAreaGlobal";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

function IndividualRegistrationPage() {
  const schools = ["TED", "Nesibe", "Jale Tezer"];
  const visitTimes = ["09:00", "11:00", "13:00", "16:00"];
  const navigate = useNavigate();
  const location = useLocation();
  const [majors, setMajors] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const dateFilter = {
    min: today, // Disable past dates
  };
  const dateLimit = new Date("9999-12-31T22:59:59.000Z");

  // Initialize formData with location state or default values
  const [formData, setFormData] = useState(() => {
    return (
      location?.state?.formData || {
        name: "",
        surname: "",
        visitDate: "",
        visitTime: "",
        individualMajor: "",
        individualMajorCode: "",
        individualPhoneNumber: "",
        individualMailAddress: "",
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

  const isWeekend = (date) => {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday (0) and Saturday (6)
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.surname ||
      !formData.visitDate ||
      !formData.visitTime ||
      !formData.individualMajor ||
      !formData.individualMajorCode ||
      !formData.individualPhoneNumber ||
      !formData.individualMailAddress
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.individualMailAddress)) {
      alert("Please enter a valid email address.");
      return;
    }
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.individualPhoneNumber)) {
      alert("Phone number must be exactly 11 digits and contain no letters.");
      return;
    }

    const requestedDate = new Date(formData.visitDate);
    const today = Date.now();

    // Block selection of weekends
    if (isWeekend(requestedDate)) {
      alert("Weekends are not allowed.");
      return;
    }

    // Block past dates
    if (requestedDate < today || requestedDate > dateLimit) {
      alert("Please enter a valid date.");
      return;
    }

    // Log and navigate with form data
    console.log("Form Data:", formData);
    navigate("/individualConfirmation", { state: { formData } });
  };
  useEffect(() => {
    document.title = "Individual Tour Registration - BTO"; // Set the tab title

    const fetchMajors = async () => {
      try {
        const response = await fetch("/api/user/majors");
        if (!response.ok) throw new Error("Failed to fetch majors");

        const data = await response.json();
        const majorOptions = data.map((major) => ({
          id: major.id,
          name: major.name,
        }));
        setMajors(majorOptions);
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    fetchMajors();
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
            dateFilter={dateFilter}
          />

          <FormDropDownGlobal
            arr={visitTimes}
            question="Preferred Time of Visit*"
            onChange={(value) => handleChange("visitTime", value)}
            initialValue={formData.visitTime}
          />

          <FormDropDownGlobal
            arr={majors.map((major) => major.name)}
            question="Major*"
            onChange={(value) => {
              const selectedMajor = majors.find(
                (major) => major.name === value
              );
              handleChange("individualMajor", selectedMajor.name);
              handleChange("individualMajorCode", selectedMajor?.id);
            }}
            initialValue={formData.individualMajor}
          />

          <FormInputGlobal
            question="Phone Number*"
            type="tel"
            value={formData.individualPhoneNumber}
            onChange={(value) => handleChange("individualPhoneNumber", value)}
          />

          <FormInputGlobal
            question="Mail Address*"
            type="email"
            value={formData.individualMailAddress}
            onChange={(value) => handleChange("individualMailAddress", value)}
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
    </div>
  );
}

export default IndividualRegistrationPage;
