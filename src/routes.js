// Material Dashboard 2 React layouts
import Landing from "layouts/landing/Landing";
import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import NewPassword from "./layouts/authentication/reset-password/NewPassword";
// import Interviewcandidate from "layouts/interviewcandidate/index";
// import Teammembers from "layouts/teammembers/index";

//Admin
import AdminSignIn from "layouts/adminauthentication/authentication/sign-in";
import AdminSignUp from "layouts/adminauthentication/authentication/sign-up";
import AdminDashboard from "layouts/admindashboard/dashboard";
import AdminProfile from "layouts/profile/index";

// @mui icons
import Icon from "@mui/material/Icon";
// import icon from "assets/theme/components/icon";
import UserProfile from "layouts/profile/components/Profiledetails";
import Profile from "layouts/dashboard/components/Profiledetails/index";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "userprofile",
    key: "userprofile",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/userprofile/:id",
    component: <Profile />,
  },
  {
    type: "route",
    name: "Reset Password",
    key: "reset-password",
    route: "/reset-password",
    component: <NewPassword />,
  },
  // {
  //   type: "collapse",
  //   name: "Interview Candidate",
  //   key: "interview-candidate",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/interviewcandidate",
  //   component: <Interviewcandidate />,
  // },
  // {
  //   type: "collapse",
  //   name: "Team Members",
  //   key: "team-memebers",
  //   icon: <Icon fontSize="small">groups</Icon>,
  //   route: "/teammembers",
  //   component: <Teammembers />,
  // },
  {
    type: "collapse",
    name: "Admin Dashboard",
    key: "admin-dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/admin/dashboard",
    component: <AdminDashboard />,
  },
  {
    type: "collapse",
    name: "Admin Sign In",
    key: "admin-sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/admin/sign-in",
    component: <AdminSignIn />,
  },
  {
    type: "collapse",
    name: "Admin Sign Up",
    key: "admin-sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/admin/sign-up",
    component: <AdminSignUp />,
  },
  {
    type: "collapse",
    name: "Admin Profile",
    key: "admin-profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/admin/profile",
    component: <AdminProfile />,
  },
  {
    type: "collapse",
    name: "Admin Profiledetails",
    key: "admin-profiledetails",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/admin/profile/profiledetails/:id",
    component: <UserProfile />,
  },
];

export default routes;
