import React from "react";
import "./Table.css";

const Table = ({ headers, data }) => {
  return (
    <div
      style={{
        maxHeight: "400px", // Set max height to restrict table height
        overflowY: "auto", // Enable vertical scrolling if content overflows
        overflowX: "auto", // Enable horizontal scrolling if content overflows
        border: "1px solid black", // Optional: Add border around the table container
      }}
    >
      <table className="table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
