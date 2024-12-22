import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SuccessSchoolSurvey() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const successMessage =
    location.state?.successMessage || "No message available";

  const closePopup = () => {
    setShowPopup(false); // Hide the popup
    navigate("/"); // Navigate to the main page
  };

  return (
    <div style={styles.container}>
      <div style={styles.response}>
        <h2>Sent Successfully!</h2>
        <button onClick={closePopup} style={styles.button}>
          Return to Main Page
        </button>
      </div>
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
  response: {
    fontFamily: "Arial",
    fontSize: "1.2rem",
    color: "#333",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
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
};
export default SuccessSchoolSurvey;
