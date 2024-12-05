import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./MainPage/MainPage";
import LoginPage from "./LoginPage/LoginPage";
import RegChoicePage from "./RegChoicePage/RegChoicePage";
import RegCodePage from "./RegCodePage/RegCodePage";
import JoinBTOPage from "./JoinBTOPage/JoinBTOPage";
import InviteBilkentPage from "./InviteBilkentPage/InviteBilkentPage";
import IndividualRegistrationPage from "./IndividualRegistrationPage/IndividualRegistrationPage";
import SchoolRegistrationPage from "./SchoolRegistrationPage/SchoolRegistrationPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/regChoice" element={<RegChoicePage />} />
      <Route path="/regCode" element={<RegCodePage />} />
      <Route path="/joinBTO" element={<JoinBTOPage />} />
      <Route path="/inviteBilkent" element={<InviteBilkentPage />} />
      <Route
        path="/individualRegistration"
        element={<IndividualRegistrationPage />}
      />
      <Route path="/schoolRegistration" element={<SchoolRegistrationPage />} />
    </Routes>
  );
}
export default App;
