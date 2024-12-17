import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SuccessAddUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const isApiCalled = useRef(false); // Prevent duplicate API calls
  const [apiResponse, setApiResponse] = useState(null); // API response message
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showPopup, setShowPopup] = useState(false); // Popup state

  useEffect(() => {
    if (isApiCalled.current) return; // Prevent double execution
    isApiCalled.current = true;

    const formData = location.state?.formData || {}; // Retrieve formData

    const userRequest = {
      name: formData.name,
      surname: formData.surname,
      username: formData.username,
      email: formData.email,
      role: formData.role,
    };

    const addUser = async () => {
      try {
        const response = await fetch("/api/User/Add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify(userRequest),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        setApiResponse(responseText); // Save API response
      } catch (error) {
        console.error("Error adding user:", error);
        setApiResponse(`Error: ${error.message}`);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    if (Object.keys(formData).length > 0) {
      addUser();
    } else {
      console.error("No formData available");
      navigate("/coordinatorPanel"); // Redirect home if no form data is available
    }
  }, [location, navigate]);

  // Function to show the popup
  const handleContinue = () => {
    setShowPopup(true);
  };

  // Function to close the popup and navigate
  const closePopup = () => {
    setShowPopup(false);
    navigate("/coordinatorPanel"); // Navigate to the admin panel
  };

  return (
    <div style={styles.container}>
      {isLoading ? (
        <div style={styles.message}>Processing your request...</div>
      ) : (
        <div style={styles.response}>
          <h2>User Successfully Added!</h2>
          <p>Confirmation Message:</p>
          <p style={styles.code}>{apiResponse}</p>
          <p>Save this confirmation message for your records!</p>
          <button onClick={handleContinue} style={styles.button}>
            Continue
          </button>
        </div>
      )}

      {/* Popup */}
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupContent}>
            <h3>Are you sure you want to continue?</h3>
            <p>Please confirm to proceed to the Coordinator Panel.</p>
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

export default SuccessAddUser;
