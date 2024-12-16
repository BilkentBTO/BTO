import React, { useState, useEffect, useRef } from "react";
import "./FormInputGlobal.css";
import "./FormDropDownGlobal.css";

const SearchableDropdown = ({
  array = [],
  question = "Default Question",
  onChange = () => {},
  onInput = () => {},
  initialValue = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState(initialValue || "");
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

  useEffect(() => {
    setSelectedValue(initialValue); // Update selected value when initialValue changes
  }, [initialValue]);

  const handleSelectOption = (option) => {
    setSearchQuery(option); // Update search query with selected option
    setSelectedValue(option); // Update the selected value
    onChange(option); // Trigger the onChange callback
    setIsOpen(false); // Keep the dropdown open
  };

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      <div className="box">
        <p>{question}</p>
      </div>
      <div className="dropdown">
        {/* Dropdown Header */}
        <div className="dropdown-header" onClick={() => setIsOpen(true)}>
          {selectedValue || "Select an option"}
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="dropdown-menu">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onInput(e); // Trigger the onInput callback
              }}
              placeholder="Search..."
              className="dropdown-search"
            />
            <div className="dropdown-content">
              <ul>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <li key={index} onClick={() => handleSelectOption(option)}>
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

function FormDropDownGlobal({
  arr = [],
  question = "Default Question",
  onChange = () => {},
  onInput = () => {},
  initialValue = "",
}) {
  return (
    <div>
      <SearchableDropdown
        array={arr}
        question={question}
        onChange={onChange}
        onInput={onInput}
        initialValue={initialValue}
      />
    </div>
  );
}

export default FormDropDownGlobal;
