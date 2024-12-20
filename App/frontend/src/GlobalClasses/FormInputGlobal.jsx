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
      return;
    }

    // If valid, pass the selected date to the onChange handler
    onChange(selectedDate);
  };

  const filterWeekendDates = (e) => {
    const dayOfWeek = new Date(e.target.value).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      e.preventDefault(); // Prevent the weekend date from being selected
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
          type === "date" ? handleDateChange(e) : onChange(e.target.value)
        }
        onKeyDown={type === "date" ? filterWeekendDates : undefined}
        min={type === "date" ? minDate : undefined} // Apply minDate for date type
        max={type === "date" ? maxDate : undefined} // Apply maxDate for date type
      />
    </div>
  );
}

export default FormInputGlobal;
