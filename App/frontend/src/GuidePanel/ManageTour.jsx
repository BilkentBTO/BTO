import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FormTextAreaGlobal from "../GlobalClasses/FormTextAreaGlobal";
import Table from "../GlobalClasses/Table"; // Import the Table component

const ManageTour = () => {
  const location = useLocation();
  const { rowData } = location.state || {}; // Retrieve rowData from state

  if (!rowData) {
    return <p>No data available</p>;
  }

  // Define headers for the table based on the rowData structure
  const headers = [
    "Tour ID",
    "School",
    "City",
    "Date",
    "Time",
    "Number of Visitors",
    "Supervisor",
    "Supervisor Duty",
    "Supervisor Phone Number",
    "Supervisor Mail",
    "Notes",
  ];

  // Convert the rowData into an array of arrays for the table
  const [data, setData] = useState([Object.values(rowData)]);
  const [notes, setNotes] = useState(rowData.Notes || ""); // Track the updated notes

  // Handle changes in the text area
  const handleNotesChange = (value) => {
    setNotes(value); // Update notes state
  };

  // Handle the submit button to update the notes in the data
  const handleSubmit = () => {
    const updatedData = [...data];
    updatedData[0][headers.indexOf("Notes")] = notes; // Update the "Notes" value
    setData(updatedData); // Update the table data
    console.log("Updated Notes:", notes);
  };

  return (
    <div>
      <h1>Manage Tour</h1>
      <Table headers={headers} data={data} />
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
      </div>
    </div>
  );
};

export default ManageTour;
