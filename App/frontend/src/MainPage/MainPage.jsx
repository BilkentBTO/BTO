import MainHeader from "./MainHeader";
import MainRegButton from "./MainRegButton";
import React from "react";
import { useEffect } from "react";
import "./MainPage.css";

function MainPage() {
  useEffect(() => {
    document.title = "Main Page - BTO"; // Set the tab title
  }, []);

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
