import React, { useState } from "react";
import "./FormTextAreaGlobal.css"; // Import the CSS file

function FormTextAreaGlobal() {
  // Define a state for the text area value
  const [value, setValue] = useState("");

  // Handle the change event to update the value and auto-resize
  const handleInput = (event) => {
    const textarea = event.target;
    // Reset the height to ensure proper calculation
    textarea.style.height = "auto";
    // Set the height based on the scrollHeight
    textarea.style.height = textarea.scrollHeight + "px";
    // Update the state with the current value
    setValue(textarea.value);
  };

  return (
    <div className="form-textarea-container">
      <div className="box">
        <p>Notes (Optional)</p>
      </div>
      <textarea
        className="form-textarea"
        value={value}
        onChange={handleInput}
        placeholder="Type here..."
      ></textarea>
    </div>
  );
}

export default FormTextAreaGlobal;
