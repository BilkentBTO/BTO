import React, { useState, useEffect } from "react";
import "./Table.css";

const Table = ({ headers, data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  // Update filteredData whenever data or searchTerm changes
  useEffect(() => {
    const filtered = data.filter((row) =>
      row.some((cell) =>
        cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [data, searchTerm]);

  // Handle search input change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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

      {/* Table */}
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                }}
              >
                {header}
              </th>
            ))}
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
            </tr>
          ))}
          {/* Handle case where no data matches */}
          {filteredData.length === 0 && (
            <tr>
              <td
                colSpan={headers.length}
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
  );
};

export default Table;
