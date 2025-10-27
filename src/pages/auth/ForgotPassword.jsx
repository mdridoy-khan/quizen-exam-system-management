import { useFormik } from "formik";
import { useState } from "react";
import { HiMiniExclamationCircle } from "react-icons/hi2";
import { IoCloseOutline, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import API from "../../api/API";
import { API_ENDPOINS } from "../../api/ApiEndpoints";
import FormImage from "../../assets/auth/authBg.jpg";

const ForgotPassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  // Yup validation schema
  // const validationSchema = Yup.object({
  //   newPassword: Yup.string()
  //     .required("New Password is required")
  //     .min(8, "Password must be at least 8 characters")
  //     .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  //     .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  //     .matches(/\d/, "Password must contain at least one number")
  //     .matches(
  //       /[!@#$%^&*(),.?":{}|<>]/,
  //       "Password must contain at least one special character"
  //     ),
  //   confirmPassword: Yup.string()
  //     .required("Confirm Password is required")
  //     .oneOf([Yup.ref("newPassword", "Passwords must match"),
  // });
  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      setApiError("");
      setSuccess("");

      if (!email) {
        setApiError(
          "No email provided. Please try again from the forgot password page."
        );
        setLoading(false);
        return;
      }

      const payload = {
        gmail: email,
        password: values.newPassword,
        confirm_password: values.confirmPassword,
      };

      API.post(API_ENDPOINS.FORGOT_PASSWORD, payload)
        .then((res) => {
          const successMessage = res.data.message;
          if (successMessage) {
            setSuccess(successMessage);
          }
          // Delay navigation to show the success message
          setTimeout(() => {
            navigate("/login");
          }, 1000); // 1-second delay
        })
        .catch((err) => {
          console.error(err);
          const msg =
            err.response?.data?.message ||
            "No account found with the given Gmail address";
          setApiError(msg);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center min-h-screen py-10">
          <div className="flex bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl w-full">
            <div className="hidden lg:block w-[45%]">
              <img
                src={FormImage}
                alt="Signup Illustration"
                class="w-full h-full object-cover"
              />
            </div>
            <div className="max-w-4xl mx-auto flex-1 p-10 flex-col justify-center">
              <div className="flex items-center justify-center h-full">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2">
                      Change Your Password
                    </h3>
                    <span className="text-base text-gray-500 block">
                      Do not share your password!
                    </span>
                  </div>

                  {/* API Error/Success Message Display */}
                  {(apiError || success) && (
                    <div className="flex items-center justify-center mb-5">
                      <div
                        className={`flex items-center justify-between rounded py-1 px-2 max-w-md w-full ${
                          apiError ? "bg-pink-200" : "bg-green-100"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-[#681923]">
                          {apiError && <HiMiniExclamationCircle size={20} />}
                          <span className="block">{apiError || success}</span>
                        </div>
                        <button
                          onClick={() => {
                            setApiError("");
                            setSuccess("");
                          }}
                        >
                          <IoCloseOutline size={20} />
                        </button>
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={formik.handleSubmit}
                    noValidate
                    className="form space-y-4"
                  >
                    {/* New Password */}
                    <div className="form-item relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        autoComplete="off"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.newPassword}
                        className={`outline-none shadow-none w-full pr-10 border-b ${
                          formik.touched.newPassword &&
                          formik.errors.newPassword
                            ? "border-primary"
                            : "border-gray-300"
                        }`}
                      />
                      <label
                        htmlFor="newPassword"
                        className="absolute left-3 -top-[10px] text-gray500 text-sm select-none pointer-events-none"
                      >
                        New Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray500"
                      >
                        {showNewPassword ? (
                          <IoEyeOutline size={20} />
                        ) : (
                          <IoEyeOffOutline size={20} />
                        )}
                      </button>
                    </div>
                    {formik.touched.newPassword &&
                      formik.errors.newPassword && (
                        <div className="text-primary text-xs">
                          {formik.errors.newPassword}
                        </div>
                      )}

                    {/* Confirm Password */}
                    <div className="form-item relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        autoComplete="off"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        className={`outline-none shadow-none w-full pr-10 border-b ${
                          formik.touched.confirmPassword &&
                          formik.errors.confirmPassword
                            ? "border-primary"
                            : "border-gray-300"
                        }`}
                      />
                      <label
                        htmlFor="confirmPassword"
                        className="absolute left-3 -top-[10px] text-gray-500 text-sm select-none pointer-events-none"
                      >
                        Confirm Password
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? (
                          <IoEyeOutline size={20} />
                        ) : (
                          <IoEyeOffOutline size={20} />
                        )}
                      </button>
                    </div>
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <div className="text-primary text-xs">
                          {formik.errors.confirmPassword}
                        </div>
                      )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-gradient-to-r from-primary to-secondary block w-full rounded-md text-white p-2 transition ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

// import { useFormik } from "formik";
// import { useState } from "react";
// import { HiMiniExclamationCircle } from "react-icons/hi2";
// import { IoCloseOutline, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import Eduwise from "../../assets/icons/eduwise.png";
// import Facebook from "../../assets/icons/facebook.png";
// import Github from "../../assets/icons/github.png";
// import Google from "../../assets/icons/google.png";
// import TutorWise from "../../assets/icons/tutorwise.png";

// const ForgotPassword = () => {
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   const email = location.state?.email || "";

//   // Yup validation schema
//   // const validationSchema = Yup.object({
//   //   newPassword: Yup.string()
//   //     .required("New Password is required")
//   //     .min(8, "Password must be at least 8 characters")
//   //     .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
//   //     .matches(/[a-z]/, "Password must contain at least one lowercase letter")
//   //     .matches(/\d/, "Password must contain at least one number")
//   //     .matches(
//   //       /[!@#$%^&*(),.?":{}|<>]/,
//   //       "Password must contain at least one special character"
//   //     ),
//   //   confirmPassword: Yup.string()
//   //     .required("Confirm Password is required")
//   //     .oneOf([Yup.ref("newPassword", "Passwords must match"),
//   // });
//   const validationSchema = Yup.object({
//     newPassword: Yup.string()
//       .required("New Password is required")
//       .min(8, "Password must be at least 8 characters")
//       .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
//       .matches(/[a-z]/, "Password must contain at least one lowercase letter")
//       .matches(/\d/, "Password must contain at least one number")
//       .matches(
//         /[!@#$%^&*(),.?":{}|<>]/,
//         "Password must contain at least one special character"
//       ),
//     confirmPassword: Yup.string()
//       .required("Confirm Password is required")
//       .oneOf([Yup.ref("newPassword")], "Passwords must match"),
//   });

//   const formik = useFormik({
//     initialValues: {
//       newPassword: "",
//       confirmPassword: "",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       setLoading(true);
//       setApiError("");
//       setSuccess("");

//       if (!email) {
//         setApiError(
//           "No email provided. Please try again from the forgot password page."
//         );
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         gmail: email,
//         password: values.newPassword,
//         confirm_password: values.confirmPassword,
//       };

//       API.post(API_ENDPOINS.FORGOT_PASSWORD, payload)
//         .then((res) => {
//           const successMessage = res.data.message;
//           if (successMessage) {
//             setSuccess(successMessage);
//           }
//           // Delay navigation to show the success message
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000); // 1-second delay
//         })
//         .catch((err) => {
//           console.error(err);
//           const msg =
//             err.response?.data?.message ||
//             "No account found with the given Gmail address";
//           setApiError(msg);
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     },
//   });

//   return (
//     <>
//       <div className="container mx-auto px-4 mb-20">
//         <div className="text-center mb-10 lg:mb-16">
//           <h3 className="text-xl lg:text-2xl font-semibold mb-0">
//             Create a FleekQuiz Account
//           </h3>
//           <p className="text-sm">
//             Already have an Account?{" "}
//             <Link
//               to="/login"
//               className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 px-1 rounded text-white"
//             >
//               log in
//             </Link>
//           </p>
//         </div>
//         <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <div className="space-y-4 mb-6 lg:mb-0">
//             <h3 className="text-base lg:text-lg text-black600 font-medium relative">
//               Login with TutorWise / EduWise / Social Profile
//             </h3>
//             <div className="flex items-center gap-1">
//               <a href="#" className="flex">
//                 <img
//                   src={Eduwise}
//                   alt="eduwise logo"
//                   className="h-20 border border-black600"
//                 />
//               </a>
//               <a href="#" className="flex">
//                 <img
//                   src={TutorWise}
//                   alt="tutorwise logo"
//                   className="h-20 border border-black600"
//                 />
//               </a>
//             </div>
//             <div className="flex items-center justify-center gap-1">
//               <a href="#" className="flex">
//                 <img src={Facebook} alt="Facebook logo" className="w-[60px]" />
//               </a>
//               <a href="#" className="flex">
//                 <img src={Google} alt="Google logo" className="w-[60px]" />
//               </a>
//               <a href="#" className="flex">
//                 <img src={Github} alt="Github logo" className="w-[60px]" />
//               </a>
//             </div>
//           </div>

//           <div className="space-y-3 lg:pl-4 lg:border-l-2 lg:border-slate200">
//             <h3 className="text-lg font-semibold">Save Password</h3>
//             <span className="text-base text-gray500 block">
//               Do not share your password!
//             </span>

//             {/* API Error/Success Message Display */}
//             {(apiError || success) && (
//               <div className="flex items-center justify-center mb-5">
//                 <div
//                   className={`flex items-center justify-between rounded py-1 px-2 max-w-md w-full ${
//                     apiError ? "bg-pink200" : "bg-green100"
//                   }`}
//                 >
//                   <div className="flex items-center gap-2 text-[#681923]">
//                     {apiError && <HiMiniExclamationCircle size={20} />}
//                     <span className="block">{apiError || success}</span>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setApiError("");
//                       setSuccess("");
//                     }}
//                   >
//                     <IoCloseOutline size={20} />
//                   </button>
//                 </div>
//               </div>
//             )}

//             <form
//               onSubmit={formik.handleSubmit}
//               noValidate
//               className="form space-y-4"
//             >
//               {/* New Password */}
//               <div className="form-item relative">
//                 <input
//                   type={showNewPassword ? "text" : "password"}
//                   id="newPassword"
//                   name="newPassword"
//                   autoComplete="off"
//                   required
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.newPassword}
//                   className={`outline-none shadow-none rounded-xl w-full pr-10 border ${
//                     formik.touched.newPassword && formik.errors.newPassword
//                       ? "border-primary"
//                       : "border-gray300"
//                   }`}
//                 />
//                 <label
//                   htmlFor="newPassword"
//                   className="absolute left-3 -top-[10px] text-gray500 text-sm select-none pointer-events-none"
//                 >
//                   New Password
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setShowNewPassword(!showNewPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray500"
//                 >
//                   {showNewPassword ? (
//                     <IoEyeOutline size={20} />
//                   ) : (
//                     <IoEyeOffOutline size={20} />
//                   )}
//                 </button>
//               </div>
//               {formik.touched.newPassword && formik.errors.newPassword && (
//                 <div className="text-primary text-xs">
//                   {formik.errors.newPassword}
//                 </div>
//               )}

//               {/* Confirm Password */}
//               <div className="form-item relative">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   autoComplete="off"
//                   required
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.confirmPassword}
//                   className={`outline-none shadow-none rounded-xl w-full pr-10 border ${
//                     formik.touched.confirmPassword &&
//                     formik.errors.confirmPassword
//                       ? "border-primary"
//                       : "border-gray300"
//                   }`}
//                 />
//                 <label
//                   htmlFor="confirmPassword"
//                   className="absolute left-3 -top-[10px] text-gray500 text-sm select-none pointer-events-none"
//                 >
//                   Confirm Password
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray500"
//                 >
//                   {showConfirmPassword ? (
//                     <IoEyeOutline size={20} />
//                   ) : (
//                     <IoEyeOffOutline size={20} />
//                   )}
//                 </button>
//               </div>
//               {formik.touched.confirmPassword &&
//                 formik.errors.confirmPassword && (
//                   <div className="text-primary text-xs">
//                     {formik.errors.confirmPassword}
//                   </div>
//                 )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`bg-gradient-to-r from-indigo-600 to-purple-600 block w-full rounded-md text-white p-2 transition ${
//                   loading ? "opacity-70 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {loading ? "Saving..." : "Save"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ForgotPassword;
