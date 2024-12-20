import React, { useState, useEffect } from "react";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import Table from "../GlobalClasses/Table";
import profileImage from "../assets/profile_image.png";
import "./EditAvailableHoursPage.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function EditAvailableHoursPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false); // To show popup
  const [popupMessage, setPopupMessage] = useState(""); // Popup message state
  const showConfirmationPopup = () => {
    setPopupMessage("Are you sure you want to update?");
    setShowPopup(true);
  };

  // Handle confirmation action (redirect to GuidePanel)
  const handleConfirm = () => {
    setShowPopup(false);
    navigate("/guidePanel"); // Redirect to the GuidePanel page
  };

  // Handle cancellation of the popup
  const handleCancel = () => {
    setShowPopup(false); // Just close the popup without action
  };
  const Popup = ({ message, onConfirm, onCancel }) => {
    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <p>{message}</p>
          <div className="popup-buttons">
            <button onClick={onConfirm}>Yes</button>
            <button onClick={onCancel}>No</button>
          </div>
        </div>
      </div>
    );
  };

  const hours = [
    "8.00",
    "8.30",
    "9.00",
    "9.30",
    "10.00",
    "10.30",
    "11.00",
    "11.30",
    "12.00",
    "12.30",
    "13.00",
    "13.30",
    "14.00",
    "14.30",
    "15.00",
    "15.30",
    "16.00",
    "16.30",
    "17.00",
    "17.30",
    "18.00",
    "18.30",
    "19.00",
    "19.30",
    "20.00",
    "20.30",
    "21.00",
  ];

  const headers = ["Date", "Time Interval", "State"];

  // State for form inputs
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // State for table data
  const [data, setData] = useState([]);

  // Handle adding a new row to the table
  const handleAddRow = (stateValue) => {
    console.log("Button clicked with state:", stateValue);

    // Validate inputs
    if (!date || !start || !end) {
      console.log("Validation failed: missing inputs");
      alert("Please fill in all fields before adding.");
      return;
    }

    // Convert time strings to comparable values
    const convertToMinutes = (time) => {
      const [hours, minutes] = time.split(".").map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = convertToMinutes(start);
    const endMinutes = convertToMinutes(end);

    if (endMinutes <= startMinutes) {
      alert("Select End time that is after Start time");
      return;
    }

    const timeInterval = start + "-" + end;
    console.log("Validation passed");

    const newRow = [date, timeInterval, stateValue];

    setData((prevData) => {
      // Check if the row already exists in the data
      const existingRowIndex = prevData.findIndex(
        (row) =>
          row[0] === newRow[0] && // Check if date matches
          row[1] === newRow[1] // Check if timeInterval matches
      );

      if (existingRowIndex !== -1) {
        // If the row exists and the new state is "Available"
        if (stateValue === "Available") {
          // Check if it was not set to "Busy" before
          if (prevData[existingRowIndex][2] !== "Busy") {
            alert(
              "This time slot cannot be set to Available unless it is first set to Busy."
            );
            return prevData; // Don't modify the data
          }

          // If it was "Busy", remove the row and add the "Available" state
          const updatedData = prevData.filter(
            (_, index) => index !== existingRowIndex
          );
          console.log("Row removed. Updated data array:", updatedData);
          return updatedData; // Remove the "Busy" entry, do not add the "Available"
        }

        // If the row already exists and the state isn't "Available", no further action needed
        alert("This entry already exists.");
        return prevData;
      }

      if (stateValue === "Available") {
        alert("It is already available");
        return prevData;
      }

      // If the row doesn't exist, add it as a new entry
      const updatedData = [...prevData, newRow];

      // Sort the updated data array by date and then by time interval
      updatedData.sort((a, b) => {
        // Compare by date first
        const dateA = new Date(a[0]);
        const dateB = new Date(b[0]);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }

        // If the dates are the same, compare by time interval
        const [startA, endA] = a[1].split("-").map(convertToMinutes);
        const [startB, endB] = b[1].split("-").map(convertToMinutes);

        // Compare start times
        return startA - startB;
      });

      console.log("New row added. Updated and sorted data array:", updatedData);
      return updatedData;
    });
  };

  const buttonStyleBusy = {
    padding: "8px 16px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    width: "100%",
    maxWidth: "120px",
    textAlign: "center",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  const buttonStyleAvailable = {
    padding: "8px 16px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    width: "100%",
    maxWidth: "120px",
    textAlign: "center",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  const buttonStyleUpdate = {
    padding: "8px 16px",
    backgroundColor: "#1e1e64",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    width: "100%",
    maxWidth: "120px",
    textAlign: "center",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  return (
    <div className="editAvailableHours">
      <GlobalSidebar />
      <div className="rightSideGuideFunction">
        <HeaderPanelGlobal name={"Edit Available Hours"} />
        <div className="innerEditPage">
          <div className="leftInner">
            <div className="form">
              {/* Date Input */}
              <FormInputGlobal
                question={"Select Date to Modify"}
                type="date"
                value={date}
                onChange={setDate}
              />

              {/* Dropdown for Time Interval */}
              <FormDropDownGlobal
                question="Select Start:"
                arr={hours}
                value={start}
                onChange={setStart}
              />
              <FormDropDownGlobal
                question="Select End:"
                arr={hours}
                value={end}
                onChange={setEnd}
              />

              {/* Buttons to set state and add data */}
              <div className="buttonEditSection">
                <button
                  style={buttonStyleBusy}
                  className="busyButton"
                  onClick={() => handleAddRow("Busy")}
                >
                  Set Busy
                </button>
                <button
                  style={buttonStyleAvailable}
                  className="availableButton"
                  onClick={() => handleAddRow("Available")}
                >
                  Set Available
                </button>
                <button
                  style={buttonStyleUpdate}
                  className="updateTableButton"
                  onClick={showConfirmationPopup}
                >
                  Update Table
                </button>
              </div>
              <p className="descr">*Available Hours are not shown</p>
            </div>
          </div>

          {/* Table Section */}
          <div className="rightInner">
            <Table data={data} headers={headers} />
          </div>
        </div>
        <div className="editPopUp">
          {showPopup && (
            <Popup
              message={popupMessage}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditAvailableHoursPage;
