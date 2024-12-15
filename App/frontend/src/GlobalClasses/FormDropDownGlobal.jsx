import React, { useState, useEffect, useRef } from "react";
import "./FormInputGlobal.css";
import "./FormDropDownGlobal.css";

const SearchableDropdown = ({
  array = [],
  question = "Default Question",
  onChange = () => {},
  onInput = () => {}, // New prop to handle typing
  initialValue = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState(
    initialValue || (array.length > 0 ? array[0] : "")
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = array
    .filter((option) => option.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 10); 

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
    setSelectedValue(initialValue); // Update when initialValue changes
  }, [initialValue]);

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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onInput(e); // Trigger the onInput callback
                }}
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
                        onChange(option); // Pass the selected option
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

function FormDropDownGlobal({
  arr = [],
  question = "Default Question",
  onChange = () => {},
  onInput = () => {}, // Pass onInput to SearchableDropdown
  initialValue = "",
}) {
  return (
    <div>
      <SearchableDropdown
        array={arr}
        question={question}
        onChange={onChange}
        onInput={onInput} // Forward the onInput event
        initialValue={initialValue}
      />
    </div>
  );
}

export default FormDropDownGlobal;
