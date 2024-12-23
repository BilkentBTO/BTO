import "./FormInputGlobal.css";

function FormInputGlobal({
  question,
  type,
  onChange,
  value = "",
  dateFilter = {},
  properities = {},
}) {
  const minValue = type === "number" && properities.isPos ? 0 : dateFilter.min || ""; // Default to empty if no min val is provided
  const maxDate = dateFilter.max || ""; // Default to empty if no max date is provided
  const checkStr = properities.isNum || false; // Default to false if the parameter is not set

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
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
      // Block numeric keys for text inputs if isNum property is not set
      if (!checkStr && /^[0-9]$/.test(e.key)) {
        e.preventDefault();
        alert("Numbers are not allowed in this field.");
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
        onKeyDown={handleKeyDown}
        min={type === "date" || type === "number" ? minValue : undefined} // Apply minDate for date type
        max={type === "date" ? maxDate : undefined} // Apply maxDate for date type
      />
    </div>
  );
}

export default FormInputGlobal;
