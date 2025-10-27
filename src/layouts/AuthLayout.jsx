import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="bg-body-gradient min-h-screen">
      <Outlet />
    </div>
  );
};

export default AuthLayout;

// import { Outlet } from "react-router-dom";
// import AuthHeader from "../components/AuthHeader";
// import Footer from "../components/Footer";

// const AuthLayout = () => {
//   return (
//         <div>
//             <AuthHeader />
//             <div>
//                 <Outlet />
//             </div>
//             <Footer />
//         </div>
//   );
// };

// export default AuthLayout;
