import "./SchoolRegistrationPage.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
function SchoolRegistrationPage() {
  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"SCHOOL REGISTRATION FORM"} />
      <div className="innerSchoolRegPage">
        <div>
          <FormInputGlobal question="What is your name?" type="date" />
          <FormInputGlobal question="What is your email?" type="email" />
          <FormInputGlobal question="What is your email?" type="email" />
        </div>
        <div className="contactSection">
          <p className="contactInfo"></p>
        </div>
      </div>
    </div>
  );
}
export default SchoolRegistrationPage;
