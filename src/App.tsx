import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Loading } from "./components";
import { ROUTES } from './interfaces/enums';

const NotFound = lazy(() => import("./pages/not-found/NotFound"));
const AuthLayout = lazy(() => import("./pages/auth/AuthLayout"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const RedefinePassword = lazy(() => import("./pages/auth/RedefinePassword"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const ConfirmSignUp = lazy(() => import("./pages/auth/ConfirmSignUp"));

const Layout = lazy(() => import("./pages/layout/Layout"));
const Home = lazy(() => import("./pages/home/Home"));
const Alerts = lazy(() => import("./pages/alerts/Alerts"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const ProfileCognito = lazy(() => import("./pages/profile/ProfileCognito"));
const PlanSelection = lazy(() => import("./pages/plan-selection/PlanSelection"));
const EventForm = lazy(() => import("./pages/events/EventForm"));
const EventDetails = lazy(() => import("./pages/events/EventDetails"));
const SurveysAdd = lazy(() => import("./pages/surverys/SurveysAdd"));
const SurveysEdit = lazy(() => import("./pages/surverys/SurveysEdit"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.SIGNIN} element={<SignIn />} />
          <Route path={ROUTES.FORGOTPASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.REDEFINEPASSWORD} element={<RedefinePassword />} />
          <Route path={ROUTES.SIGNUP} element={<SignUp />} />
          <Route path={ROUTES.CONFIRMSIGNUP} element={<ConfirmSignUp />} />
        </Route>
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ALERTS} element={<Alerts />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.PROFILE_ADVANCED} element={<ProfileCognito />} />
          <Route path={ROUTES.NEW} element={<PlanSelection />} />
          <Route path={`${ROUTES.NEW}/:name`} element={<EventForm />} />
          <Route path={`${ROUTES.EVENTS}/:eventID`} element={<EventDetails />} />
          <Route path={`${ROUTES.SUBSCRIPTIONS}/:eventID`} element={<EventDetails />} />
          <Route path={`${ROUTES.EDIT}/:eventID`} element={<EventForm />} />
          <Route path={`${ROUTES.SURVEYS}/adicionar/:eventID`} element={<SurveysAdd />} />
          <Route path={`${ROUTES.SURVEYS}/edit/:surveyID/:language`} element={<SurveysEdit />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
