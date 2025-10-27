// src/routes/RouteRestriction.jsx
import { Navigate, Outlet } from "react-router-dom";
import { PATH } from "./PATH";

const RouteRestriction = ({ type, role }) => {
  const UserData = JSON.parse(localStorage.getItem("UserData") || "{}");
  const isAuthenticated = Boolean(UserData?.access);
  const userRole = UserData?.role;

  // Private route: if token not available and unauthorize then redirect to login page
  if (type === "private" && !isAuthenticated) {
    return <Navigate to={PATH.login} replace />;
  }

  // Private route: role and type match and redirect to pages
  if (type === "private" && role && userRole !== role) {
    if (userRole === "student")
      return <Navigate to={PATH.studentDashboard} replace />;
    if (userRole === "tutor")
      return <Navigate to={PATH.tutorDashboard} replace />;
    if (userRole === "president")
      return <Navigate to={PATH.presidentDashboard} replace />;
    return <Navigate to={PATH.login} replace />;
  }

  // Public route: already logged in
  if (type === "public" && isAuthenticated) {
    if (userRole === "student")
      return <Navigate to={PATH.studentDashboard} replace />;
    if (userRole === "tutor")
      return <Navigate to={PATH.tutorDashboard} replace />;
    if (userRole === "president")
      return <Navigate to={PATH.presidentDashboard} replace />;
  }

  // Allowed route
  return <Outlet />;
};

export default RouteRestriction;

// import { Navigate, Outlet } from "react-router-dom";
// import { PATH } from "./PATH";

// const RouteRestriction = ({ type, role }) => {
//   const UserData = JSON.parse(localStorage.getItem("UserData") || "{}");
//   console.log("UserData", UserData);

//   const isAuthenticated = UserData && UserData.access;
//   const userRole = UserData?.role; // Example: "student", "tutor", "president"

//   // If it's a private route and user not logged in
//   if (type === "private" && !isAuthenticated) {
//     return <Navigate to={PATH.login} replace />;
//   }

//   // If it's a private route but role doesn't match
//   if (type === "private" && role && userRole !== role) {
//     // Redirect to correct dashboard
//     if (userRole === "student")
//       return <Navigate to={PATH.studentDashboard} replace />;
//     if (userRole === "tutor")
//       return <Navigate to={PATH.tutorDashboard} replace />;
//     if (userRole === "president")
//       return <Navigate to={PATH.presidentDashboard} replace />;
//     return <Navigate to={PATH.login} replace />;
//   }

//   // If it's a public route but user is already logged in
//   if (type === "public" && isAuthenticated) {
//     if (userRole === "student")
//       return <Navigate to={PATH.studentDashboard} replace />;
//     if (userRole === "tutor")
//       return <Navigate to={PATH.tutorDashboard} replace />;
//     if (userRole === "president")
//       return <Navigate to={PATH.presidentDashboard} replace />;
//   }

//   return <Outlet />;
// };

// export default RouteRestriction;
