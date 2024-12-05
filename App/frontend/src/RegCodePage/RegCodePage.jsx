import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import ButtonHeaderGlobal from "../GlobalClasses/ButtonHeaderGlobal";
import "./RegCode.css";

function RegCodePage() {
  return (
    <div className="regCodePage">
      <HeaderGlobal name={"VIEW YOUR REGISTRATION"}></HeaderGlobal>
      <div className="inputSection">
        <h2 className="inputTitle">Enter Your Registration Code</h2>
        <input type="text" className="inputField" placeholder="Type Code" />
        <button className="inputButton">View</button>
        <ButtonHeaderGlobal
          name={"Go to home page"}
          link="/"
        ></ButtonHeaderGlobal>
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default RegCodePage;
