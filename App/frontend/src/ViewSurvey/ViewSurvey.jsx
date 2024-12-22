import "../SchoolRegistrationPage/SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import FormTextAreaGlobal from "../GlobalClasses/FormTextAreaGlobal";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function ViewSurvey() {
  const navigate = useNavigate();
  const location = useLocation();

  const surveyCode = location.state?.surveyCode || {};
  // Initialize formData with location state or default values
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

  // Handle form submission
  const handleSubmit = async () => {
    console.log(formData);
    // Validate required fields
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

    const payload = {
      name: formData.name,
      surname: formData.surname,
      rateGuide: formData.guideRating,
      rateTour: formData.tourRating,
      rateBilkent: formData.universityRating,
      applyToBilkent: formData.preferBilkent,
      comments: formData.comment,
    };

    try {
      console.log("Payload being sent: ", JSON.stringify(payload));
      const response = await fetch(`api/quiz/fill/${surveyCode}`, {
        //CHANGE
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send fixed payload
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.title || "Failed to register user.");
      }

      // Navigate to success page
      console.log("Registration successful");
      navigate("/successViewSurvey", { state: { formData } });
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Survey failed: ${error.message}`);
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
      <HeaderGlobal name={"TOUR SURVEY"} />
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

export default ViewSurvey;
