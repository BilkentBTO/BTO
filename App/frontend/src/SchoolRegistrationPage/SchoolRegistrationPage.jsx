import "./SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";

function SchoolRegistrationPage() {
  const arrayOfOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];
  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"SCHOOL REGISTRATION FORM"} />
      <div className="innerSchoolRegPage">
        <div>
          <FormInputGlobal question="Date:" type="date" />
          <FormInputGlobal question="Name:" type="text" />
          <FormInputGlobal question="Email:" type="email" />
          <FormDropDownGlobal arr={arrayOfOptions} question={"Which Option:"} />
        </div>
        <div className="contactSection">
          <p className="contactInfo"></p>
        </div>
      </div>
    </div>
  );
}
export default SchoolRegistrationPage;
