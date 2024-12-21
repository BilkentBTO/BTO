import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SuccessSchoolReg() {
  const location = useLocation();
  const navigate = useNavigate();
  const successMessage =
    location.state?.successMessage || "No message available";

  const handleContinue = () => {
    navigate("/"); // Navigate to the main page
  };

  return (
    <div style={styles.container}>
      <div style={styles.response}>
        <h2>Registration Successful!</h2>
        <p>Your access code:</p>
        <p style={styles.code}>{successMessage}</p>
        <p>Save this code in a secure place!</p>
        <button onClick={handleContinue} style={styles.button}>
          Continue
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
    backgroundColor: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 15px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default SuccessSchoolReg;
