import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiMiniExclamationCircle } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import API from "../../api/API";
import { API_ENDPOINS } from "../../api/ApiEndpoints";
import FormImage from "../../assets/auth/authBg.jpg";
import { PATH } from "../../routes/PATH";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [messages, setMessages] = useState([]);

  // Check authenticated user
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("UserData"));
    if (userData && userData.role) {
      switch (userData.role) {
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
          localStorage.removeItem("UserData");
          break;
      }
    }
  }, [navigate]);

  // Validation schema for login form
  const loginValidationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    // password: Yup.string()
    //   .min(8, "Password must be at least 8 characters")
    //   .matches(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    //   )
    //   .required("Password is required"),
  });

  // Validation schema for OTP form
  const otpValidationSchema = Yup.object({
    otpEmail: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Password login handler
  const handleSubmitLogin = async (values, { setSubmitting }) => {
    setLoading(true);
    const payload = {
      gmail: values.email,
      password: values.password,
    };

    try {
      const res = await API.post(API_ENDPOINS.LOGIN, payload);
      setMessages([
        { type: "success", text: res.data.message || "Login Successful" },
      ]);
      const userData = {
        ...res.data,
        role: res.data.user_type,
        accessToken: res.data.access,
      };
      localStorage.setItem("UserData", JSON.stringify(userData));

      localStorage.setItem("accessToken", userData.accessToken);

      console.log("access token:", userData.accessToken);

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
          localStorage.removeItem("UserData");
          setMessages([{ type: "error", text: "Invalid user type" }]);
          break;
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.error || "Invalid email or password";
      setMessages([{ type: "error", text: errorMessage }]);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // OTP submit handler
  const handleSubmitOtp = async (values, { setSubmitting }) => {
    const payload = {
      gmail: values.otpEmail,
    };

    try {
      const res = await API.post(API_ENDPOINS.ONE_TIME_OTP, payload);
      const apiMessage = res.data.success;
      setMessages([{ type: "success", text: apiMessage }]);
      navigate("/otp-varify", {
        state: { email: values.otpEmail, from: "login-otp" },
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || "Failed to send OTP";
      setMessages([{ type: "error", text: errorMessage }]);
    } finally {
      setSubmitting(false);
    }
  };

  // Formik for login form
  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: handleSubmitLogin,
  });

  // Formik for OTP form
  const otpFormik = useFormik({
    initialValues: {
      otpEmail: "",
    },
    validationSchema: otpValidationSchema,
    onSubmit: handleSubmitOtp,
  });

  // Remove message handler
  const removeMessage = (index) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

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

          <div className="max-w-4xl mx-auto p-10 flex flex-col items-center justify-center">
            {/* OTP form */}
            <form
              className="w-full otp-form pb-8 border-b border-[#b9babe]"
              onSubmit={otpFormik.handleSubmit}
            >
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-8 text-left">
                Sign In
              </h3>
              {/* <h4 className="text-secondary font-medium text-center text-lg mb-1 items-center relative">
                <Link
                  to="/"
                  className="w-6 h-5 flex items-center absolute top-1 left-0"
                >
                  <MdOutlineKeyboardBackspace
                    size={24}
                    className="w-full hover:text-primary"
                  />
                </Link>
                Log In to your Quiz account
              </h4> */}
              {/* Messages */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded py-1 px-2 mb-4 ${
                    message.type === "error" ? "bg-pink200" : "bg-green100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {message.type === "error" && (
                      <HiMiniExclamationCircle size={20} color="#681923" />
                    )}
                    <span className="block">{message.text}</span>
                  </div>
                  <button onClick={() => removeMessage(index)}>
                    <IoCloseOutline size={20} />
                  </button>
                </div>
              ))}
              <div className="input-wrapper mb-3">
                <input
                  type="text"
                  placeholder="E-mail (Log In With OTP)"
                  id="otpEmail"
                  name="otpEmail"
                  onChange={otpFormik.handleChange}
                  onBlur={otpFormik.handleBlur}
                  value={otpFormik.values.otpEmail}
                  className={`w-full border-b p-2 outline-none shadow-none focus:border-primary ${
                    otpFormik.touched.otpEmail && otpFormik.errors.otpEmail
                      ? "border-primary"
                      : "border-gray300"
                  }`}
                />
                {otpFormik.touched.otpEmail && otpFormik.errors.otpEmail && (
                  <div className="text-primary text-sm mt-1">
                    {otpFormik.errors.otpEmail}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-primary to-secondary block w-full rounded-md text-white p-2 transition"
                disabled={otpFormik.isSubmitting}
              >
                {otpFormik.isSubmitting ? "Sending OTP..." : "Log In With OTP"}
              </button>
            </form>

            {/* Password form */}
            <form
              className="max-w-[380px] mx-auto space-y-3 mt-8"
              onSubmit={loginFormik.handleSubmit}
            >
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="E-mail"
                  id="email"
                  name="email"
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  value={loginFormik.values.email}
                  className={`w-full border-b p-2 outline-none shadow-none focus:border-primary ${
                    loginFormik.touched.email && loginFormik.errors.email
                      ? "border-primary"
                      : "border-gray300"
                  }`}
                />
                {loginFormik.touched.email && loginFormik.errors.email && (
                  <div className="text-primary text-sm mt-1">
                    {loginFormik.errors.email}
                  </div>
                )}
              </div>

              <div className="input-wrapper relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  id="password"
                  name="password"
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  value={loginFormik.values.password}
                  className={`w-full border-b p-2 outline-none shadow-none focus:border-primary ${
                    loginFormik.touched.password && loginFormik.errors.password
                      ? "border-primary"
                      : "border-gray300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray500"
                >
                  {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                </button>
              </div>
              {loginFormik.touched.password && loginFormik.errors.password && (
                <div className="text-primary text-sm mt-1">
                  {loginFormik.errors.password}
                </div>
              )}

              <div>
                <Link
                  to="/forgot-password-otp"
                  className="text-end text-sm block font-medium transition hover:text-primary"
                >
                  Forgot your password?
                </Link>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-primary to-secondary block w-full rounded-md text-white p-2 transition"
                disabled={loading || loginFormik.isSubmitting}
              >
                {loading || loginFormik.isSubmitting
                  ? "Logging In..."
                  : "Log In With Password"}
              </button>
              {/* <h3 className="text-center text-sm text-black600 font-medium relative login-text">
                Login with TutorWise / EduWise / Social Profile
              </h3>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <a href="#" className="flex">
                    <img
                      src={Eduwise}
                      alt="eduwise logo"
                      className="h-10 border border-black600"
                    />
                  </a>
                  <a href="#" className="flex">
                    <img
                      src={TutorWise}
                      alt="tutorwise logo"
                      className="h-10 border border-black600"
                    />
                  </a>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <a href="#" className="flex">
                    <img
                      src={Facebook}
                      alt="Facebook logo"
                      className="w-[40px]"
                    />
                  </a>
                  <a href="#" className="flex">
                    <img src={Google} alt="Google logo" className="w-[40px]" />
                  </a>
                  <a href="#" className="flex">
                    <img src={Github} alt="Github logo" className="w-[40px]" />
                  </a>
                </div>
              </div> */}
              <p className="text-sm text-black600 font-medium text-center flex flex-col sm:flex-row items-center gap-1 justify-center">
                Not registered with Quiz account?
                <Link to="/register" className="text-primary">
                  Register Now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
