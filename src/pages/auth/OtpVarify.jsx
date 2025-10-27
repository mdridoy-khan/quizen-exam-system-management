import { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { HiMiniExclamationCircle } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api/API";
import { API_ENDPOINS } from "../../api/ApiEndpoints";
import FormImage from "../../assets/auth/authBg.jpg";
import { PATH } from "../../routes/PATH";

const OtpVarify = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(180);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();

  // New state for error and success messages
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const email = location.state?.email || "ih9****@gmail.com";
  const from = location.state?.from || "registration";

  // Timer countdown and resend logic
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleResend = () => {
    if (canResend) {
      setOtp(["", "", "", ""]);
      inputRefs.current[0].focus();
      setTimer(180); // Timer reset
      setCanResend(false); // Button disable
      // API error and success clear on resend
      setApiError("");
      setApiSuccess("");
      setLoading(true); // Set loading to true before API call
      API.post(API_ENDPOINS.RESEND_OTP, { gmail: email })
        .then((res) => {
          const successMessage = res.data.success;
          if (successMessage) {
            setApiSuccess(successMessage);
          }
        })
        .catch((err) => {
          console.error(err);
          const errorMessage = err.response?.data?.error;
          if (errorMessage) {
            setApiError(errorMessage);
          }
        })
        .finally(() => {
          setLoading(false); // Set loading to false after API call completes
        });
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[otp.length - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length === 4 && /^\d{4}$/.test(otpCode)) {
      // API error and success clear before submit
      setApiError("");
      setApiSuccess("");
      setLoading(true); // Set loading to true before API call
      API.post(API_ENDPOINS.OTP_VERIFICATION, {
        otp: otpCode,
        gmail: email,
      })
        .then((res) => {
          const successMessage = res.data.message;
          if (successMessage) {
            setApiSuccess(successMessage);
          }
          if (from === "login-otp") {
            const userData = { ...res.data, role: res.data.user_type };
            localStorage.setItem("UserData", JSON.stringify(userData));
            switch (res.data.user_type) {
              case "student":
                navigate(PATH.studentDashboard, { replace: true });
                break;
              case "tutor":
                navigate(PATH.tutorDashboard, { replace: true });
                break;
              case "president":
                navigate(PATH.presidentDashboard, { replace: true });
                break;
              default:
                const errorMessage = "Invalid user type";
                setApiError(errorMessage);
                navigate(PATH.login);
                break;
            }
          } else if (from === "forgot-password") {
            navigate("/forgot-password", { state: { email } });
          } else {
            navigate(PATH.login);
          }
        })
        .catch((err) => {
          console.log(err);
          const errorMessage = err.response?.data?.error;
          if (errorMessage) {
            setApiError(errorMessage);
          }
        })
        .finally(() => {
          setLoading(false); // Set loading to false after API call completes
        });
    } else {
      const errorMessage = "Please enter a valid 4-digit OTP";
      setApiError(errorMessage);
    }
  };

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
            <div className="max-w-4xl mx-auto p-10 flex flex-col justify-center">
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-8 text-center">
                  Verify Email Adress
                </h3>

                {/* API Error/Success Message Area */}
                {(apiError || apiSuccess) && (
                  <div className="flex items-center justify-center mb-4">
                    <div
                      className={`flex items-center justify-between rounded py-1 px-2 max-w-md ${
                        apiError ? "bg-pink200" : "bg-green100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {apiError && (
                          <HiMiniExclamationCircle size={20} color="#681923" />
                        )}
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

                <form onSubmit={handleSubmit} className="form">
                  <div className="flex space-x-4 items-center justify-center mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={index === 0 ? handlePaste : null}
                        className="w-12 h-12 text-center text-2xl border border-gray300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray500 max-w-80 mx-auto text-center mb-5">
                    We have sent the verification code to your Gmail{" "}
                    <strong className="text-primary">{email}</strong> address
                  </p>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-primary to-secondary block w-full rounded-md text-white p-2 transition font-medium text-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin mx-auto" size={20} />
                    ) : (
                      "Verify"
                    )}
                  </button>
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={handleResend}
                      disabled={!canResend || loading}
                      className={`text-sm font-semibold transition ${
                        canResend && !loading
                          ? "text-secondary hover:text-primary"
                          : "text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Resend Code{" "}
                      {canResend && !loading ? "" : `(${formatTimer(timer)})`}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVarify;

// import { useEffect, useRef, useState } from "react";
// import { FaSpinner } from "react-icons/fa"; // Import spinner icon
// import { HiMiniExclamationCircle } from "react-icons/hi2";
// import { IoCloseOutline } from "react-icons/io5";
// import { MdOutlineKeyboardBackspace } from "react-icons/md";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import Eduwise from "../../assets/icons/eduwise.png";
// import Facebook from "../../assets/icons/facebook.png";
// import Github from "../../assets/icons/github.png";
// import Google from "../../assets/icons/google.png";
// import TutorWise from "../../assets/icons/tutorwise.png";
// import { PATH } from "../../routes/PATH";

// const OtpVarify = () => {
//   const navigate = useNavigate();
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [timer, setTimer] = useState(180);
//   const [canResend, setCanResend] = useState(false);
//   const [loading, setLoading] = useState(false); // Define loading state
//   const inputRefs = useRef([]);
//   const location = useLocation();

//   // New state for error and success messages
//   const [apiError, setApiError] = useState("");
//   const [apiSuccess, setApiSuccess] = useState("");

//   const email = location.state?.email || "ih9****@gmail.com";
//   const from = location.state?.from || "registration";

//   // Timer countdown and resend logic
//   useEffect(() => {
//     const countdown = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           setCanResend(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(countdown);
//   }, [timer]); // timer পরিবর্তনের উপর নির্ভর করে useEffect আবার চলবে

//   const formatTimer = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const handleResend = () => {
//     if (canResend) {
//       setOtp(["", "", "", ""]);
//       inputRefs.current[0].focus();
//       setTimer(180); // Timer reset
//       setCanResend(false); // Button disable
//       // API error and success clear on resend
//       setApiError("");
//       setApiSuccess("");
//       setLoading(true); // Set loading to true before API call
//       API.post(API_ENDPOINS.RESEND_OTP, { gmail: email })
//         .then((res) => {
//           const successMessage = res.data.success;
//           if (successMessage) {
//             setApiSuccess(successMessage);
//           }
//         })
//         .catch((err) => {
//           console.error(err);
//           const errorMessage = err.response?.data?.error;
//           if (errorMessage) {
//             setApiError(errorMessage);
//           }
//         })
//         .finally(() => {
//           setLoading(false); // Set loading to false after API call completes
//         });
//     }
//   };

//   const handleChange = (e, index) => {
//     const value = e.target.value;

//     if (/^[0-9]?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < otp.length - 1) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     } else if (e.key === "ArrowLeft" && index > 0) {
//       inputRefs.current[index - 1].focus();
//     } else if (e.key === "ArrowRight" && index < otp.length - 1) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData("text").trim();

//     if (/^\d{4}$/.test(pastedData)) {
//       const newOtp = pastedData.split("");
//       setOtp(newOtp);
//       inputRefs.current[otp.length - 1].focus();
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const otpCode = otp.join("");
//     if (otpCode.length === 4 && /^\d{4}$/.test(otpCode)) {
//       // API error and success clear before submit
//       setApiError("");
//       setApiSuccess("");
//       setLoading(true); // Set loading to true before API call
//       API.post(API_ENDPOINS.OTP_VERIFICATION, {
//         otp: otpCode,
//         gmail: email,
//       })
//         .then((res) => {
//           const successMessage = res.data.message;
//           if (successMessage) {
//             setApiSuccess(successMessage);
//           }
//           if (from === "login-otp") {
//             const userData = { ...res.data, role: res.data.user_type };
//             localStorage.setItem("UserData", JSON.stringify(userData));
//             switch (res.data.user_type) {
//               case "student":
//                 navigate(PATH.studentDashboard, { replace: true });
//                 break;
//               case "tutor":
//                 navigate(PATH.tutorDashboard, { replace: true });
//                 break;
//               case "president":
//                 navigate(PATH.presidentDashboard, { replace: true });
//                 break;
//               default:
//                 const errorMessage = "Invalid user type";
//                 setApiError(errorMessage);
//                 navigate(PATH.login);
//                 break;
//             }
//           } else if (from === "forgot-password") {
//             navigate("/forgot-password", { state: { email } });
//           } else {
//             navigate(PATH.login);
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//           const errorMessage = err.response?.data?.error;
//           if (errorMessage) {
//             setApiError(errorMessage);
//           }
//         })
//         .finally(() => {
//           setLoading(false); // Set loading to false after API call completes
//         });
//     } else {
//       const errorMessage = "Please enter a valid 4-digit OTP";
//       setApiError(errorMessage);
//     }
//   };

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
//               className="inline-block bg-gradient-to-r from-primary to-secondary px-1 rounded text-white"
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
//             <div className="grid grid-cols-3 items-center">
//               <Link to="/login" className="w-5 h-5 mr-2">
//                 <MdOutlineKeyboardBackspace size={24} />
//               </Link>
//               <h3 className="text-lg font-semibold flex items-center">
//                 OTP Verification
//               </h3>
//             </div>

//             {/* API Error/Success Message Area */}
//             {(apiError || apiSuccess) && (
//               <div className="flex items-center justify-center mb-4">
//                 <div
//                   className={`flex items-center justify-between rounded py-1 px-2 max-w-md ${
//                     apiError ? "bg-pink200" : "bg-green100"
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     {apiError && (
//                       <HiMiniExclamationCircle size={20} color="#681923" />
//                     )}
//                     <span className="block">{apiError || apiSuccess}</span>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setApiError("");
//                       setApiSuccess("");
//                     }}
//                   >
//                     <IoCloseOutline size={20} />
//                   </button>
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="form">
//               <div className="flex space-x-4 items-center justify-center mb-4">
//                 {otp.map((digit, index) => (
//                   <input
//                     key={index}
//                     ref={(el) => (inputRefs.current[index] = el)}
//                     type="text"
//                     maxLength="1"
//                     value={digit}
//                     onChange={(e) => handleChange(e, index)}
//                     onKeyDown={(e) => handleKeyDown(e, index)}
//                     onPaste={index === 0 ? handlePaste : null}
//                     className="w-12 h-12 text-center text-2xl border border-gray300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
//                   />
//                 ))}
//               </div>
//               <p className="text-sm text-gray500 max-w-80 mx-auto text-center mb-5">
//                 We have sent the verification code to your Gmail{" "}
//                 <strong>{email}</strong> address
//               </p>
//               <div className="mb-2 flex items-center justify-end">
//                 <button
//                   onClick={handleResend}
//                   disabled={!canResend || loading}
//                   className={`text-sm font-semibold transition ${
//                     canResend && !loading
//                       ? "text-primary hover:text-primarySlate"
//                       : "text-gray500 cursor-not-allowed"
//                   }`}
//                 >
//                   Resend Code{" "}
//                   {canResend && !loading ? "" : `(${formatTimer(timer)})`}
//                 </button>
//               </div>
//               <button
//                 type="submit"
//                 className="bg-gradient-to-r from-primary to-secondary block w-full rounded-md text-white p-2 transition font-medium text-center"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <FaSpinner className="animate-spin mx-auto" size={20} />
//                 ) : (
//                   "Verify"
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OtpVarify;
