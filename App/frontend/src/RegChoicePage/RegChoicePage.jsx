import MainRegButton from "../MainPage/MainRegButton";
import "./RegChoicePage.css";
import { useEffect } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";

function RegChoicePage() {
  useEffect(() => {
    document.title = "Registration Selection - BTO"; // Set the tab title
  }, []);

  return (
    <div className="regChoicePage">
      <HeaderGlobal name={"REGISTRATION FORM"} />
      <p className="filler">REGISTRATION TYPE</p>
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
