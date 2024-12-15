import "./SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function SchoolRegistrationPage() {
  const [cities, setCities] = useState([]); // Dynamic cities list
  const [schools, setSchools] = useState([]); // Dynamic school list
  const [selectedCity, setSelectedCity] = useState(""); // Selected city
  const [schoolQuery, setSchoolQuery] = useState(""); // Current school search query
  const [typingTimeout, setTypingTimeout] = useState(null); // Timeout for debouncing
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize formData
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

  // Fetch Cities on Component Mount
  useEffect(() => {
    document.title = "School Tour Registration - BTO";

    fetch("/api/Schools/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  // Fetch Schools Dynamically as User Types
  const fetchSchoolSuggestions = (query, city) => {
    if (!query || !city) {
      console.log("Missing query or city:", { query, city });
      setSchools([]); // Clear suggestions if input or city is missing
      return;
    }
  
    fetch(`/api/Schools/autocompleteWithFilter?query=${encodeURIComponent(query)}&cityName=${encodeURIComponent(city)}`)
      .then((response) => {
        console.log("API Response Status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("API Response Data:", data);
        setSchools(data); // Update school suggestions
      })
      .catch((error) => {
        console.error("Error fetching school suggestions:", error);
      });
  };

  // Handle change in the city dropdown
  const handleCityChange = (value) => {
    setSelectedCity(value);
    handleChange("city", value);
    setSchools([]); // Reset schools when city changes
    setSchoolQuery(""); // Reset query as well
  };

  // Handle query input with debouncing
  const handleSchoolQueryChange = (value) => {
    setSchoolQuery(value);
    handleChange("school", value);

    // Debounce API call
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      fetchSchoolSuggestions(value, selectedCity);
    }, 300); // 300ms delay for debounce

    setTypingTimeout(timeout);
  };

  // Generic handler for form state updates
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
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
            onChange={handleCityChange}
            initialValue={formData.city}
          />

          {/* School Dropdown */}
          <FormDropDownGlobal
            arr={schools}
            question="School Name*"
            onChange={(value) => handleChange("school", value)}
            initialValue={formData.school}
            onInput={(e) => {
              handleSchoolQueryChange(e.target.value);
            }}
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
            arr={["09.00", "11.00", "13.00", "16.00"]}
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
      </div>
    </div>
  );
}

export default SchoolRegistrationPage;