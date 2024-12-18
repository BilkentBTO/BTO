import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import ButtonHeaderGlobal from "../GlobalClasses/ButtonHeaderGlobal";
import "./ViewRegistrationPage.css";

function ViewRegistrationPage() {
  const location = useLocation(); // Get the state passed via navigation
  const registrationData = location.state?.registrationData || {}; // Access the data passed to this page

  // Destructure API response data with fallback values
  const {
    code: registrationCode,
    school,
    cityName: city,
    dateOfVisit,
    prefferedVisitTime,
    numberOfVisitors,
    superVisorName,
    superVisorDuty,
    superVisorPhoneNumber,
    superVisorMailAddress,
    notes,
  } = registrationData;

  const schoolName = school?.schoolName || "N/A"; // Access schoolName safely
  useEffect(() => {
    document.title = "View Tour Registration - BTO"; // Set the tab title
    console.log("RegData: ", registrationData);
  }, []);

  return (
    <div className="viewRegistrationPage">
      <HeaderGlobal name={"YOUR TOUR REGISTRATION"} />
      <div className="viewRegistrationInfo">
        {/* Registration Information */}
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
          <span className="viewLabel">Date of Visit:</span>{" "}
          {dateOfVisit ? new Date(dateOfVisit).toLocaleDateString() : "N/A"}
        </p>
        <p className="viewPreferedDate">
          <span className="viewLabel">Preferred Time of Visit:</span>{" "}
          {prefferedVisitTime?.startTime
            ? new Date(prefferedVisitTime.startTime).toLocaleTimeString()
            : "N/A"}
        </p>
        <p className="viewVisitorNum">
          <span className="viewLabel">Number of Visitors:</span>{" "}
          {numberOfVisitors || "N/A"}
        </p>
        <p className="viewSupervisor">
          <span className="viewLabel">Supervisor Name:</span>{" "}
          {superVisorName || "N/A"}
        </p>
        <p className="viewSupervisorDuty">
          <span className="viewLabel">Supervisor Duty:</span>{" "}
          {superVisorDuty || "N/A"}
        </p>
        <p className="viewSupervisorPhoneNum">
          <span className="viewLabel">Supervisor Phone Number:</span>{" "}
          {superVisorPhoneNumber || "N/A"}
        </p>
        <p className="viewSupervisorMail">
          <span className="viewLabel">Supervisor Mail:</span>{" "}
          {superVisorMailAddress || "N/A"}
        </p>
        <p className="viewNotes">
          <span className="viewLabel">Notes:</span> {notes || "N/A"}
        </p>

        {/* Buttons */}
        <div className="viewButtonSection">
          <ButtonHeaderGlobal
            name={"Cancel Registration"}
            link="/"
          ></ButtonHeaderGlobal>
          <ButtonHeaderGlobal name={"Back"} link="/"></ButtonHeaderGlobal>
        </div>
      </div>
    </div>
  );
}

export default ViewRegistrationPage;
