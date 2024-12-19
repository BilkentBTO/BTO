import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parseISO, formatISO } from "date-fns";

function SuccessInvite() {
  const location = useLocation();
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const convertDateToUTC = (dateString) => {
    if (!dateString) return null;
    const parsedDate = new Date(`${dateString}T00:00:00`);
    const isoString = parsedDate.toISOString().replace(".000Z", "Z");
    console.log("Formatted Date (UTC):", isoString); // Debugging date format
    return isoString;
  };
  useEffect(() => {
    const formData = location.state?.formData || {};
    console.log("FormData received:", formData);
    console.log("DATE STRING: ", formData.dateOfVisit);
    const dateOfVisitUTC = convertDateToUTC(formData.dateOfVisit);
    formData.schoolCode = parseInt(formData.schoolCode, 10);
    const registration = {
      cityName: formData.cityName,
      schoolCode: formData.schoolCode,
      dateOfVisit: dateOfVisitUTC,
      superVisorName: formData.superVisorName,
      superVisorDuty: formData.superVisorDuty,
      superVisorPhoneNumber: formData.superVisorPhoneNumber,
      superVisorMailAddress: formData.superVisorMailAddress,
      notes: formData.notes,
    };
    console.log("Registeration: ", registration);
    const registerData = async () => {
      try {
        const response = await fetch("/api/register/fair", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registration),
        });
        console.log("RESPONSE: ", response);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! Status: ${response.status}, ${errorText}`
          );
        }

        const responseData = await response.text();

        console.log("Registration successful:", responseData);
        setApiResponse(responseData);
      } catch (error) {
        console.error("Error registering data:", error.message);
        setApiResponse(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (Object.keys(registration).length > 0) {
      registerData();
    } else {
      console.error("No formData available");
      navigate("/");
    }
  }, [location, navigate]);

  const handleContinue = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {isLoading ? (
        <div style={styles.message}>Processing your request...</div>
      ) : (
        <div style={styles.response}>
          <h2>
            {apiResponse.includes("Error")
              ? "Registration Failed"
              : "Registration Successful!"}
          </h2>
          <p>{JSON.stringify(apiResponse, null, 2)}</p>
          <button onClick={handleContinue} style={styles.button}>
            Continue
          </button>
        </div>
      )}

      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupContent}>
            <h3>Are you sure you want to continue?</h3>
            <p>Please confirm to proceed to the next page.</p>
            <div style={styles.popupActions}>
              <button onClick={closePopup} style={styles.confirmButton}>
                Confirm
              </button>
              <button
                onClick={() => setShowPopup(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  message: {
    fontSize: "1.5rem",
    color: "#007bff",
  },
  response: {
    fontFamily: "Arial",
    fontSize: "1.2rem",
    color: "#333",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  code: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#28a745",
    margin: "10px 0",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "15px",
    fontSize: "1rem",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popupContent: {
    fontFamily: "Arial",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  popupActions: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-around",
  },
  confirmButton: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
export default SuccessInvite;
