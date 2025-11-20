import { Route, Routes } from "react-router-dom";
import QuestionsAnswerShit from "./components/QuestionsAnswerShit";
import QuizQuestionInterface from "./components/QuizQuestionInterface";
import QuizTable from "./components/QuizTable";
import AuthLayout from "./layouts/AuthLayout";
import CommonLayout from "./layouts/CommonLayout";
import PresidentLayout from "./layouts/PresidentLayout";
import StudentLayout from "./layouts/StudentLayout";
import TutorLayout from "./layouts/TutorLayout";
import CategorySelection from "./pages/auth/CategorySelection";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotPasswordOtp from "./pages/auth/ForgotPasswordOtp";
import Login from "./pages/auth/Login";
import OtpVarify from "./pages/auth/OtpVarify";
import Registration from "./pages/auth/Registration";
import Home from "./pages/home/Home";
import ClosedQuiz from "./pages/landing-pages/ClosedQuiz";
import WinnerAnnouncement from "./pages/landing-pages/WinnerAnnouncement";
import WinnerAnnouncementDetails from "./pages/landing-pages/WinnerAnnouncementDetails";
import AiQuestionMaker from "./pages/presidentDashboard/AiQuestionMaker";
import AnnouncementCreationForm from "./pages/presidentDashboard/AnnouncementCreationForm";
import CreateMixQuestion from "./pages/presidentDashboard/CreateMixQuestion";
import AllRoundList from "./pages/presidentDashboard/events/AllRoundList";
import CreateEventCreationForm from "./pages/presidentDashboard/events/CreateEventCreationForm";
import EventQuestionMaker from "./pages/presidentDashboard/events/EventQuestionMaker";
import PresidentEvents from "./pages/presidentDashboard/events/PresidentEvents";
import RoundCreateForm from "./pages/presidentDashboard/events/RoundCreateForm";
import RoundDetails from "./pages/presidentDashboard/events/RoundDetails";
import PresidentAnnouncementList from "./pages/presidentDashboard/PresidentAnnouncementList";
import PresidentProfile from "./pages/presidentDashboard/PresidentProfile";
import RoundCreationForm from "./pages/presidentDashboard/RoundCreationForm";
import RoundList from "./pages/presidentDashboard/RoundList";
import SharedQuestionsPresident from "./pages/presidentDashboard/SharedQuestionsPresident";
import QuizDetails from "./pages/QuizDetails/QuizDetails";
import AllAnnouncementList from "./pages/student/AllAnnouncementList";
import AllParticipationList from "./pages/student/AllParticipationList";
import Dashboard from "./pages/student/Dashboard";
import MyAnnouncement from "./pages/student/MyAnnouncement";
import QuizQuestionPaper from "./pages/student/roundAnnouncement/QuizQuestionPaper";
import RoundAnnouncement from "./pages/student/roundAnnouncement/RoundAnnouncement";
import RoundParticipationDetails from "./pages/student/RoundParticipationDetails";
import StudentDashboard from "./pages/student/StudentDashboard";
import AiQuestionsMaker from "./pages/tutor/AiQuestionsMaker";
import ManualQuestionMaker from "./pages/tutor/ManualQuestionMaker";
import SharedQuestions from "./pages/tutor/SharedQuestions";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import TutorProfile from "./pages/tutor/TutorProfile";
import RouteRestriction from "./routes/RouteRestriction";

