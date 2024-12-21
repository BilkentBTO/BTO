import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddUser.css"; // Make sure to style the popup in this file
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";

import GlobalSidebar from "../GlobalClasses/GlobalSidebar";
import Table from "../GlobalClasses/Table";
import TableWithButtons from "../GlobalClasses/TableWithButtons";

function AddUser() {
  const years = ["1", "2", "3", "4"];
  const [majors, setMajors] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState([]); // State to store fetched user data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [selectedUser, setSelectedUser] = useState(null);
  // Initialize formData with location state or default values
  const [formData, setFormData] = useState(() => {
    return (
      location?.state?.formData || {
        name: "",
        surname: "",
        username: "",
        email: "",
        role: "", // Additional field for user role
        major: "", // Additional field for user role
        currentYear: "", // Additional field for user role
        majorCode: "", // Additional field for user role
      }
    );
  });

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [showDecidePopup, setShowDecidePopup] = useState(false);

  // Generic handler for form state updates
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.surname ||
      !formData.username ||
      !formData.email ||
      !formData.role ||
      !formData.major ||
      !formData.currentYear
    ) {
      alert("Please fill in all the required fields.");
      return;
    }
    console.log("FORM DATA: ", formData);

    // Show the confirmation popup
    setShowPopup(true);
  };
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await fetch("/api/user/majors");
        if (!response.ok) throw new Error("Failed to fetch majors");

        const data = await response.json();
        const majorOptions = data.map((major) => ({
          id: major.id,
          name: major.name,
        }));
        setMajors(majorOptions);
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    fetchMajors();
  });
  const roleMapping = {
    Admin: 0,
    Coordinator: 1,
    Advisor: 2,
    Guide: 3,
  };
  const handleConfirm = () => {
    // Proceed with form submission (save data, navigate, etc.)

    console.log("Form Data confirmed:", formData);
    const payload = {
      name: formData.name, // Correct capitalization
      surname: formData.surname,
      bilkentID: parseInt(formData.bilkentID, 10),
      majorCode: formData.majorCode,
      currentYear: parseInt(formData.currentYear, 10), // Ensure it's a number
      mail: formData.email,
      userType: roleMapping[formData.role],
    };

    console.log("PAYLOAD: ", payload);

    fetch("/api/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("User added successfully:", data);
        alert("User added successfully!");
      })
      .catch((error) => {
        console.error("Failed to add user:", error);
        alert("Failed to add user. Please try again.");
      });

    // Navigate or save data (e.g., API call)
    setShowPopup(false);
    // IMPLEMENT !!!!!!!!!
  };

  const handleBack = () => {
    // Close the popup and return to the form
    setShowPopup(false);
  };
  const handleRowClick = (row) => {
    setSelectedUser(row); // Set the selected user row
    setShowDecidePopup(true); // Show the popup
  };

  const handleAccept = () => {
    if (selectedUser) {
      const selectedMajor = majors.find(
        (major) => major.name === selectedUser[4]
      );
      // Update the formData state with selected user data
      setFormData({
        name: selectedUser[1], // Map to the user's name
        surname: selectedUser[2], // Map to the user's surname
        username: selectedUser[0], // Assuming Bilkent ID as username for demo
        email: selectedUser[3], // Map to the user's email
        major: selectedUser[4],
        majorCode: selectedMajor ? selectedMajor.id : "", // Set majorCode if found
        currentYear: selectedUser[5]?.toString(), // Ensure year is a string for the dropdown
        role: "Guide", // Set default role or leave empty
      });
      setShowDecidePopup(false); // Close the popup
    }
  };

  const handleReject = () => {
    console.log(`User rejected: ${selectedUser[1]} ${selectedUser[2]}`);
    setShowDecidePopup(false); // Close the popup
  };

  const handleClosePopup = () => {
    setShowDecidePopup(false); // Close the popup
  };

  useEffect(() => {
    document.title = "Add User - Admin Panel"; // Set the tab title

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/register");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log("DATA: ", data);
        setUserData(
          data.map((user) => [
            user.bilkentID,
            user.name,
            user.surname,
            user.mail,
            user.major.name,
            user.currentYear,
          ])
        );
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const roles = ["Guide", "Advisor", "Coordinator"];

  const headers = ["Bilkent ID", "Name", "Surname", "Email", "Major", "Year"];

  return (
    <div className="addUser">
      <GlobalSidebar />
      <div className="rightSideCoorFunction">
        <HeaderPanelGlobal name="Add User" />
        <div className="rightInnerSideAddUser">
          <div className="leftInsideAddUser">
            <div className="addUserPage">
              <div className="innerAddUserPage">
                <div className="userForm">
                  <FormDropDownGlobal
                    question="Role*"
                    arr={roles}
                    initialValue={formData.role}
                    onChange={(value) => handleChange("role", value)}
                  />
                  <FormInputGlobal
                    question="Username*"
                    type="text"
                    value={formData.username}
                    onChange={(value) => handleChange("username", value)}
                  />

                  <FormInputGlobal
                    question="Name*"
                    type="text"
                    value={formData.name}
                    onChange={(value) => handleChange("name", value)}
                  />
                  <FormInputGlobal
                    question="Surname*"
                    type="text"
                    value={formData.surname}
                    onChange={(value) => handleChange("surname", value)}
                  />

                  <FormInputGlobal
                    question="Email*"
                    type="email"
                    value={formData.email}
                    onChange={(value) => handleChange("email", value)}
                  />
                  <FormDropDownGlobal
                    arr={majors.map((major) => major.name)}
                    question="Major*"
                    onChange={(value) => {
                      const selectedMajor = majors.find(
                        (major) => major.name === value
                      );
                      handleChange("major", selectedMajor.name);
                      handleChange("majorCode", selectedMajor?.id);
                    }}
                    initialValue={formData.major}
                  />
                  <FormDropDownGlobal
                    arr={years}
                    question="Current Year*"
                    onChange={(value) =>
                      handleChange("currentYear", parseInt(value, 10))
                    }
                    initialValue={formData.currentYear}
                  />

                  {/* Submit Button */}
                  <button onClick={handleSubmit} className="submitButton">
                    Add User
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="rightInsideAddUser">
            {isLoading ? (
              <p>Loading Users</p>
            ) : userData.length > 0 ? (
              <TableWithButtons
                headers={headers}
                data={userData}
                onButtonClick={(row) => handleRowClick(row)}
                buttonStyle={{
                  color: "red",
                }}
                buttonName="Decide"
              />
            ) : (
              <p>No Users Registered</p>
            )}
          </div>
        </div>
      </div>
      {showDecidePopup && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h2>Decide on User</h2>
            {selectedUser && (
              <div>
                <p>
                  <strong>Bilkent ID:</strong> {selectedUser[0]}
                </p>
                <p>
                  <strong>Name:</strong> {selectedUser[1]} {selectedUser[2]}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser[3]}
                </p>
                <p>
                  <strong>Major:</strong> {selectedUser[4]}
                </p>
                <p>
                  <strong>Year:</strong> {selectedUser[5]}
                </p>
              </div>
            )}
            <div className="popupActions">
              <button
                style={{
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
                }}
                onClick={handleAccept}
              >
                Accept
              </button>
              <button
                style={{
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
                }}
                onClick={handleReject}
              >
                Reject
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "grey",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  width: "100%",
                  maxWidth: "120px",
                  textAlign: "center",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                }}
                onClick={handleClosePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h2>Confirm User Information</h2>

            {/* Displaying form data in a table */}
            <table className="userInfoTable">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Role</strong>
                  </td>
                  <td>{formData.role}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Username</strong>
                  </td>
                  <td>{formData.username}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Name</strong>
                  </td>
                  <td>{formData.name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Surname</strong>
                  </td>
                  <td>{formData.surname}</td>
                </tr>

                <tr>
                  <td>
                    <strong>Email</strong>
                  </td>
                  <td>{formData.email}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Major</strong>
                  </td>
                  <td>{formData.major}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Current Year</strong>
                  </td>
                  <td>{formData.currentYear}</td>
                </tr>
              </tbody>
            </table>

            <div className="popupActions">
              <button
                style={{
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
                }}
                className="popupButton"
                onClick={handleConfirm}
              >
                Confirm
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "grey",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  width: "100%",
                  maxWidth: "120px",
                  textAlign: "center",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                }}
                className="popupButton"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddUser;
