import React, { useState } from "react";
import "./Table.css";

const TableWithButtons = ({
  headers,
  data,
  onButtonClick,
  buttonStyle, // Default button styles
  buttonName, // Default button name
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  // Handle search input change
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter data based on search term
    const filtered = data.filter((row) =>
      row.some(
        (cell) => cell.toString().toLowerCase().includes(term) // Check if cell includes the search term
      )
    );

    setFilteredData(filtered);
  };

  return (
    <div style={{ margin: "20px" }}>
      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search"
        className="searchBar"
        style={{
          marginBottom: "10px",
          padding: "8px",
          width: "50%",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Scrollable Table Container */}
      <div
        className="scrollable-table"
        style={{
          maxHeight: "400px", // Adjust height as needed
          overflowY: "auto", // Vertical scroll
          border: "1px solid #ddd", // Optional border around the scrollable area
        }}
      >
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#f2f2f2",
              zIndex: 1,
            }}
          >
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                  }}
                >
                  {header}
                </th>
              ))}
              {/* Add column header for the button */}
              <th
                style={{
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                    }}
                  >
                    {cell}
                  </td>
                ))}
                {/* Add button in the last column */}
                <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => onButtonClick(row)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#4caf50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      ...buttonStyle, // Merge custom button styles
                    }}
                  >
                    {buttonName} {/* Use custom button name */}
                  </button>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length + 1} // Include the button column in colspan
                  style={{
                    textAlign: "center",
                    padding: "8px",
                    fontStyle: "italic",
                  }}
                >
                  No matching data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableWithButtons;
