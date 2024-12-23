import "../SchoolRegistrationPage/SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import FormTextAreaGlobal from "../GlobalClasses/FormTextAreaGlobal";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function InviteBilkentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date().toISOString().split("T")[0];
  const dateFilter = {
    min: today, // Disable past dates
  };
  const dateLimit = new Date("9999-12-31T22:59:59.000Z");

  // Dynamic dropdown states
  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [schoolQuery, setSchoolQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Initialize formData with location state or default values
  const [formData, setFormData] = useState(() => {
    return (
      location?.state?.formData || {
        cityName: "",
        schoolCode: "", // Ensure this is matched with the API schema
        dateOfVisit: "", // Ensure a valid ISO string format
        superVisorName: "",
        superVisorDuty: "",
        superVisorPhoneNumber: "",
        superVisorMailAddress: "",
        notes: "",
      }
    );
  });

  useEffect(() => {
    document.title = "Invite Bilkent - BTO";

    // Fetch cities dynamically on component mount
    fetch("/api/Schools/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  // Fetch Schools Dynamically as User Types
  const fetchSchoolSuggestions = (query, city) => {
    if (!query || !city) {
      setSchools([]);
      return;
    }

    fetch(
      `/api/Schools/autocompleteWithFilter?query=${encodeURIComponent(
        query
      )}&cityName=${encodeURIComponent(city)}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSchools(
          data.map((school) => ({
            name: school.schoolName,
            code: school.schoolCode,
          }))
        );
      })
      .catch((error) =>
        console.error("Error fetching school suggestions:", error)
      );
  };

  // Handle City Selection
  const handleCityChange = (value) => {
    setSelectedCity(value);
    setFormData((prev) => ({
      ...prev,
      cityName: value,
      schoolCode: "",
      school: "",
    }));
    setSchools([]); // Reset school suggestions on city change
    setSchoolQuery("");
  };

  // Handle School Selection
  const handleSchoolChange = (value) => {
    const selectedSchool = schools.find((school) => school.name === value);

    if (selectedSchool) {
      setFormData((prev) => ({
        ...prev,
        schoolCode: selectedSchool.code,
      }));
    }
  };

  // Handle School Query Input with Debouncing
  const handleSchoolQueryChange = (value) => {
    setSchoolQuery(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      fetchSchoolSuggestions(value, selectedCity);
    }, 300); // 300ms debounce

    setTypingTimeout(timeout);
  };

  // Generic handler for form state updates
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Validate form data and match API schema
  const validateAndSubmit = () => {
    if (
      !formData.cityName ||
      !formData.schoolCode ||
      !formData.dateOfVisit ||
      !formData.superVisorName ||
      !formData.superVisorDuty ||
      !formData.superVisorPhoneNumber ||
      !formData.superVisorMailAddress
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.superVisorMailAddress)) {
      alert("Please enter a valid email address.");
      return;
    }

    const requestedDate = new Date(formData.dateOfVisit);
    const today = Date.now();
    // Block past and too distant dates
    if (requestedDate < today || !requestedDate.valueOf() || requestedDate > dateLimit) {
      alert("Please enter a valid date.");
      return;
    }

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
            onChange={handleCityChange}
            initialValue={formData.cityName}
          />

          {/* School Dropdown */}
          <FormDropDownGlobal
            arr={schools.map((school) => school.name)}
            question="School Name*"
            onChange={handleSchoolChange}
            initialValue={formData.school}
            onInput={(e) => handleSchoolQueryChange(e.target.value)}
          />

          {/* Date of Visit */}
          <FormInputGlobal
            question="Date of Visit*"
            type="date"
            value={formData.dateOfVisit}
            onChange={(value) => handleChange("dateOfVisit", value)}
            dateFilter={dateFilter}
          />

          {/* Supervisor Information */}
          <FormInputGlobal
            question="Supervisor Name*"
            type="text"
            value={formData.superVisorName}
            onChange={(value) => handleChange("superVisorName", value)}
          />
          <FormInputGlobal
            question="Supervisor Duty*"
            type="text"
            value={formData.superVisorDuty}
            onChange={(value) => handleChange("superVisorDuty", value)}
          />
          <FormInputGlobal
            question="Supervisor Cell Phone*"
            type="tel"
            value={formData.superVisorPhoneNumber}
            onChange={(value) => handleChange("superVisorPhoneNumber", value)}
          />
          <FormInputGlobal
            question="Supervisor E-Mail*"
            type="email"
            value={formData.superVisorMailAddress}
            onChange={(value) => handleChange("superVisorMailAddress", value)}
          />

          {/* Notes */}
          <FormTextAreaGlobal
            question="Notes"
            value={formData.notes}
            onChange={(value) => handleChange("notes", value)}
          />
        </div>
        <button onClick={validateAndSubmit} className="submitButton">
          Submit
        </button>
      </div>
    </div>
  );
}

export default InviteBilkentPage;
