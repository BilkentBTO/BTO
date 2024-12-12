import "./FormInputGlobal.css"; // Ensure you import the CSS file

function FormInputGlobal({
  question,
  type,
  onChange,
  value = "",
  dateFilter = {},
}) {
  const minDate = dateFilter.min || ""; // Default to empty if no min date is provided
  const maxDate = dateFilter.max || ""; // Default to empty if no max date is provided

  return (
    <div className="form-input-global">
      <div className="box">
        <p>{question}</p>
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={type === "date" ? minDate : undefined} // Apply minDate for date type
        max={type === "date" ? maxDate : undefined} // Apply maxDate for date type
      />
    </div>
  );
}

export default FormInputGlobal;
