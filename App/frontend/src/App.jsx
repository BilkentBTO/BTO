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
import ViewRegistrationPage from "./ViewRegistrationPage/ViewRegistrationPage";
import GuidePanel from "./GuidePanel/GuidePanel";
import AdvisorPanel from "./AdvisorPanel/AdvisorPanel";
import AdminPanel from "./AdminPanel/AdminPanel";
import AssignedFairsPage from "./GuidePanel/AssignedFairsPage";
import CoordinatorPanel from "./CoordinatorPanel/CoordinatorPanel";
import SchoolRegistrationContinuePage from "./SchoolRegistrationPage/SchoolRegistrationContinuePage";
import SchoolRegistrationConfirmation from "./SchoolRegistrationPage/SchoolRegistrationConfirmation";
import SuccessSchoolReg from "./SchoolRegistrationPage/SuccessSchoolReg";
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
        path="/continueSchoolReg"
        element={<SchoolRegistrationContinuePage />}
      />
      <Route
        path="/schoolConfirmation"
        element={<SchoolRegistrationConfirmation />}
      />
      <Route
        path="/individualRegistration"
        element={<IndividualRegistrationPage />}
      />
      <Route path="/successSchoolRegistration" element={<SuccessSchoolReg />} />
      <Route path="/schoolRegistration" element={<SchoolRegistrationPage />} />
      <Route path="/yourRegistration" element={<ViewRegistrationPage />} />
      <Route path="/guidePanel" element={<GuidePanel />} />
      <Route path="/advisorPanel" element={<AdvisorPanel />} />
      <Route path="/coordinatorPanel" element={<CoordinatorPanel />} />
      <Route path="/adminPanel" element={<AdminPanel />} />
      <Route path="/assignedFairs" element={<AssignedFairsPage />} />
    </Routes>
  );
}
//Route yourRegistration inputs are temporary
export default App;
