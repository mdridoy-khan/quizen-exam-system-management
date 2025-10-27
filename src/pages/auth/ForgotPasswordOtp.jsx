import { useFormik } from "formik";
import { useState } from "react";
import { HiMiniExclamationCircle } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import API from "../../api/API";
import { API_ENDPOINS } from "../../api/ApiEndpoints";
import FormImage from "../../assets/auth/authBg.jpg";

const ForgotPasswordOtp = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const navigate = useNavigate();

  // Yup Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email address")
      .required("Email is required"),
  });

  // Form submit handler
  const handleSubmit = (values) => {
    setLoading(true);
    setApiError("");
    setApiSuccess("");

    API.post(API_ENDPOINS.FORGOT_PASSWORD_OTP, {
      gmail: values.email,
    })
      .then((res) => {
        const successMessage = res.data?.message;
        if (successMessage) {
          setApiSuccess(successMessage);
        }
        navigate("/otp-varify", {
          state: { email: values.email, from: "forgot-password" },
        });
      })
      .catch((err) => {
        console.error(err);
        const msg = err.response?.data?.error;
        if (msg) {
          setApiError(msg);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
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
          {/* Form Section */}
          <div className="max-w-4xl mx-auto p-10 flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-8 flex items-center justify-between">
              Forgot Password
              <Link to="/login" className="w-5 h-5">
                <MdOutlineKeyboardBackspace size={24} />
              </Link>
            </h3>
            <span className="text-base text-gray500 block opacity-0">
              Enter your Gmail address to send one-time password
            </span>

            {/* API Error/Success Message */}
            {(apiError || apiSuccess) && (
              <div className="flex items-center justify-center mb-4">
                <div
                  className={`flex items-center justify-between rounded py-1 px-2 max-w-md ${
                    apiError ? "bg-pink200" : "bg-green100"
                  }`}
                >
                  <div className="flex items-center gap-2 text-[#681923]">
                    {apiError && <HiMiniExclamationCircle size={20} />}
                    <span className="block">{apiError || apiSuccess}</span>
                  </div>
                  <button
                    onClick={() => {
                      setApiError("");
                      setApiSuccess("");
                    }}
                  >
                    <IoCloseOutline size={20} />
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} noValidate>
              <div className="form-item relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="off"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`outline-none shadow-none w-full border-b ${
                    formik.touched.email && formik.errors.email
                      ? "border-primary"
                      : "border-gray-300"
                  }`}
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 top-1 text-gray500 text-sm select-none pointer-events-none"
                >
                  Enter Your Email Address
                </label>
                {formik.touched.email && formik.errors.email && (
                  <div className="text-primary text-xs mt-1">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`bg-gradient-to-r from-primary to-secondary block w-full rounded-md text-white p-2 mt-4 transition  ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOtp;

// import { useFormik } from "formik";
// import { useState } from "react";
// import { HiMiniExclamationCircle } from "react-icons/hi2";
// import { IoCloseOutline } from "react-icons/io5";
// import { MdOutlineKeyboardBackspace } from "react-icons/md";
// import { Link, useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import Eduwise from "../../assets/icons/eduwise.png";
// import Facebook from "../../assets/icons/facebook.png";
// import Github from "../../assets/icons/github.png";
// import Google from "../../assets/icons/google.png";
// import TutorWise from "../../assets/icons/tutorwise.png";

// const ForgotPasswordOtp = () => {
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [apiSuccess, setApiSuccess] = useState("");
//   const navigate = useNavigate();

//   // Yup Validation Schema
//   const validationSchema = Yup.object({
//     email: Yup.string()
//       .email("Enter a valid email address")
//       .required("Email is required"),
//   });

//   // Form submit handler
//   const handleSubmit = (values) => {
//     setLoading(true);
//     setApiError("");
//     setApiSuccess("");

//     API.post(API_ENDPOINS.FORGOT_PASSWORD_OTP, {
//       gmail: values.email,
//     })
//       .then((res) => {
//         const successMessage = res.data?.message;
//         if (successMessage) {
//           setApiSuccess(successMessage);
//         }
//         navigate("/otp-varify", {
//           state: { email: values.email, from: "forgot-password" },
//         });
//       })
//       .catch((err) => {
//         console.error(err);
//         const msg = err.response?.data?.error;
//         if (msg) {
//           setApiError(msg);
//         }
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//     },
//     validationSchema,
//     onSubmit: handleSubmit,
//   });

//   return (
//     <div className="container mx-auto px-4 mb-20">
//       <div className="text-center mb-10 lg:mb-16">
//         <h3 className="text-xl lg:text-2xl font-semibold mb-0">
//           Create a FleekQuiz Account
//         </h3>
//         <p className="text-sm">
//           Already have an Account?{" "}
//           <Link
//             to="/login"
//             className="inline-block bg-gradient-to-r from-primary to-secondary px-1 rounded text-white"
//           >
//             log in
//           </Link>
//         </p>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
//         <div className="space-y-4 mb-6 lg:mb-0">
//           <h3 className="text-base lg:text-lg text-black600 font-medium relative">
//             Login with TutorWise / EduWise / Social Profile
//           </h3>
//           <div className="flex items-center gap-1">
//             <a href="#" className="flex">
//               <img
//                 src={Eduwise}
//                 alt="eduwise logo"
//                 className="h-20 border border-black600"
//               />
//             </a>
//             <a href="#" className="flex">
//               <img
//                 src={TutorWise}
//                 alt="tutorwise logo"
//                 className="h-20 border border-black600"
//               />
//             </a>
//           </div>
//           <div className="flex items-center justify-center gap-1">
//             <a href="#" className="flex">
//               <img src={Facebook} alt="Facebook logo" className="w-[60px]" />
//             </a>
//             <a href="#" className="flex">
//               <img src={Google} alt="Google logo" className="w-[60px]" />
//             </a>
//             <a href="#" className="flex">
//               <img src={Github} alt="Github logo" className="w-[60px]" />
//             </a>
//           </div>
//         </div>

//         {/* Form Section */}
//         <div className="space-y-3 lg:pl-4 lg:border-l-2 lg:border-slate200">
//           <h3 className="text-lg font-semibold flex items-center justify-between">
//             Forgot Password
//             <Link to="/login" className="w-5 h-5">
//               <MdOutlineKeyboardBackspace size={24} />
//             </Link>
//           </h3>
//           <span className="text-base text-gray500 block">
//             Enter your Gmail address to send one-time password
//           </span>

//           {/* API Error/Success Message */}
//           {(apiError || apiSuccess) && (
//             <div className="flex items-center justify-center mb-4">
//               <div
//                 className={`flex items-center justify-between rounded py-1 px-2 max-w-md ${
//                   apiError ? "bg-pink200" : "bg-green100"
//                 }`}
//               >
//                 <div className="flex items-center gap-2 text-[#681923]">
//                   {apiError && <HiMiniExclamationCircle size={20} />}
//                   <span className="block">{apiError || apiSuccess}</span>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setApiError("");
//                     setApiSuccess("");
//                   }}
//                 >
//                   <IoCloseOutline size={20} />
//                 </button>
//               </div>
//             </div>
//           )}

//           <form onSubmit={formik.handleSubmit} noValidate>
//             <div className="form-item relative">
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 autoComplete="off"
//                 required
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.email}
//                 className={`outline-none shadow-none rounded-xl w-full p-2 border ${
//                   formik.touched.email && formik.errors.email
//                     ? "border-primary"
//                     : "border-gray-300"
//                 }`}
//               />
//               <label
//                 htmlFor="email"
//                 className="absolute left-3 top-1 text-gray500 text-sm select-none pointer-events-none"
//               >
//                 Email
//               </label>
//               {formik.touched.email && formik.errors.email && (
//                 <div className="text-primary text-xs mt-1">
//                   {formik.errors.email}
//                 </div>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`bg-gradient-to-r from-primary to-secondary block w-full rounded-md text-white p-2 mt-4 transition  ${
//                 loading ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             >
//               {loading ? "Sending..." : "Continue"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordOtp;
