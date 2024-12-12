import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./MainPage/MainPage";
import LoginPage from "./LoginPage/LoginPage";
import ForgotPasswordPage from "./LoginPage/ForgotPasswordPage";
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
import AssignedToursPage from "./GuidePanel/AssignedToursPage";
import CoordinatorPanel from "./CoordinatorPanel/CoordinatorPanel";
import SchoolRegistrationContinuePage from "./SchoolRegistrationPage/SchoolRegistrationContinuePage";
import SchoolRegistrationConfirmation from "./SchoolRegistrationPage/SchoolRegistrationConfirmation";
import SuccessSchoolReg from "./SchoolRegistrationPage/SuccessSchoolReg";
import IndividualConfirmation from "./IndividualRegistrationPage/IndividualConfirmation";
import SuccessIndividualRegistration from "./IndividualRegistrationPage/SuccessIndividualRegistration";
import FairConfirmation from "./InviteBilkentPage/FairConfirmation";
import SuccessInvite from "./InviteBilkentPage/SuccessInvite";
import SuccessJoin from "./JoinBTOPage/SuccessJoin";
import JoinConfirmation from "./JoinBTOPage/JoinConfirmation";
import RoleProtectedRoute from "./RoleProtectedRoute";
import UserPage from "./UserPage/UserPage";
import ManageTour from "./GuidePanel/ManageTour";
import AvailableToursPage from "./GuidePanel/AvailableToursPage";
import EditAvailableHoursPage from "./GuidePanel/EditAvailableHoursPage";
import ToursResponsibleByGuides from "./AdvisorPanel/ToursResponsibleByGuides";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
      <Route path="/regChoice" element={<RegChoicePage />} />
      <Route path="/regCode" element={<RegCodePage />} />
      <Route path="/joinBTO" element={<JoinBTOPage />} />
      <Route path="/inviteBilkent" element={<InviteBilkentPage />} />
      <Route path="/userPage" element={<UserPage />} />

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
      <Route path="/successInvite" element={<SuccessInvite />} />
      <Route path="/joinConfirmation" element={<JoinConfirmation />} />

      <Route
        path="/individualConfirmation"
        element={<IndividualConfirmation />}
      />
      <Route path="/fairConfirmation" element={<FairConfirmation />} />
      <Route
        path="/successIndividualRegistration"
        element={<SuccessIndividualRegistration />}
      />
      <Route path="/successJoin" element={<SuccessJoin />} />
      <Route path="/schoolRegistration" element={<SchoolRegistrationPage />} />
      <Route path="/yourRegistration" element={<ViewRegistrationPage />} />

      <Route
        path="/adminPanel"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <AdminPanel />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/guidePanel"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Coordinator", "Guide", "Advisor"]}
          >
            <GuidePanel />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/advisorPanel"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Coordinator", "Advisor"]}
          >
            <AdvisorPanel />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/coordinatorPanel"
        element={
          <RoleProtectedRoute allowedRoles={["Admin", "Coordinator"]}>
            <CoordinatorPanel />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/guidePanel/assignedFairs"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Coordinator", "Guide", "Advisor"]}
          >
            <AssignedFairsPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/guidePanel/assignedTours/manageTour"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Coordinator", "Guide", "Advisor"]}
          >
            <ManageTour />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/guidePanel/assignedTours"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Coordinator", "Guide", "Advisor"]}
          >
            <AssignedToursPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/guidePanel/availableTours"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Coordinator", "Guide", "Advisor"]}
          >
            <AvailableToursPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/guidePanel/editAvailableHours"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Coordinator", "Guide", "Advisor"]}
          >
            <EditAvailableHoursPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/advisorPanel/toursResponsibleByGuides"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Coordinator", "Advisor"]}
          >
            <ToursResponsibleByGuides />
          </RoleProtectedRoute>
        }
      />
    </Routes>
  );
}
//Route yourRegistration inputs are temporary
export default App;
