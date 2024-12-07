import "./FormInputGlobal.css"; // Ensure you import the CSS file

function FormInputGlobal({ question, type, onChange, value = "" }) {
  return (
    <div className="form-input-global">
      <div className="box">
        <p>{question}</p>
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default FormInputGlobal;
