import "./FormInputGlobal.css"; // Ensure you import the CSS file

function FormInputGlobal({ question, type, onChange }) {
  return (
    <div className="form-input-global">
      <div className="box">
        <p>{question}</p>
      </div>
      <input type={type} onChange={onChange}></input>
    </div>
  );
}

export default FormInputGlobal;