function App() {
  return (
    <Routes>
      {/* auth Pages with AuthLayout */}
      <Route element={<RouteRestriction type="public" />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/category-list" element={<CategorySelection />} />
          <Route path="/forgot-password-otp" element={<ForgotPasswordOtp />} />
          <Route path="/otp-varify" element={<OtpVarify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Route>

      {/* landing pages */}
      <Route path="/" element={<Home />} />
      <Route path="/winner-announcement" element={<WinnerAnnouncement />} />
      <Route path="/winners-details" element={<WinnerAnnouncementDetails />} />
      <Route path="/closed-quiz" element={<ClosedQuiz />} />
      <Route path="/quiz-details/:quizId" element={<QuizDetails />}></Route>
      <Route path="/common-layout" element={<CommonLayout />}></Route>

      {/* President Pages with PresidentLayout */}
      <Route element={<RouteRestriction type="private" role="president" />}>
        <Route element={<PresidentLayout />}>
          <Route
            path="/president/dashboard"
            element={<PresidentAnnouncementList />}
          />
          <Route path="/president/events" element={<PresidentEvents />} />
          {/* make mix quesiton path */}
          <Route
            path="/president/create-quiz/mix/:roundId/:annId"
            element={<CreateMixQuestion />}
          />
          <Route path="/president/profile" element={<PresidentProfile />} />
          <Route
            path="/president/create-quiz/ai/:roundId/:annId"
            element={<AiQuestionMaker />}
          />
          <Route
            path="/president/create-quiz-event/ai/:roundId/:annId"
            element={<EventQuestionMaker />}
          />
          <Route
            path="/president/create-quiz/shared/:roundId/:annId"
            element={<SharedQuestionsPresident />}
          />
          <Route
            path="/president/announcement-list"
            element={<PresidentAnnouncementList />}
          />
          <Route path="/president/rounds/:id?" element={<RoundList />} />
          <Route path="/president/all-rounds/:id?" element={<AllRoundList />} />
          <Route
            path="/president/announcement-creation-form/:id?"
            element={<AnnouncementCreationForm />}
          />
          <Route
            path="/president/event-creation-form/:id?"
            element={<CreateEventCreationForm />}
          />
          <Route
            path="/president/round-creation-form/:id"
            element={<RoundCreationForm />}
          />
          <Route
            path="/president/round-create-form/:id"
            element={<RoundCreateForm />}
          />
          <Route
            path="/president/round-details/:id?"
            element={<RoundDetails />}
          />
          <Route
            path="/president/quiz-question-interface"
            element={<QuizQuestionInterface />}
          />
        </Route>
      </Route>

      {/* Tutor Pages with TutorLayout */}
      <Route element={<RouteRestriction type="private" role="tutor" />}>
        <Route element={<TutorLayout />}>
          <Route path="/tutor/dashboard" element={<TutorDashboard />} />
          <Route
            path="/tutor/question-maker/:announcementId?"
            element={<AiQuestionsMaker />}
          />
          <Route path="/tutor/profile" element={<TutorProfile />} />
          <Route path="/tutor/share-questions" element={<SharedQuestions />} />
          <Route
            path="/tutor/manual-question-maker/:announcementId"
            element={<ManualQuestionMaker />}
          />
        </Route>
      </Route>

      {/* Student Pages with StudentLayout */}
      <Route element={<RouteRestriction type="private" role="student" />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<Dashboard />} />
          <Route path="/student/profile" element={<StudentDashboard />} />
          {/* <Route path="/student/dashboard" element={<StudentDashboard />} /> */}
          {/* <Route
            path="/student/announcement-list"
            element={<AnnouncementList />}
          /> */}
          <Route
            path="/student/all-announcement"
            element={<AllAnnouncementList />}
          />
          <Route path="/student/my-announcement" element={<MyAnnouncement />} />
          <Route
            path="/student/participation-list"
            element={<AllParticipationList />}
          />
          <Route
            path="/student/announcement-round/:quizId"
            element={<RoundAnnouncement />}
          />
          <Route
            path="/student/participation-details/:round"
            element={<RoundParticipationDetails />}
          />

          <Route path="/quiz-details/:id" element={<QuestionsAnswerShit />} />
          <Route path="/quiz-table" element={<QuizTable />} />
        </Route>
        <Route path="/quiz/:round/:quizId" element={<QuizQuestionPaper />} />
        <Route
          path="/quiz-answer/:roundId?"
          element={<QuestionsAnswerShit />}
        />
      </Route>

      {/* <Route element={<PrivateRoute />}>
        </Route> */}
      {/* this is private route applayout and president layout goes to under the private route */}

      {/* Not Found */}
      {/* <Route path="*" element={<h1>404 | Not Found</h1>} /> */}
    </Routes>
  );
}

export default App;
