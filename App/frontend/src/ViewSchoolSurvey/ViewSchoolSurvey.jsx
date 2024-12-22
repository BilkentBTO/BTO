import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import FormTextAreaGlobal from "../GlobalClasses/FormTextAreaGlobal";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function ViewSchoolSurvey() {
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
        name: "",
        surname: "",
        guideRating: "",
        tourRating: "",
        universityRating: "",
        preferBilkent: "",
        comment: "",
      }
    );
  });

  const today = new Date().toISOString().split("T")[0];
  const dateFilter = {
    min: today, // Disable past dates
  };

  // Fetch Cities on Component Mount
  useEffect(() => {
    document.title = "View School Survey";

    fetch("/api/Schools/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

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
    if (key === "visitDate" && isWeekend(value)) {
      return; // Stop updating the state for invalid date
    }
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
      !formData.name ||
      !formData.surname ||
      !formData.guideRating ||
      !formData.tourRating ||
      !formData.universityRating ||
      !formData.preferBilkent
    ) {
      alert("Please fill in all the required fields.");
      return;
    }
    // IMPLEMENT LATER !!!!!!!!!!!!!!!!
    navigate("/successSchoolSurvey");
  };

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"SCHOOL TOUR SURVEY"} />
      <div className="schoolRegContainer"></div>
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

          <FormDropDownGlobal
            arr={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
            question="Rate guide out of 10*"
            onChange={(value) => handleChange("guideRating", value)}
            initialValue={formData.guideRating}
          />

          <FormDropDownGlobal
            arr={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
            question="Rate tour out of 10*"
            onChange={(value) => handleChange("tourRating", value)}
            initialValue={formData.tourRating}
          />

          <FormDropDownGlobal
            arr={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
            question="Rate Bilkent out of 10*"
            onChange={(value) => handleChange("universityRating", value)}
            initialValue={formData.universityRating}
          />

          <FormDropDownGlobal
            arr={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
            question="Would you apply to Bilkent? (Out of 10)*"
            onChange={(value) => handleChange("preferBilkent", value)}
            initialValue={formData.preferBilkent}
          />

          {/* Notes */}
          <FormTextAreaGlobal
            question="Comments"
            value={formData.comment}
            onChange={(value) => handleChange("comment", value)}
          />
        </div>
      </div>
      <button onClick={handleSubmit} className="submitButton">
        Send
      </button>
    </div>
  );
}

export default ViewSchoolSurvey;
