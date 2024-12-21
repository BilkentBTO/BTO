import React, { useState } from "react";
import "./Table.css";

function TableWithButtonConflict({
  headers,
  data,
  onButtonClick,
  buttonStyle,
  defaultButtonName,
}) {
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

  const handleButtonClick = (row) => {
    const isConflict = row[row.length - 2]; // Second-to-last item is `isConflict`
    const conflictId = row[row.length - 1]; // Last item is `conflictId`
    onButtonClick(row, isConflict, conflictId);
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
      <div className="table-container-conflict">
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
            {filteredData.map((row, rowIndex) => {
              const isConflict = row[row.length - 2]; // Second-to-last item is `isConflict`
              const conflictId = row[row.length - 1]; // Last item is `conflictId`
              return (
                <tr
                  key={rowIndex}
                  className={isConflict ? `conflict-${conflictId}` : ""}
                >
                  {row.slice(0, -2).map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                  <td>
                    <button
                      style={{
                        ...buttonStyle,
                        backgroundColor: isConflict
                          ? "orange"
                          : buttonStyle.backgroundColor,
                      }}
                      onClick={() => handleButtonClick(row)}
                    >
                      {isConflict
                        ? `Resolve Conflict ${conflictId}`
                        : defaultButtonName}
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan={headers.length + 1}>No matching data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableWithButtonConflict;
