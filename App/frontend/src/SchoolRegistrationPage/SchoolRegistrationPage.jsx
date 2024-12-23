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
        schoolID: "",
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
  const dateLimit = new Date("9999-12-31T22:59:59.000Z");

  // Fetch Cities on Component Mount
  useEffect(() => {
    document.title = "School Tour Registration - BTO";

    fetch("/api/Schools/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const convertTimeToUTC = (dateString, timeString) => {
    if (!dateString || !timeString) return null;
    const combinedDateTime = `${dateString}T${timeString}:00Z`;
    const parsedDateTime = new Date(combinedDateTime);
    return parsedDateTime.valueOf() ? parsedDateTime.toISOString() : null;
  };

  // Fetch Schools Dynamically as User Types
  const fetchSchoolSuggestions = (query, city) => {
    if (!query || !city) {
      setSchools([]); // Clear suggestions if input or city is missing
      return;
    }

    fetch(
      `/api/Schools/autocompleteWithFilter?query=${encodeURIComponent(
        query
      )}&cityName=${encodeURIComponent(city)}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response Data:", data);

        // Map both schoolName and schoolCode into objects
        const schoolData = data.map((school) => ({
          name: school.schoolName,
          id: school.schoolCode,
        }));

        setSchools(schoolData);
      })
      .catch((error) => {
        console.error("Error fetching school suggestions:", error);
      });
  };

  // Handle change in the city dropdown
  const handleCityChange = (value) => {
    setSelectedCity(value);
    handleChange("school", "");
    handleChange("city", value);
    setSchools([]); // Reset schools when city changes
    setSchoolQuery(""); // Reset query as well
  };

  // Handle query input with debouncing
  const handleSchoolQueryChange = (value) => {
    setSchoolQuery(value);
    console.log(schoolQuery);

    // Debounce API call
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      fetchSchoolSuggestions(value, formData.city);
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
  const handleSchoolChange = (selectedSchoolName) => {
    const selectedSchool = schools.find(
      (school) => school.name === selectedSchoolName
    );

    if (selectedSchool) {
      handleChange("school", selectedSchool.name); // Save school name
      handleChange("schoolID", selectedSchool.id); // Save school ID
    }
  };

  const isWeekend = (date) => {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday (0) and Saturday (6)
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

    const startTimeUTC = convertTimeToUTC(
      formData.visitDate,
      formData.visitTime
    );
    if (!startTimeUTC) {
      alert("Invalid visit time.");
      return;
    }

    // Check for int limit :)
    if (formData.visitorCount > 2147483647) {
      alert("You've exceeded the visitor capacity.");
      return;
    }

    if (!Number.isInteger(formData.visitorCount * 1)) {
      alert("Please check the number of visitors.");
      return;
    }

    navigate("/continueSchoolReg", { state: { formData } });
  };
  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"SCHOOL REGISTRATION FORM"} />
      <div className="schoolRegContainer"></div>
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
            arr={schools.map((school) => school.name)} // Pass school names
            question="School Name*"
            onChange={handleSchoolChange} // Call to update both name and ID
            initialValue={formData.school}
            onInput={(e) => handleSchoolQueryChange(e.target.value)} // For search query
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
            arr={["09:00", "11:00", "13:00", "16:00"]}
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
            properities={{isPos:true}}
          />
        </div>
      </div>
      <button onClick={handleSubmit} className="submitButton">
        Continue
      </button>
    </div>
  );
}

export default SchoolRegistrationPage;
