import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import "./ViewRegistrationPage.css";

function ViewRegistrationPage() {
  const location = useLocation(); // Get the state passed via navigation
  const navigate = useNavigate();

  const registrationData = location.state?.registrationData || {};

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
    state,
  } = registrationData;

  const schoolName = school?.schoolName || "N/A"; // Access schoolName safely

  useEffect(() => {
    document.title = "View Tour Registration - BTO";
    console.log("RegData: ", registrationData);
  }, [registrationData]);

  // Helper function to map state numbers to status text
  const getStateText = (stateValue) => {
    switch (stateValue) {
      case 0:
        return "Pending";
      case 1:
        return "Accepted";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const handleCancelClick = () => {
    navigate("/");
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div>
      <HeaderGlobal name={"YOUR TOUR REGISTRATION"} />
      <div className="viewRegistrationPage">
        <div className="viewRegistrationInfo">
          <p className="viewRegistrationCode">
            <span className="viewLabel">Registration Code:</span>{" "}
            {registrationCode || "N/A"}
          </p>
          <p className="viewSchoolName">
            <span className="viewLabel">School Name:</span>{" "}
            {schoolName || "N/A"}
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
          <p className="viewState">
            <span className="viewLabel">State:</span> {getStateText(state)}
          </p>

          <div className="viewButtonSection">
            <button
              className="viewCodeCancelButton"
              onClick={handleCancelClick}
            >
              Cancel Registration
            </button>
            <button className="viewCodeBackButton" onClick={handleBackClick}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewRegistrationPage;
