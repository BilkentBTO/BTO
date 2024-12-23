import { jwtDecode } from "jwt-decode";
import profileImage from "../assets/profile_image.png";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./GlobalSidebar.css";

function GlobalSidebar() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [surname, setSurname] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [userData, setUserData] = useState(null);
  const [incrementValue, setIncrementValue] = useState(1); // Input value
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const roleClaim = decodedToken["UserType"] || decodedToken.role;
        const nameClaim = decodedToken["Username"];
        const UID = decodedToken["UID"];

        setUserRole(roleClaim || "User");
        setUserName(nameClaim || "Unknown User");

        fetchUserData(UID);
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserData = async (UID) => {
    try {
      const response = await fetch(`/api/user/${UID}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }
      const data = await response.json();
      console.log("User Data:", data);

      setUserData(data);
      setSurname(data.surname || "Unknown Surname");
      setEmail(data.mail || "example@mail.com");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const toggleProfile = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleLogout = () => {
    console.log("Logout");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  const incrementWorkHours = async () => {
    if (!userData?.id || incrementValue <= 0) {
      setPopupMessage("Invalid input. Please enter a valid number.");
      setIsPopupVisible(true);
      return;
    }

    try {
      const response = await fetch(
        `/api/user/${userData.id}/workhours/${incrementValue}`,
        { method: "PUT" }
      );
      if (!response.ok) {
        throw new Error(`Failed to update work hours: ${response.status}`);
      }

      // Update the work hours locally
      setUserData((prevData) => ({
        ...prevData,
        workHours: prevData.workHours + incrementValue,
      }));
      setPopupMessage(
        `Successfully incremented work hours by ${incrementValue}.`
      );
      setIsPopupVisible(true);
    } catch (error) {
      console.error("Error updating work hours:", error);
      setPopupMessage("Failed to increment work hours.");
      setIsPopupVisible(true);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setPopupMessage("");
  };

  const sidebarOptions = {
    Admin: [
      { label: "Admin Dashboard", path: "/adminPanel" },
      { label: "Coordinator Dashboard", path: "/coordinatorPanel" },
      { label: "Advisor Dashboard", path: "/advisorPanel" },
      { label: "Guide Dashboard", path: "/guidePanel" },
    ],
    Coordinator: [
      { label: "Coordinator Dashboard", path: "/coordinatorPanel" },
      { label: "Advisor Dashboard", path: "/advisorPanel" },
      { label: "Guide Dashboard", path: "/guidePanel" },
    ],
    Advisor: [
      { label: "Advisor Dashboard", path: "/advisorPanel" },
      { label: "Guide Dashboard", path: "/guidePanel" },
    ],
    Guide: [{ label: "Guide Dashboard", path: "/guidePanel" }],
    CandidateGuide: [
      { label: "Candidate Guide Dashboard", path: "/guidePanel" },
    ],
  };

  const navigateToSection = (path) => {
    navigate(path);
  };

  return (
    <div className="leftSideCoorFunction">
      <div className="sidebar">
        <h3>Navigation</h3>
        <ul>
          {sidebarOptions[userRole]?.map((option, index) => (
            <li
              key={index}
              onClick={() => navigateToSection(option.path)}
              style={{
                border: "1px solid white",
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                textAlign: "center",
                backgroundColor: location.pathname.startsWith(option.path)
                  ? "#1e1e64"
                  : "#3c3c82",
                color: location.pathname.startsWith(option.path)
                  ? "white"
                  : "white",
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="bottomSidebarSection">
        <div className={`profileDetails ${isExpanded ? "show" : ""}`}>
          <p>
            <strong>Full Name:</strong>{" "}
            {userData ? `${userData.name} ${userData.surname}` : "Loading..."}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Role:</strong> {userRole}
          </p>
          <p>
            <strong>Work Hour:</strong>{" "}
            {userData ? `${userData.workHours}` : "Loading..."}
          </p>
          <input
            type="number"
            value={incrementValue}
            min={0}
            onChange={(e) => setIncrementValue(parseInt(e.target.value, 10))}
            placeholder="Enter hours to increment"
            style={{
              padding: "12px 15px",
              width: "76%",
              borderRadius: "8px",
              border: "1px solid #ddd",
              outline: "none",
              fontSize: "16px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #007bff")}
            onBlur={(e) => (e.target.style.border = "1px solid #ddd")}
          />
          <button
            onClick={incrementWorkHours}
            style={{
              marginTop: "10px",
              padding: "12px 30px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              height: "80%",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Increment Work Hour
          </button>
        </div>
        <div
          className={`profileSidebarSection ${isExpanded ? "expanded" : ""}`}
          onClick={toggleProfile}
        >
          <img src={profileImage} alt="Profile" />
          <span>{username}</span>
        </div>

        <div className="logoutSidebarSection">
          <button onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>

      {isPopupVisible && (
        <div className="popupOverlay">
          <div className="popupContent">
            <p>{popupMessage}</p>
            <button
              onClick={closePopup}
              style={{
                padding: "10px 20px",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalSidebar;
