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
import AvailableToursPage from "./GuidePanel/AvailableToursPage";
import EditAvailableHoursPage from "./GuidePanel/EditAvailableHoursPage";
import ToursResponsibleByGuides from "./AdvisorPanel/ToursResponsibleByGuides";
import GuideRequests from "./AdvisorPanel/GuideRequests";
import ResponsibleTours from "./AdvisorPanel/ResponsibleTours";
import EvaluateTourRequests from "./AdvisorPanel/EvaluateTourRequests";
import ListAllUsers from "./CoordinatorPanel/ListAllUsers";
import ListCoordinatorsPage from "./AdminPanel/ListCoordinatorsPage";
import AddUser from "./CoordinatorPanel/AddUser";
import AssignGuideToFairs from "./CoordinatorPanel/AssignGuideToFairs";
import ManageFairRequests from "./CoordinatorPanel/ManageFairRequests";
import AddCoordinator from "./AdminPanel/AddCoordinatorPage";
import SuccessAddCoordinator from "./AdminPanel/SuccessAddCoordinator";
import DataPanel from "./CoordinatorPanel/DataPanel";
import SuccessAddUser from "./CoordinatorPanel/SuccessAddUser";
import SurveyCodePage from "./SurveyCodePage/SurveyCodePage";
import ViewSurvey from "./ViewSurvey/ViewSurvey";
import SuccessViewSurvey from "./ViewSurvey/SuccessViewSurvey";
import ViewWorkHours from "./CoordinatorPanel/ViewWorkHours";
import ViewAdvisorInfo from "./GuidePanel/ViewAdvisorInfo";
import CandidateGuidePanel from "./CandidateGuidePanel/CandidateGuidePanel";
import AvailableToursCandidate from "./CandidateGuidePanel/AvailableToursCandidate";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
      <Route path="/regChoice" element={<RegChoicePage />} />
      <Route path="/regCode" element={<RegCodePage />} />
      <Route path="/surveyCode" element={<SurveyCodePage />} />
      <Route path="/viewSurvey" element={<ViewSurvey />} />
      <Route path="/joinBTO" element={<JoinBTOPage />} />
      <Route path="/inviteBilkent" element={<InviteBilkentPage />} />
      <Route path="/successViewSurvey" element={<SuccessViewSurvey />} />
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
      <Route
        path="/viewRegistrationDetails"
        element={<ViewRegistrationPage />}
      />
      <Route
        path="/candidateGuidePanel"
        element={
          <RoleProtectedRoute allowedRoles={["CandidateGuide"]}>
            <CandidateGuidePanel />
          </RoleProtectedRoute>
        }
      />

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
        path="/candidateGuidePanel/availableToursCandidate"
        element={
          <RoleProtectedRoute allowedRoles={["CandidateGuide"]}>
            <AvailableToursCandidate />
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
        path="/guidePanel/viewAdvisorInfo"
        element={
          <RoleProtectedRoute
            allowedRoles={[
              "Admin",
              "Coordinator",
              "Guide",
              "Advisor",
              "CandidateGuide",
            ]}
          >
            <ViewAdvisorInfo />
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
      <Route
        path="/advisorPanel/guideRequests"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Coordinator", "Advisor"]}
          >
            <GuideRequests />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/advisorPanel/responsibleTours"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Coordinator", "Advisor"]}
          >
            <ResponsibleTours />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/advisorPanel/evaluateTourRequests"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Coordinator", "Advisor"]}
          >
            <EvaluateTourRequests />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/coordinatorPanel/listAllUsers"
        element={
          <RoleProtectedRoute allowedRoles={["Admin", "Coordinator"]}>
            <ListAllUsers />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/adminPanel/listCoordinators"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <ListCoordinatorsPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/coordinatorPanel/addUser"
        element={
          <RoleProtectedRoute allowedRoles={["Admin", "Coordinator"]}>
            <AddUser />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/coordinatorPanel/assignGuideToFairs"
        element={
          <RoleProtectedRoute allowedRoles={["Admin", "Coordinator"]}>
            <AssignGuideToFairs />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/coordinatorPanel/manageFairRequests"
        element={
          <RoleProtectedRoute allowedRoles={["Admin", "Coordinator"]}>
            <ManageFairRequests />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/coordinatorPanel/successAddUser"
        element={
          <RoleProtectedRoute allowedRoles={["Admin", "Coordinator"]}>
            <SuccessAddUser />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/coordinatorPanel/viewWorkHours"
        element={
          <RoleProtectedRoute allowedRoles={["Admin", "Coordinator"]}>
            <ViewWorkHours />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/adminPanel/addCoordinator"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <AddCoordinator />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/adminPanel/successCoordinatorAdd"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <SuccessAddCoordinator />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/coordinatorPanel/dataPanel"
        element={
          <RoleProtectedRoute allowedRoles={["Admin", "Coordinator"]}>
            <DataPanel />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/userPage"
        element={
          <RoleProtectedRoute
            allowedRoles={[
              "Admin",
              "Coordinator",
              "Guide",
              "Advisor",
              "CandidateGuide",
            ]}
          >
            <UserPage />
          </RoleProtectedRoute>
        }
      />
    </Routes>
  );
}
//Route yourRegistration inputs are temporary
export default App;
