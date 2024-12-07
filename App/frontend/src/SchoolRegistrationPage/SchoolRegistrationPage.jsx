import "./SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import ButtonHeaderGlobal from "../GlobalClasses/ButtonHeaderGlobal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SchoolRegistrationPage() {
  const cities = ["Ankara", "İstanbul", "İzmir", "Bursa"];
  const schools = ["TED", "Nesibe", "Jale Tezer"];
  const arrayOfOptions = ["09.00", "11.00", "13.00", "16.00"];
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
  });

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
    console.log(formData);
    navigate("/continueSchoolReg", { state: formData });
  };

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"SCHOOL REGISTRATION FORM"} />
      <div className="innerSchoolRegPage">
        <div className="schoolRegForm">
          <FormDropDownGlobal
            arr={cities}
            question={"City*"}
            onChange={(value) => handleChange("city", value)} // Fix: Update city
          />
          <FormDropDownGlobal
            arr={schools}
            question={"School Name*"}
            onChange={(value) => handleChange("school", value)} // Fix: Update school
          />
          <FormInputGlobal
            question="Date of visit*"
            type="date"
            onChange={(e) => handleChange("visitDate", e.target.value)} // Fix: Update visitDate
          />
          <FormDropDownGlobal
            arr={arrayOfOptions}
            question={"Preferred Time of Visit*"}
            onChange={(value) => handleChange("visitTime", value)} // Fix: Update visitTime
          />
          <FormInputGlobal
            question="Number of Visitor:"
            type="number"
            onChange={(e) => handleChange("visitorCount", e.target.value)} // Fix: Update visitorCount
          />
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
