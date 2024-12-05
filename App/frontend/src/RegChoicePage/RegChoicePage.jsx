import MainRegButton from "../MainPage/MainRegButton";
import "./RegChoicePage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";

function RegChoicePage() {
  return (
    <div className="regChoicePage">
      <HeaderGlobal name={"REGISTRATION FORM"} />
      <div className="buttonRegChoiceSection">
        <MainRegButton name="SCHOOL REGISTRATION" link="/schoolRegistration" />
        <MainRegButton
          name="INDIVIDUAL REGISTRATION"
          link="/individualRegistration"
        />
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default RegChoicePage;
