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
      // Block numeric keys for text inputs
      if (/^[0-9]$/.test(e.key)) {
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
        min={type === "date" ? minDate : undefined} // Apply minDate for date type
        max={type === "date" ? maxDate : undefined} // Apply maxDate for date type
      />
    </div>
  );
}

export default FormInputGlobal;
