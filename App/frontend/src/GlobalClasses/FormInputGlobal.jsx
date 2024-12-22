import "./FormInputGlobal.css";

function FormInputGlobal({
  question,
  type,
  onChange,
  value = "",
  dateFilter = {},
}) {
  const minDate = dateFilter.min || ""; // Default to empty if no min date is provided
  const maxDate = dateFilter.max || ""; // Default to empty if no max date is provided

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const dayOfWeek = new Date(selectedDate).getDay();

    // Block selection of weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      onChange(""); // Reset the input value
      e.target.value = ""; // Reset the displayed value in the input field
      alert("Weekends are not allowed.");
      return;
    }

    // If valid, pass the selected date to the onChange handler
    onChange(selectedDate);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;

    // For number type, validate immediately
    if (type === "number") {
      if (isNaN(value)) {
        alert("Only numeric values are allowed.");
        return;
      }
    }

    // Allow input for all types but validate on blur for email
    onChange(value);
  };

  const handleBlur = (e) => {
    const { value } = e.target;

    // Validate email only on blur
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        onChange(""); // Clear the invalid email value
      }
    }
  };

  const handleKeyDown = (e) => {
    if (type === "number") {
      // Allow only numeric keys, backspace, delete, tab, arrow keys, and '.' (for decimals)
      const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        ".",
      ];
      if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
        e.preventDefault();
      }
    }

    if (type === "text") {
      // Block numeric keys for text inputs
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        alert("Numbers are not allowed in this field.");
      }
    }
    if (type === "date") {
      // Block weekend date selection
      const dayOfWeek = new Date(e.target.value).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="form-input-global">
      <div className="box">
        <p>{question}</p>
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          type === "date" ? handleDateChange(e) : handleInputChange(e)
        }
        onBlur={handleBlur} // Validate email only on blur
        onKeyDown={handleKeyDown}
        min={type === "date" ? minDate : undefined} // Apply minDate for date type
        max={type === "date" ? maxDate : undefined} // Apply maxDate for date type
      />
    </div>
  );
}

export default FormInputGlobal;
