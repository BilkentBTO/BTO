import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parseISO, formatISO } from "date-fns";

const convertDateToUTC = (dateString) => {
  if (!dateString) return null;
  const parsedDate = parseISO(`${dateString}T00:00:00Z`);
  return formatISO(parsedDate, { representation: "complete" });
};

const convertTimeToUTC = (dateString, timeString) => {
  if (!dateString || !timeString) return null;
  const combinedDateTime = `${dateString}T${timeString}:00Z`;
  const parsedDateTime = parseISO(combinedDateTime);
  return formatISO(parsedDateTime, { representation: "complete" });
};

function SuccessSchoolReg() {
  const location = useLocation();
  const navigate = useNavigate();
  const isApiCalled = useRef(false); // Prevent duplicate calls
  const [apiResponse, setApiResponse] = useState(null); // State to hold API response
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    if (isApiCalled.current) return; // Prevent double execution
    isApiCalled.current = true;

    const formData = location.state?.formData || {};

    const dateOfVisitUTC = convertDateToUTC(formData.visitDate);
    if (!dateOfVisitUTC) {
      alert("Invalid visit date.");
      return;
    }

    const startTimeUTC = convertTimeToUTC(
      formData.visitDate,
      formData.visitTime
    );
    if (!startTimeUTC) {
      alert("Invalid visit time.");
      return;
    }

    const endTime = new Date(startTimeUTC);
    endTime.setHours(endTime.getHours() + 2);
    const endTimeUTC = formatISO(endTime, { representation: "complete" });

    const registrationRequest = {
      cityName: formData.city,
      schoolName: formData.school,
      dateOfVisit: dateOfVisitUTC,
      prefferedVisitTime: {
        id: 0,
        startTime: startTimeUTC,
        endTime: endTimeUTC,
      },
      numberOfVisitors: parseInt(formData.visitorCount, 10),
      superVisorName: formData.supervisorName,
      superVisorDuty: formData.supervisorDuty,
      superVisorPhoneNumber: formData.supervisorPhone,
      superVisorMailAddress: formData.supervisorEmail,
      notes: formData.notes,
    };

    const registerSchool = async () => {
      try {
        const response = await fetch("/api/Registration/Register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify(registrationRequest),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        setApiResponse(responseText); // Save the response
      } catch (error) {
        console.error("Error registering school:", error);
        setApiResponse(`Error: ${error.message}`);
      } finally {
        setIsLoading(false); // Stop loading
        setTimeout(() => navigate("/"), 5000); // Redirect after 3 seconds
      }
    };

    if (Object.keys(formData).length > 0) {
      registerSchool();
    } else {
      console.error("No formData available");
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <div style={styles.container}>
      {isLoading ? (
        <div style={styles.message}>Processing your request...</div>
      ) : (
        <div style={styles.response}>
          <h2>API Response</h2>
          <h2>{apiResponse}</h2>
          <p>You will have access through this code</p>
          <p>Save to A Place You will not forget</p>
          <p>Redirecting to the Admin Panel...</p>
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
};

export default SuccessSchoolReg;
