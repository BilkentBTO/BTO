import React, { useEffect } from "react";
import "./FormTextAreaGlobal.css"; // Import the CSS file

function FormTextAreaGlobal({ value, onChange, placeholder = "Type here..." }) {
  // Handle the change event to update the value and auto-resize
  const handleInput = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset height for proper resizing
    textarea.style.height = textarea.scrollHeight + "px"; // Adjust height
    if (onChange) {
      onChange(textarea.value);
    }
  };

  useEffect(() => {
    const textarea = document.querySelector(".form-textarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [value]);

  return (
    <div className="form-textarea-container">
      <div className="box">
        <p>Notes (Optional)</p>
      </div>
      <textarea
        className="form-textarea"
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
      ></textarea>
    </div>
  );
}

export default FormTextAreaGlobal;
