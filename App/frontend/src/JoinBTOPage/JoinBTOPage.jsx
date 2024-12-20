import "../SchoolRegistrationPage/SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function JoinBTOPage() {
  const [majors, setMajors] = useState([]);
  const years = ["1", "2", "3", "4"];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Join BTO - BTO";

    // Fetch majors from API
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

  const [formData, setFormData] = useState(() => {
    return (
      location?.state?.formData || {
        name: "",
        surname: "",
        bilkentID: "",
        major: "",
        majorCode: "",
        currentYear: "",
        mail: "",
      }
    );
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.surname ||
      !formData.bilkentID ||
      !formData.majorCode ||
      !formData.currentYear ||
      !formData.mail
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    console.log("Form Data to Confirm:", formData); // Log to check formData before navigating

    // Navigate to the confirmation page with formData
    navigate("/joinConfirmation", { state: { formData } });
  };

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"JOIN BTO"} />
      <div className="innerSchoolRegPage">
        <div className="schoolRegForm">
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
            question="Bilkent ID*"
            type="number"
            value={formData.bilkentID}
            onChange={(value) => handleChange("bilkentID", value)}
          />
          <FormDropDownGlobal
            arr={majors.map((major) => major.name)}
            question="Major*"
            onChange={(value) => {
              const selectedMajor = majors.find(
                (major) => major.name === value
              );
              handleChange("major", selectedMajor.name);
              handleChange("majorCode", selectedMajor?.id);
            }}
            initialValue={formData.major}
          />
          <FormDropDownGlobal
            arr={years}
            question="Current Year*"
            onChange={(value) =>
              handleChange("currentYear", parseInt(value, 10))
            }
            initialValue={formData.currentYear}
          />
          <FormInputGlobal
            question="Email*"
            type="email"
            value={formData.mail}
            onChange={(value) => handleChange("mail", value)}
          />
        </div>
      </div>
      <button onClick={handleSubmit} className="submitButton">
        Submit
      </button>
    </div>
  );
}

export default JoinBTOPage;
