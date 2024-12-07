import React, { useState, useEffect, useRef } from "react";
import "./FormInputGlobal.css";
import "./FormDropDownGlobal.css";

const SearchableDropdown = ({ array, question, onChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = array.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      <div className="box">
        <p>{question}</p>
      </div>
      <div className="dropdown">
        {/* Dropdown Header */}
        <div
          className="dropdown-header"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedValue || "Select an option"}
        </div>

        {/* Dropdown Menu */}
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
                        onChange(option); // Pass the selected option to the parent component
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

function FormDropDownGlobal({ arr, question, onChange = () => {} }) {
  return (
    <div>
      <SearchableDropdown array={arr} question={question} onChange={onChange} />
    </div>
  );
}

export default FormDropDownGlobal;
