import React, { useState, useEffect } from "react";
import "./ListCoordinatorsPage.css";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";

function ListCoordinatorsPage() {
  const headers = ["ID", "Name", "Surname", "EMail", "User Type"];

  const [data, setData] = useState([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/filter/1");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiData = await response.json();
        setData(apiData);
      } catch (error) {
        console.error("Error fetching tours data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (coordinatorData) => {
    setSelectedCoordinator(coordinatorData);
  };

  const handleClosePopup = () => {
    setSelectedCoordinator(false);
  };

  const handleDeleteCoordinator = async (id) => {
    try {
      await fetch(`/api/user/${id}`, {
        method: "DELETE",
      });
      fetchTourRequests();
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
    handleClosePopup();
    refresh();
  };

  const refresh = () => {
    window.location.reload();
  };

  const buttonStyle = {
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

  const getUserTypeString = (userType) => {
    if (userType == 1) {
      return "Coordinator";
    } else {
      return "N/A";
    }
  };

  return (
    <div className="listAllUsers">
      <GlobalSidebar />
      <div className="rightSideAdminFunction">
        <HeaderPanelGlobal name={"ADMIN PANEL"} />
        <div>
          <h1 className="listAllUsersHeading">List All Coordinators</h1>
          {data.length > 0 ? (
            <TableWithButtons
              headers={headers}
              data={data.map((item) => [
                item.id || "N/A",
                item.name || "N/A",
                item.surname || "N/A",
                item.mail || "N/A",
                getUserTypeString(item.userType),
              ])}
              onButtonClick={(row) => handleRowClick(row)}
              buttonStyle={buttonStyle}
              buttonName="Manage"
            />
          ) : (
            <p className="noDataText">No Users</p>
          )}
        </div>

        {/* Coordinator Information Popup */}
        {selectedCoordinator && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Coordinator Information</h2>
              <table className="popupTable">
                <tbody>
                  <tr>
                    <td>
                      <strong>Name</strong>
                    </td>
                    <td>{selectedCoordinator[0]}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Surname</strong>
                    </td>
                    <td>{selectedCoordinator[1]}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Username</strong>
                    </td>
                    <td>{selectedCoordinator[2]}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Email</strong>
                    </td>
                    <td>{selectedCoordinator[3]}</td>
                  </tr>
                </tbody>
              </table>
              <div className="popupActions">
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
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                  onClick={() => {
                    handleDeleteCoordinator(selectedCoordinator[0]);
                  }}
                >
                  Delete Coordinator
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
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                  className="closeButton"
                  onClick={handleClosePopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListCoordinatorsPage;
