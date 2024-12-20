import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import "./ViewRegistrationPage.css";

function ViewRegistrationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const registrationData = location.state?.registrationData || {};

  useEffect(() => {
    document.title = "View Registration - BTO";
    console.log("Registration Data:", registrationData);
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
    setShowPopup(true); // Show confirmation popup
  };

  const confirmCancel = async () => {
    try {
      const response = await fetch(
        `/api/register/general/cancel?Code=${registrationData.code}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      alert("Registration canceled successfully!");
      navigate("/"); // Redirect to homepage after cancellation
    } catch (error) {
      console.error("Error canceling registration:", error.message);
      alert("Failed to cancel registration. Please try again.");
    } finally {
      setShowPopup(false); // Close the popup
    }
  };

  const cancelPopup = () => {
    setShowPopup(false); // Close the popup
  };

  const handleBackClick = () => {
    navigate("/");
  };

  // Render fields dynamically based on the type
  const renderFields = () => {
    switch (registrationData.type) {
      case "Tour":
        return (
          <>
            <p className="viewType">
              <span className="viewLabel">Type:</span> {"School Tour"}
            </p>
            <p className="viewCode">
              <span className="viewLabel">Code:</span>{" "}
              {registrationData.code || "N/A"}
            </p>
            <p className="viewCity">
              <span className="viewLabel">City:</span>{" "}
              {registrationData.cityName || "N/A"}
            </p>
            <p className="viewSchoolName">
              <span className="viewLabel">School Name:</span>{" "}
              {registrationData.school?.schoolName || "N/A"}
            </p>
            <p className="viewVisitDate">
              <span className="viewLabel">Date of Visit:</span>{" "}
              {new Date(registrationData.dateOfVisit).toLocaleDateString() ||
                "N/A"}
            </p>
            <p className="viewVisitorNum">
              <span className="viewLabel">Number of Visitors:</span>{" "}
              {registrationData.numberOfVisitors || "N/A"}
            </p>
            <p className="viewSupervisor">
              <span className="viewLabel">Supervisor Name:</span>{" "}
              {registrationData.superVisorName || "N/A"}
            </p>
            <p className="viewSupervisorMail">
              <span className="viewLabel">Supervisor Email:</span>{" "}
              {registrationData.superVisorMailAddress || "N/A"}
            </p>
            <p className="viewSupervisorPhone">
              <span className="viewLabel">Supervisor Phone:</span>{" "}
              {registrationData.superVisorPhoneNumber || "N/A"}
            </p>
            <p className="viewNotes">
              <span className="viewLabel">Notes:</span>{" "}
              {registrationData.notes || "N/A"}
            </p>
            <p className="viewState">
              <span className="viewLabel">State:</span>{" "}
              {getStateText(registrationData.state) || "N/A"}
            </p>
          </>
        );
      case "Fair":
        return (
          <>
            <p className="viewType">
              <span className="viewLabel">Type:</span> {"Fair Request"}
            </p>
            <p className="viewCity">
              <span className="viewLabel">City:</span>{" "}
              {registrationData.cityName || "N/A"}
            </p>
            <p className="viewSchoolName">
              <span className="viewLabel">School Name:</span>{" "}
              {registrationData.school?.schoolName || "N/A"}
            </p>
            <p className="viewVisitDate">
              <span className="viewLabel">Date of Visit:</span>{" "}
              {new Date(registrationData.dateOfVisit).toLocaleDateString() ||
                "N/A"}
            </p>
            <p className="viewSupervisor">
              <span className="viewLabel">Supervisor Name:</span>{" "}
              {registrationData.superVisorName || "N/A"}
            </p>
            <p className="viewSupervisor">
              <span className="viewLabel">Supervisor Duty:</span>{" "}
              {registrationData.superVisorDuty || "N/A"}
            </p>
            <p className="viewSupervisorMail">
              <span className="viewLabel">Supervisor Email:</span>{" "}
              {registrationData.superVisorMailAddress || "N/A"}
            </p>
            <p className="viewSupervisorPhone">
              <span className="viewLabel">Supervisor Phone:</span>{" "}
              {registrationData.superVisorPhoneNumber || "N/A"}
            </p>
            <p className="viewNotes">
              <span className="viewLabel">Notes:</span>{" "}
              {registrationData.notes || "N/A"}
            </p>
            <p className="viewState">
              <span className="viewLabel">State:</span>{" "}
              {getStateText(registrationData.state) || "N/A"}
            </p>
          </>
        );
      case "Individual":
        return (
          <>
            <p className="viewType">
              <span className="viewLabel">Type:</span> {"Individual Tour"}
            </p>
            <p className="viewVisitDate">
              <span className="viewLabel">Date of Visit:</span>{" "}
              {new Date(registrationData.dateOfVisit).toLocaleDateString() ||
                "N/A"}
            </p>
            <p className="viewVisitorNum">
              <span className="viewLabel">Individual Name:</span>{" "}
              {registrationData.individualName || "N/A"}
            </p>
            <p className="viewPreferredMajor">
              <span className="viewLabel">Preferred Major:</span>{" "}
              {registrationData.individualMajor?.name || "N/A"}
            </p>
            <p className="viewSupervisorPhoneNum">
              <span className="viewLabel">Phone Number:</span>{" "}
              {registrationData.individualPhoneNumber || "N/A"}
            </p>
            <p className="viewSupervisorMail">
              <span className="viewLabel">Email Address:</span>{" "}
              {registrationData.individualMailAddress || "N/A"}
            </p>
            <p className="viewNotes">
              <span className="viewLabel">Notes:</span>{" "}
              {registrationData.notes || "N/A"}
            </p>
            <p className="viewState">
              <span className="viewLabel">State:</span>{" "}
              {getStateText(registrationData.state) || "N/A"}
            </p>
          </>
        );
      default:
        return <p>No valid registration data found.</p>;
    }
  };

  return (
    <div>
      <HeaderGlobal name={"VIEW REGISTRATION"} />
      <div className="viewRegistrationPage">
        <div className="viewRegistrationInfo">
          <h3>Registration Details</h3>
          {renderFields()}
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

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h3>Are you sure?</h3>
            <p>
              Canceling this registration cannot be undone. Do you want to
              proceed?
            </p>
            <div className="popupActions">
              <button
                onClick={confirmCancel}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Yes, Cancel
              </button>
              <button
                onClick={cancelPopup}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewRegistrationPage;
