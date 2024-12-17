import { useEffect } from "react";
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

  useEffect(() => {
    const formData = location.state?.formData || {};

    const dateOfVisitUTC = convertDateToUTC(formData.visitDate);
    if (!dateOfVisitUTC) {
      alert("Invalid visit date.");
      return;
    }

    const startTimeUTC = convertTimeToUTC(formData.visitDate, formData.visitTime);
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
        id: 0, // Adjust if you have a dynamic ID
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

    console.log("API:" , registrationRequest);
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
        //HAVE A NICE PAGE FOR THIS. 
        console.log(await response.text());
        // Navigate to the desired location after successful registration
        navigate("/");
      } catch (error) {
        console.error("Error registering school:", error);
      }
    };

    if (Object.keys(formData).length > 0) {
      registerSchool();
    } else {
      console.error("No formData available");
      navigate("/");
    }
  }, [location, navigate]);

  return null;
}

export default SuccessSchoolReg;