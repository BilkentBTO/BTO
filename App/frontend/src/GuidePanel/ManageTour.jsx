import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormTextAreaGlobal from "../GlobalClasses/FormTextAreaGlobal";

const ManageTour = () => {
  const location = useLocation();
  const { selectedTour } = location.state || {}; // Retrieve selectedTour from state
  console.log("ROW DATA: ", selectedTour);

  if (!selectedTour) {
    return <p>No data available</p>;
  }

  const navigate = useNavigate();

  // Flatten and transform the `selectedTour` data
  const data = {
    "Tour ID": selectedTour.code || "N/A",
    School: selectedTour.school?.schoolName || "N/A",
    City: selectedTour.cityName || "N/A",
    Date: new Date(selectedTour.dateOfVisit).toLocaleDateString() || "N/A",
    Time: selectedTour.preferredVisitTime?.id || "N/A",
    "Number of Visitors": selectedTour.numberOfVisitors || "N/A",
    Supervisor: selectedTour.superVisorName || "N/A",
    "Supervisor Duty": selectedTour.superVisorDuty || "N/A",
    "Supervisor Phone Number": selectedTour.superVisorPhoneNumber || "N/A",
    "Supervisor Mail": selectedTour.superVisorMailAddress || "N/A",
    Notes: selectedTour.notes || "N/A",
  };

  const [notes, setNotes] = useState(selectedTour.notes || ""); // Track updated notes

  // Handle changes in the text area
  const handleNotesChange = (value) => {
    setNotes(value);
  };

  // Handle the submit button to update the notes
  const handleSubmit = () => {
    console.log("Updated Notes:", notes);
  };

  const handleCancel = () => {
    navigate("/guidePanel/assignedTours");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Tour</h1>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  fontWeight: "bold",
                  width: "30%",
                  backgroundColor: "#f0f0f0",
                }}
              >
                {key}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "70%",
                }}
              >
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "20px" }}>
        <h3>Update Notes</h3>
        <FormTextAreaGlobal
          value={notes}
          onChange={handleNotesChange} // Pass handleNotesChange
          placeholder="Enter updated notes here..."
        />
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
        <button
          onClick={handleCancel}
          style={{
            marginTop: "10px",
            marginLeft: "10px",
            padding: "10px 20px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ManageTour;
