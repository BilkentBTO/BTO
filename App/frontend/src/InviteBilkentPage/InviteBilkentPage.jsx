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

  // Dynamic dropdown states
  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [schoolQuery, setSchoolQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    document.title = "Invite Bilkent - BTO";

    // Fetch cities dynamically on component mount
    fetch("/api/Schools/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

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
        const schoolNames = data.map((school) => school.schoolName); // Extract school names
        setSchools(schoolNames); // Set only names
      })
      .catch((error) =>
        console.error("Error fetching school suggestions:", error)
      );
  };

  // Handle City Selection
  const handleCityChange = (value) => {
    setSelectedCity(value);
    setFormData((prev) => ({ ...prev, city: value }));
    setSchools([]); // Reset school suggestions on city change
    setSchoolQuery("");
  };

  // Handle School Query Input with Debouncing
  const handleSchoolQueryChange = (value) => {
    setSchoolQuery(value);
    setFormData((prev) => ({ ...prev, school: value }));

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

  // Handle form submission
  const handleSubmit = () => {
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
            initialValue={formData.city}
          />

          {/* School Dropdown */}
          <FormDropDownGlobal
            arr={schools}
            question="School Name*"
            onChange={(value) => handleChange("school", value)}
            initialValue={formData.school}
            onInput={(e) => handleSchoolQueryChange(e.target.value)}
          />

          {/* Supervisor Information */}
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
