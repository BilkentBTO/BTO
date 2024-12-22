import React, { useState, useEffect } from "react";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import Table from "../GlobalClasses/Table";
import { jwtDecode } from "jwt-decode";
import "./EditAvailableHoursPage.css";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function EditAvailableHoursPage() {
  const navigate = useNavigate();

  // Predefined hours
  const hours = ["09:00", "11:00", "13:00", "16:00"];
  const headers = ["Date", "Time", "State"];

  // State variables
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [data, setData] = useState([]);
  const [busyHours, setBusyHours] = useState([]); // Tracks Busy hours
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [guideUID, setGuideUID] = useState(null);

  // Fetch data and pre-fill table
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const UID = decodedToken["UID"];
        setGuideUID(UID);

        fetch(`/api/user/${UID}`)
          .then((response) => {
            if (!response.ok)
              throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
          })
          .then((userData) => {
            const preFilledData = userData.availableHours.map((hour) => {
              const [datePart, timePart] = hour.split("T");
              const formattedTime = timePart.substring(0, 5);
              return [datePart, formattedTime, "Available"];
            });
            setData(preFilledData);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Handle adding a new row
  // Handle adding a new row
  const handleAddRow = (state) => {
    if (!date || !time) {
      alert("Please select both date and time.");
      return;
    }

    if (state === "Busy") {
      const updatedData = data.filter(
        (row) => !(row[0] === date && row[1] === time)
      );
      setData(updatedData);
      setBusyHours((prev) => [
        ...prev,
        `${date}T${time}:00Z`, // Remove milliseconds
      ]);
      console.log("BUSY HOURS: ", busyHours);
    } else if (state === "Available") {
      const newRow = [date, time, state];
      const existingRow = data.find(
        (row) => row[0] === date && row[1] === time
      );

      if (existingRow) {
        alert("This time slot is already available.");
        return;
      }

      setData((prevData) => [...prevData, newRow]);
    }
  };

  // Handle updating the available hours
  const handleUpdateHours = async () => {
    const availableHours = data
      .filter((row) => row[2] === "Available")
      .map((row) => `${row[0]}T${row[1]}:00Z`); // Remove milliseconds

    console.log("AVAL: ", availableHours);
    const deleteRequestBody = { busyHours };
    console.log("DELETE: ", deleteRequestBody);

    try {
      if (availableHours.length > 0) {
        await fetch(`/api/user/${guideUID}/hours`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ availableHours }),
        });
      }

      if (busyHours.length > 0) {
        console.log("BUSY HOURS 2: ", busyHours);
        await fetch(`/api/user/${guideUID}/hours`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ availableHours: busyHours }), // Corrected payload
        });

        setBusyHours([]); // Clear busyHours after successful deletion
      }
      alert("Table Changed");
    } catch (error) {
      console.error("Error updating hours:", error);
      alert("Error updating hours.");
    }
  };

  // Popup functions
  const showConfirmationPopup = () => {
    setPopupMessage("Are you sure you want to update?");
    setShowPopup(true);
  };

  const handleConfirm = () => {
    handleUpdateHours();
    setShowPopup(false);
  };

  const handleCancel = () => setShowPopup(false);

  const Popup = ({ message, onConfirm, onCancel }) => (
    <div className="editAvailableHours-popup-overlay">
      <div className="editAvailableHours-popup-content">
        <p>{message}</p>
        <div className="editAvailableHours-popup-buttons">
          <button
            onClick={onConfirm}
            className="editAvailableHours-popup-confirm"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="editAvailableHours-popup-cancel"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="editAvailableHours">
      <GlobalSidebar />
      <div className="rightSideGuideFunction">
        <HeaderPanelGlobal name={"Edit Available Hours"} />
        <div className="innerEditPage">
          <div className="leftInner">
            <div className="form">
              <FormInputGlobal
                question="Select Date:"
                type="date"
                value={date}
                onChange={setDate}
              />
              <FormDropDownGlobal
                question="Select Time:"
                arr={hours}
                value={time}
                onChange={setTime}
              />
              <div className="buttonEditSection">
                <button
                  onClick={() => handleAddRow("Busy")}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "red",
                    color: "white",
                  }}
                >
                  Set Busy
                </button>
                <button
                  onClick={() => handleAddRow("Available")}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "green",
                    color: "white",
                  }}
                >
                  Set Available
                </button>
                <button
                  onClick={showConfirmationPopup}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#1e1e64",
                    color: "white",
                  }}
                >
                  Update Table
                </button>
              </div>
            </div>
          </div>
          <div className="rightInner">
            <Table data={data} headers={headers} />
          </div>
        </div>
        {showPopup && (
          <Popup
            message={popupMessage}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default EditAvailableHoursPage;
