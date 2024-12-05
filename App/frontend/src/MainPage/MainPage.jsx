import MainHeader from "./MainHeader";
import MainRegButton from "./MainRegButton";
import "./MainPage.css";

function MainPage() {
  return (
    <div className="mainPage">
      <MainHeader />
      <p className="welcomeText">WELCOME TO BILKENT</p>
      <div className="buttonRegSection">
        <MainRegButton name="Fill Registration Form" link="/regChoice" />
        <MainRegButton name="View Registration" link="/regCode" />
      </div>
      <div className="contactSection">
        <p className="contactInfo">Contact Us: 0312 290 29 29</p>
      </div>
    </div>
  );
}

export default MainPage;
