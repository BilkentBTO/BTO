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
      />

      {/* Scrollable Table Container */}
      <div className="table-container">
        {/* Table */}
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
              {/* Add column header for the button */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
                {/* Add button in the last column */}
                <td>
                  <button
                    style={buttonStyle}
                    onClick={() => onButtonClick(row)}
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
