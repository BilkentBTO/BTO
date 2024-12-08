import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import ButtonHeaderGlobal from "../GlobalClasses/ButtonHeaderGlobal";
import "./ViewRegistrationPage.css";

function ViewRegistrationPage() {
  const location = useLocation(); // Get the state passed via navigation
  const registrationData = location.state || {}; // Fallback to an empty object if no data is passed

  const {
    registrationCode,
    schoolName,
    city,
    visitDate,
    preferedDate,
    visitorNum,
    supervisor,
    supervisorDuty,
    supervisorPhoneNum,
    supervisorMail,
    notes,
  } = registrationData;

  useEffect(() => {
    document.title = "View Tour Registration - BTO"; // Set the tab title
  }, []);

  return (
    <div className="viewRegistrationPage">
      <HeaderGlobal name={"YOUR TOUR REGISTRATION"} />
      <div className="viewRegistrationInfo">
        <p className="viewRegistrationCode">
          <span className="viewLabel">Registration Code:</span>{" "}
          {registrationCode || "N/A"}
        </p>
        <p className="viewSchoolName">
          <span className="viewLabel">School Name:</span> {schoolName || "N/A"}
        </p>
        <p className="viewCity">
          <span className="viewLabel">City:</span> {city || "N/A"}
        </p>
        <p className="viewVisitDate">
          <span className="viewLabel">Date of Visit:</span> {visitDate || "N/A"}
        </p>
        <p className="viewPreferedDate">
          <span className="viewLabel">Preferred Time of Visit:</span>{" "}
          {preferedDate || "N/A"}
        </p>
        <p className="viewVisitorNum">
          <span className="viewLabel">Number of Visitors:</span>{" "}
          {visitorNum || "N/A"}
        </p>
        <p className="viewSupervisor">
          <span className="viewLabel">Supervisor:</span> {supervisor || "N/A"}
        </p>
        <p className="viewSupervisorDuty">
          <span className="viewLabel">Supervisor Duty:</span>{" "}
          {supervisorDuty || "N/A"}
        </p>
        <p className="viewSupervisorPhoneNum">
          <span className="viewLabel">Supervisor Phone Number:</span>{" "}
          {supervisorPhoneNum || "N/A"}
        </p>
        <p className="viewSupervisorMail">
          <span className="viewLabel">Supervisor Mail:</span>{" "}
          {supervisorMail || "N/A"}
        </p>
        <p className="viewNotes">
          <span className="viewLabel">Notes to Consider:</span> {notes || "N/A"}
        </p>
        <div className="viewButtonSection">
          <ButtonHeaderGlobal
            name={"Cancel Registration"}
            link="/"
          ></ButtonHeaderGlobal>
          <ButtonHeaderGlobal name={"Back"} link="/"></ButtonHeaderGlobal>
        </div>
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default ViewRegistrationPage;
