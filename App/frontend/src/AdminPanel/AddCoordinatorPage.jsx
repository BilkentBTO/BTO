import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddCoordinatorPage.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function AddCoordinator() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(() => {
    return (
      location?.state?.formData || {
        name: "",
        surname: "",
        username: "",
        email: "",
        bilkentID: "",
        major: "",
        currentYear: "",
        majorCode: "",
        role: "Coordinator", // Default role for the coordinator
      }
    );
  });

  const [showPopup, setShowPopup] = useState(false);
  const [majors, setMajors] = useState([]);
  const [years] = useState(["1", "2", "3", "4"]); // Year options for dropdown

  // Generic handler for form state updates
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Fetch majors for dropdown
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
  }, []);

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.surname ||
      !formData.username ||
      !formData.email ||
      !formData.bilkentID ||
      !formData.major ||
      !formData.currentYear
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    setShowPopup(true); // Show the confirmation popup
  };

  const handleConfirm = () => {
    console.log("Bilkent ID before confirmation:", formData.bilkentID);
    const payload = {
      name: formData.name,
      surname: formData.surname,
      username: formData.username,
      mail: formData.email,
      bilkentID: parseInt(formData.bilkentID, 10),
      majorCode: formData.majorCode,
      currentYear: parseInt(formData.currentYear, 10),
      userType: 2, // UserType for Coordinator
    };

    console.log("Submitting payload:", payload);

    fetch("/api/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to add coordinator: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        console.log("Coordinator added successfully:", data);
        alert("Coordinator added successfully!");
        setShowPopup(false);
        navigate("/adminPanel"); // Navigate to admin panel
      })
      .catch((error) => {
        console.error("Error adding coordinator:", error);
        alert("Failed to add coordinator. Please try again.");
      });
  };

  const handleBack = () => {
    setShowPopup(false); // Close the popup and return to the form
  };

  useEffect(() => {
    document.title = "Add Coordinator - Admin Panel"; // Set the tab title
  }, []);

  return (
    <div className="addCoordinator">
      <GlobalSidebar />
      <div className="rightSideAdminFunction">
        <HeaderPanelGlobal name="ADMIN PANEL" />
        <div className="addCoordinatorPage">
          <div className="innerAddCoordinatorPage">
            <div className="coordinatorForm">
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
                question="Username*"
                type="text"
                value={formData.username}
                onChange={(value) => handleChange("username", value)}
              />
              <FormInputGlobal
                question="Email*"
                type="email"
                value={formData.email}
                onChange={(value) => handleChange("email", value)}
              />
              <FormInputGlobal
                question="Bilkent ID*"
                type="number"
                value={formData.bilkentID}
                onChange={(value) => handleChange("bilkentID", value)}
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
                onChange={(value) => handleChange("currentYear", value)}
                initialValue={formData.currentYear}
              />

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="addCoordinatorSubmitButton"
              >
                Add Coordinator
              </button>
            </div>

            {/* Popup for confirming coordinator information */}
            {showPopup && (
              <div className="popupOverlay">
                <div className="popupContent">
                  <h2>Confirm Coordinator Information</h2>

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
                          <strong>Username</strong>
                        </td>
                        <td>{formData.username}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Email</strong>
                        </td>
                        <td>{formData.email}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Bilkent ID</strong>
                        </td>
                        <td>{formData.bilkentID}</td>
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
                        marginTop: "20px",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        width: "100%",
                        maxWidth: "120px",
                        textAlign: "center",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
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
                        marginTop: "20px",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        width: "100%",
                        maxWidth: "120px",
                        textAlign: "center",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
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
        </div>
      </div>
    </div>
  );
}

export default AddCoordinator;
