import React, { useState } from "react";
import "./FormInputGlobal.css";
import "./FormDropDownGlobal.css";

const SearchableDropdown = ({ array, question }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = array.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dropdown-wrapper">
      <div className="box">
        <p>{question}</p>
      </div>
      <div className="dropdown">
        <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
          {selectedValue || "Select an option"}
        </div>
        {isOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-content">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="dropdown-search"
              />
              <ul>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSelectedValue(option);
                        setIsOpen(false);
                      }}
                    >
                      {option}
                    </li>
                  ))
                ) : (
                  <li>No options found</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function FormDropDownGlobal({ arr, question }) {
  return (
    <div>
      <SearchableDropdown array={arr} question={question} />
    </div>
  );
}

export default FormDropDownGlobal;
