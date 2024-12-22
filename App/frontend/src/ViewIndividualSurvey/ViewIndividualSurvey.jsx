import "../SchoolRegistrationPage/SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import FormTextAreaGlobal from "../GlobalClasses/FormTextAreaGlobal";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function ViewIndividualSurvey() {
  const [cities, setCities] = useState([]); // Dynamic cities list
  const [schools, setSchools] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null); // Timeout for debouncing
  const navigate = useNavigate();
  const [schoolQuery, setSchoolQuery] = useState(""); // Current school search query
  const location = useLocation();
  const [selectedCity, setSelectedCity] = useState(""); // Selected city

  // Initialize formData with location state or default values
  const [formData, setFormData] = useState(() => {
    return (
      location?.state?.formData || {
        name: "",
        surname: "",
        schoolName: "",
        cityName: "",
        guideRating: "",
        tourRating: "",
        universityRating: "",
        preferBilkent: "",
        comment: "",
      }
    );
  });

  // Handle form submission
  const handleSubmit = () => {
    console.log(formData);
    // Validate required fields
    if (
      !formData.name.trim() ||
      !formData.surname.trim() ||
      !formData.schoolName.trim() ||
      !formData.cityName.trim() ||
      !formData.guideRating ||
      !formData.tourRating ||
      !formData.universityRating ||
      !formData.preferBilkent
    ) {
      alert("Please fill in all the required fields.");
      return;
    }
    // Navigate to a new page with the form data
    navigate("/successIndividualSurvey", { state: { formData } });
  };

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

  useEffect(() => {
    document.title = "School Tour Registration - BTO";

    fetch("/api/Schools/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  // Handle change in the city dropdown
  const handleCityChange = (value) => {
    setSelectedCity(value);
    handleChange("schoolName", "");
    handleChange("cityName", value);
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
      fetchSchoolSuggestions(value, selectedCity);
    }, 300); // 300ms delay for debounce

    setTypingTimeout(timeout);
  };

  const handleSchoolChange = (selectedSchoolName) => {
    const selectedSchool = schools.find(
      (school) => school.name === selectedSchoolName
    );

    if (selectedSchool) {
      handleChange("schoolName", selectedSchool.name); // Save school name
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"INDIVIDUAL TOUR SURVEY"} />
      <div className="innerSchoolRegPage">
        <div className="schoolRegForm">
          {/* Name */}
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

          {/* City Dropdown */}
          <FormDropDownGlobal
            arr={cities} // Pass city names
            question="City*"
            onChange={handleCityChange} // Call to update both name and ID
            initialValue={formData.cityName}
          />

          {/* School Dropdown */}
          <FormDropDownGlobal
            arr={schools.map((school) => school.name)} // Pass school names
            question="School Name*"
            onChange={handleSchoolChange} // Call to update both name and ID
            initialValue={formData.schoolName}
            onInput={(e) => handleSchoolQueryChange(e.target.value)} // For search query
          />

          {/* Ratings */}
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

          {/* Comments */}
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

export default ViewIndividualSurvey;
