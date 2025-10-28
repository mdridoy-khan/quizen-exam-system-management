import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiMiniExclamationCircle } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import API from "../../../api/API";
import { API_ENDPOINS } from "../../../api/ApiEndpoints";
import FormImage from "../../../assets/auth/authBg.jpg";
import { PATH } from "../../../routes/PATH";
const EventRegister = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const location = useLocation();
  const [categoryInput, setCategoryInput] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  // user base form tab open
  useEffect(() => {
    if (location.state?.userType) {
      setUserType(location.state.userType);
    }
  }, [location.state]);

  // Capitalize function for category names
  const capitalize = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  // Fetch upazila name list
  useEffect(() => {
    API.get(API_ENDPOINS.UPAZILA_NAME)
      .then((res) => {
        if (res.data?.upazilas && Array.isArray(res.data.upazilas)) {
          setCities(res.data.upazilas);
        }
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
        setApiError("Failed to load cities. Please try again.");
      });
  }, []);

  // Fetch category list
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        setCategoryError(null);

        const res = await API.get("/auth/category/");
        if (res.status === 200 && Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        if (err.response) {
          setCategoryError(
            err.response.data?.message ||
              `Server error: ${err.response.status} ${err.response.statusText}`
          );
        } else if (err.request) {
          setCategoryError(
            "Network error: Failed to reach the server. Please try again."
          );
        } else {
          setCategoryError(
            "An unexpected error occurred. Please try again later."
          );
        }
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle checkbox change
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Registration form validation schema
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(3, "Full Name must be at least 3 characters")
      .required("Full Name is required"),
    phoneNumber: Yup.string()
      .matches(
        /^\+?[0-9]{10,14}$/,
        "Enter a valid phone number with country code"
      )
      .required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    instutionName: Yup.string().required("Institution Name is required"),
    departmentName: Yup.string().required("Department Name is required"),
    experience: Yup.string().when([], {
      is: () => userType === "tutor",
      then: (schema) => schema.required("Experience is required for tutors"),
      otherwise: (schema) => schema.notRequired(),
    }),
    upazila_id: Yup.string()
      .required("Please select a city")
      .test(
        "is-valid",
        "Invalid city selection",
        (value) => !!value && value.trim() !== ""
      ),
    address: Yup.string().required("Address is required"),
    password: Yup.string()
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[@$!%*?&]/, "Must contain at least one special character")
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Handle form submission
  const handleSubmitRegistration = (values) => {
    setLoading(true);
    setApiError("");
    setApiSuccess("");

    const payload = {
      user_type: userType,
      ...(userType === "tutor" && { experience: values.experience }),
      full_name: values.fullName,
      phone: values.phoneNumber,
      gmail: values.email,
      department: values.departmentName,
      institution: values.instutionName,
      address: values.address,
      upazila_id: values.upazila_id || "637",
      password: values.password,
      confirm_password: values.confirmPassword,
      category_choice: selectedCategories.map(capitalize),
    };

    // Sign up API handle
    API.post(API_ENDPOINS.SIGN_UP, payload)
      .then((res) => {
        const successMessage = res.data.success;
        if (successMessage) {
          setApiSuccess(successMessage);
        }
        navigate(PATH.otpVerification, {
          state: { email: values.email, from: "registration" },
        });
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = err.response?.data?.error || "Registration failed";
        setApiError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // UseFormik with Yup validation
  const registrationFormik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      instutionName: "",
      departmentName: "",
      experience: "",
      upazila_id: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: handleSubmitRegistration,
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
            <div className="max-w-4xl mx-auto flex-1 gap-4 p-10">
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-0">
                  Sign Up
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base lg:text-lg text-gray-700 font-medium relative">
                    Register as a{" "}
                    <span
                      className={`px-1 rounded ${
                        userType === "student"
                          ? "text-primary py-0"
                          : "text-gray-700"
                      }`}
                    >
                      Student
                    </span>{" "}
                    or{" "}
                    <span
                      className={`px-1 rounded ${
                        userType === "tutor"
                          ? "text-primary py-0"
                          : "text-gray-700"
                      }`}
                    >
                      Tutor
                    </span>
                  </h3>
                  <Link
                    to="/"
                    className="w-6 h-5 flex items-center justify-center"
                  >
                    <MdOutlineKeyboardBackspace
                      size={24}
                      className="w-full transition hover:text-primary"
                    />
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUserType("student")}
                    className={`${
                      userType === "student"
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-[#F6F4E3] text-gray-700"
                    } block w-full rounded-md p-2 transition`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("tutor")}
                    className={`${
                      userType === "tutor"
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-[#F6F4E3] text-gray-700"
                    } block w-full rounded-md p-2 transition`}
                  >
                    Tutor
                  </button>
                </div>

                {(apiError || apiSuccess || categoryError) && (
                  <div className="flex items-center justify-center mb-6">
                    <div
                      className={`flex items-center justify-between rounded py-1 px-2 ${
                        apiError || categoryError ? "bg-pink200" : "bg-green100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {(apiError || categoryError) && (
                          <HiMiniExclamationCircle size={20} color="#681923" />
                        )}
                        <span className="block">
                          {apiError || apiSuccess || categoryError}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setApiError("");
                          setApiSuccess("");
                          setCategoryError(null);
                        }}
                      >
                        <IoCloseOutline size={20} />
                      </button>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={registrationFormik.handleSubmit}
                  className="space-y-2"
                >
                  <div className="input-wrapper">
                    {/* <label
                      htmlFor="fullName"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label> */}
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      onChange={registrationFormik.handleChange}
                      value={registrationFormik.values.fullName}
                      onBlur={registrationFormik.handleBlur}
                      placeholder="Enter Your Full Name *"
                      className="w-full border-b border-gray-300 p-2 outline-none shadow_team1 focus:border-primary"
                      required
                    />
                    {registrationFormik.touched.fullName &&
                      registrationFormik.errors.fullName && (
                        <span className="text-sm text-primary">
                          {registrationFormik.errors.fullName}
                        </span>
                      )}
                  </div>

                  <div className="input-wrapper">
                    {/* <label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Phone No <span className="text-red-500">*</span>
                    </label> */}
                    <div className="flex gap-2 tel_wrapper">
                      <PhoneInput
                        country={"bd"}
                        id="phoneNumber"
                        name="phoneNumber"
                        onChange={(phone) =>
                          registrationFormik.setFieldValue(
                            "phoneNumber",
                            `+${phone}`
                          )
                        }
                        value={registrationFormik.values.phoneNumber}
                        onBlur={registrationFormik.handleBlur}
                        placeholder="Enter Phone Number *"
                        inputClass="!h-[42px] !w-full border-b border-gray-300 p-2 outline-none shadow_team1 focus:border-primary"
                      />
                    </div>
                    {registrationFormik.touched.phoneNumber &&
                      registrationFormik.errors.phoneNumber && (
                        <span className="text-sm text-primary">
                          {registrationFormik.errors.phoneNumber}
                        </span>
                      )}
                  </div>

                  <div className="input-wrapper">
                    {/* <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Email <span className="text-red-500">*</span>
                    </label> */}
                    <input
                      type="email"
                      id="email"
                      name="email"
                      onChange={registrationFormik.handleChange}
                      value={registrationFormik.values.email}
                      onBlur={registrationFormik.handleBlur}
                      placeholder="Enter Email *"
                      className="w-full border-b border-gray-300 p-2 outline-none shadow_team1 focus:border-primary"
                    />
                    {registrationFormik.touched.email &&
                      registrationFormik.errors.email && (
                        <span className="text-sm text-primary">
                          {registrationFormik.errors.email}
                        </span>
                      )}
                  </div>

                  <div className="input-group grid grid-cols-2 gap-4">
                    <div className="input-wrapper">
                      {/* <label
                        htmlFor="instutionName"
                        className="text-sm font-medium text-gray-700 mb-1 block"
                      >
                        Institution Name <span className="text-red-500">*</span>
                      </label> */}
                      <input
                        type="text"
                        id="instutionName"
                        name="instutionName"
                        onChange={registrationFormik.handleChange}
                        value={registrationFormik.values.instutionName}
                        onBlur={registrationFormik.handleBlur}
                        placeholder="Enter Institution Name *"
                        className="w-full border-b border-gray-300 p-2 outline-none shadow_team1 focus:border-primary"
                      />
                      {registrationFormik.touched.instutionName &&
                        registrationFormik.errors.instutionName && (
                          <span className="text-sm text-primary">
                            {registrationFormik.errors.instutionName}
                          </span>
                        )}
                    </div>
                    <div className="input-wrapper">
                      {/* <label
                        htmlFor="departmentName"
                        className="text-sm font-medium text-gray-700 mb-1 block"
                      >
                        Department Name <span className="text-red-500">*</span>
                      </label> */}
                      <input
                        type="text"
                        id="departmentName"
                        name="departmentName"
                        onChange={registrationFormik.handleChange}
                        value={registrationFormik.values.departmentName}
                        onBlur={registrationFormik.handleBlur}
                        placeholder="Enter Department Name *"
                        className="w-full border-b border-gray-300 p-2 outline-none shadow_team1 focus:border-primary"
                      />
                      {registrationFormik.touched.departmentName &&
                        registrationFormik.errors.departmentName && (
                          <span className="text-sm text-primary">
                            {registrationFormik.errors.departmentName}
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="input-group grid grid-cols-2 gap-4">
                    <div className="input-wrapper relative">
                      {/* <label
                        htmlFor="upazila_id"
                        className="text-sm font-medium text-gray-700 mb-1 block"
                      >
                        Choose City <span className="text-red-500">*</span>
                      </label> */}
                      <input
                        type="text"
                        id="upazila_id"
                        name="upazila_id"
                        value={cityInput}
                        onChange={(e) => {
                          const searchValue = e.target.value;
                          setCityInput(searchValue);
                          setFilteredCities(
                            cities.filter((c) =>
                              c.name
                                .toLowerCase()
                                .includes(searchValue.toLowerCase())
                            )
                          );
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() =>
                          setTimeout(() => setShowSuggestions(false), 100)
                        }
                        placeholder="Your Upazila *"
                        className="w-full border-b border-gray-300 p-2 outline-none shadow_team1 focus:border-primary"
                      />

                      {showSuggestions && filteredCities.length > 0 && (
                        <ul className="absolute bg-white border-b border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow z-10">
                          {filteredCities.map((city) => (
                            <li
                              key={city.id}
                              className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                              onClick={() => {
                                registrationFormik.setFieldValue(
                                  "upazila_id",
                                  city.id
                                );
                                setCityInput(city.name);
                                setShowSuggestions(false);
                              }}
                            >
                              {city.name}
                            </li>
                          ))}
                        </ul>
                      )}

                      {registrationFormik.touched.upazila_id &&
                        registrationFormik.errors.upazila_id && (
                          <span className="text-sm text-primary">
                            {registrationFormik.errors.upazila_id}
                          </span>
                        )}
                    </div>

                    <div className="input-wrapper">
                      {/* <label
                        htmlFor="address"
                        className="text-sm font-medium text-gray-700 mb-1 block"
                      >
                        Address <span className="text-red-500">*</span>
                      </label> */}
                      <input
                        type="text"
                        id="address"
                        name="address"
                        onChange={registrationFormik.handleChange}
                        value={registrationFormik.values.address}
                        onBlur={registrationFormik.handleBlur}
                        placeholder="Enter Address *"
                        className="w-full border-b border-gray-300 p-2 outline-none shadow_team1 focus:border focus:primary"
                      />
                      {registrationFormik.touched.address &&
                        registrationFormik.errors.address && (
                          <span className="text-sm text-primary">
                            {registrationFormik.errors.address}
                          </span>
                        )}
                    </div>
                  </div>

                  {userType === "tutor" && (
                    <div className="input-wrapper">
                      {/* <label
                        htmlFor="experience"
                        className="text-sm font-medium text-gray-700 mb-1 block"
                      >
                        Experience <span className="text-red-500">*</span>
                      </label> */}
                      <textarea
                        id="experience"
                        name="experience"
                        onChange={registrationFormik.handleChange}
                        value={registrationFormik.values.experience}
                        onBlur={registrationFormik.handleBlur}
                        placeholder="Describe your teaching experience *"
                        className="w-full border-b border-gray-300 p-2 outline-none shadow_team1 focus:border-primary"
                        rows={4}
                      />
                      {registrationFormik.touched.experience &&
                        registrationFormik.errors.experience && (
                          <span className="text-sm text-primary">
                            {registrationFormik.errors.experience}
                          </span>
                        )}
                    </div>
                  )}

                  <div className="input-wrapper relative">
                    {categoryLoading ? (
                      <div className="flex items-center text-gray-600 gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading categories...</span>
                      </div>
                    ) : (
                      <>
                        {/* Search Input for Category */}
                        <input
                          type="text"
                          placeholder="Search and select subject..."
                          value={categoryInput}
                          onChange={(e) => {
                            const searchValue = e.target.value;
                            setCategoryInput(searchValue);

                            // Filter category list
                            const filtered = categories.filter((cat) =>
                              cat.category_name
                                .toLowerCase()
                                .includes(searchValue.toLowerCase())
                            );
                            setFilteredCategories(filtered);
                            setShowCategorySuggestions(true);
                          }}
                          onFocus={() => setShowCategorySuggestions(true)}
                          onBlur={() =>
                            setTimeout(
                              () => setShowCategorySuggestions(false),
                              100
                            )
                          }
                          className="w-full border-b border-gray-300 p-2 outline-none shadow_team1 focus:border-primary"
                        />

                        {/* Dropdown List */}
                        {showCategorySuggestions &&
                          filteredCategories.length > 0 && (
                            <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow z-10">
                              {filteredCategories.map((cat, index) => (
                                <li
                                  key={index}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-200 text-sm flex items-center gap-2"
                                  onClick={() => {
                                    if (
                                      !selectedCategories.includes(
                                        cat.category_name
                                      )
                                    ) {
                                      setSelectedCategories((prev) => [
                                        ...prev,
                                        cat.category_name,
                                      ]);
                                    }
                                    setCategoryInput(""); // clear search box
                                    setFilteredCategories([]); // clear dropdown
                                    setShowCategorySuggestions(false);
                                  }}
                                >
                                  <TbCategoryPlus size={16} />
                                  {cat.category_name}
                                </li>
                              ))}
                            </ul>
                          )}

                        {/* Selected Categories Display */}
                        {selectedCategories.length > 0 && (
                          <div className="mt-2 p-2 border border-gray-300 rounded-md min-h-[50px] bg-gray-50">
                            {selectedCategories.map((cat, index) => (
                              <span
                                key={index}
                                className="inline-block bg-[#F6F4E3] text-secondary px-2 py-1 rounded-md mr-2 mb-2 text-sm"
                              >
                                {capitalize(cat)}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedCategories((prev) =>
                                      prev.filter((c) => c !== cat)
                                    )
                                  }
                                  className="ml-2 text-primary hover:text-primary"
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="input-wrapper relative">
                    {/* <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Enter Password <span className="text-red-500">*</span>
                    </label> */}
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      onChange={registrationFormik.handleChange}
                      value={registrationFormik.values.password}
                      onBlur={registrationFormik.handleBlur}
                      placeholder="Enter Password *"
                      className="w-full border-b border-gray-300 p-2 outline-none shadow_team1 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[15px] text-sm text-gray500"
                    >
                      {showPassword ? <FiEye /> : <FiEyeOff />}
                    </button>
                    {registrationFormik.touched.password &&
                      registrationFormik.errors.password && (
                        <span className="text-sm text-primary">
                          {registrationFormik.errors.password}
                        </span>
                      )}
                  </div>

                  <div className="input-wrapper relative">
                    {/* <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Enter Confirm Password{" "}
                      <span className="text-red-500">*</span>
                    </label> */}
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      onChange={registrationFormik.handleChange}
                      value={registrationFormik.values.confirmPassword}
                      onBlur={registrationFormik.handleBlur}
                      placeholder="Enter Confirm Password *"
                      className="w-full border-b border-gray-300 p-2 outline-none shadow_team1 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-[15px] text-sm text-gray500"
                    >
                      {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                    </button>
                    {registrationFormik.touched.confirmPassword &&
                      registrationFormik.errors.confirmPassword && (
                        <span className="text-sm text-primary">
                          {registrationFormik.errors.confirmPassword}
                        </span>
                      )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || categoryLoading}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary w-full rounded-md text-white p-2 transition !mt-[24px] disabled:opacity-50"
                  >
                    {loading && <FaSpinner className="animate-spin" />}
                    Create New Account
                  </button>
                </form>
              </div>
              <div className="space-y-4 mb-6 lg:mb-0 text-center">
                {/* <h3 className="text-base text-gray-700 font-medium relative mt-1">
                  Login with TutorWise / EduWise / Social Profile
                </h3> */}
                <div className="flex items-center justify-center gap-4">
                  {/* <div className="flex items-center gap-1">
                    <a href="#" className="flex">
                      <img
                        src={Eduwise}
                        alt="eduwise logo"
                        className="h-10 border border-gray-text-gray-700"
                      />
                    </a>
                    <a href="#" className="flex">
                      <img
                        src={TutorWise}
                        alt="tutorwise logo"
                        className="h-10 border border-gray-text-gray-700"
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
                      <img
                        src={Google}
                        alt="Google logo"
                        className="w-[40px]"
                      />
                    </a>
                    <a href="#" className="flex">
                      <img
                        src={Github}
                        alt="Github logo"
                        className="w-[40px]"
                      />
                    </a>
                  </div> */}
                </div>
                <div>
                  <p className="text-sm">
                    Already have an Account?{" "}
                    <Link
                      to="/login"
                      className="inline-block px-1 rounded text-primary "
                    >
                      SignUp Here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventRegister;

// without category list

// import { useFormik } from "formik";
// import { useEffect, useState } from "react";
// import { FaSpinner } from "react-icons/fa";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import { HiMiniExclamationCircle } from "react-icons/hi2";
// import { IoCloseOutline } from "react-icons/io5";
// import { MdOutlineKeyboardBackspace } from "react-icons/md";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import Eduwise from "../../assets/icons/eduwise.png";
// import Facebook from "../../assets/icons/facebook.png";
// import Github from "../../assets/icons/github.png";
// import Google from "../../assets/icons/google.png";
// import TutorWise from "../../assets/icons/tutorwise.png";
// import { PATH } from "../../routes/PATH";

// const Registration = () => {
//   const navigate = useNavigate();
//   const [userType, setUserType] = useState("student");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [cities, setCities] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [cityInput, setCityInput] = useState("");
//   const [apiError, setApiError] = useState("");
//   const [apiSuccess, setApiSuccess] = useState("");

//   const location = useLocation();

//   // user type base tab select
//   useEffect(() => {
//     if (location.state?.userType) {
//       setUserType(location.state.userType);
//     }
//   }, [location.state]);

//   // Upazila name list call
//   useEffect(() => {
//     API.get(API_ENDPOINS.UPAZILA_NAME)
//       .then((res) => {
//         if (res.data?.upazilas && Array.isArray(res.data.upazilas)) {
//           setCities(res.data.upazilas);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching cities:", err);
//         setApiError("Failed to load cities. Please try again.");
//       });
//   }, []);

//   // Registration form validation here
//   const validationSchema = Yup.object({
//     fullName: Yup.string()
//       .min(3, "Full Name must be at least 3 characters")
//       .required("Full Name is required"),
//     phoneNumber: Yup.string()
//       .matches(
//         /^\+?[0-9]{10,14}$/,
//         "Enter a valid phone number with country code"
//       )
//       .required("Phone number is required"),
//     email: Yup.string()
//       .email("Invalid email format")
//       .required("Email is required"),
//     instutionName: Yup.string().required("Institution Name is required"),
//     departmentName: Yup.string().required("Department Name is required"),
//     experience: Yup.string().when([], {
//       is: () => userType === "tutor",
//       then: (schema) => schema.required("Experience is required for tutors"),
//       otherwise: (schema) => schema.notRequired(),
//     }),
//     upazila_id: Yup.string()
//       .required("Please select a city")
//       .test(
//         "is-valid",
//         "Invalid city selection",
//         (value) => !!value && value.trim() !== ""
//       ),
//     address: Yup.string().required("Address is required"),
//     password: Yup.string()
//       .matches(/[A-Z]/, "Must contain at least one uppercase letter")
//       .matches(/[a-z]/, "Must contain at least one lowercase letter")
//       .matches(/[0-9]/, "Must contain at least one number")
//       .matches(/[@$!%*?&]/, "Must contain at least one special character")
//       .min(8, "Password must be at least 8 characters long")
//       .required("Password is required"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("password"), null], "Passwords must match")
//       .required("Confirm password is required"),
//   });

//   // Handle submit registration form here
//   const handleSubmitRegistration = (values) => {
//     setLoading(true);
//     setApiError("");
//     setApiSuccess("");
//     const payload = {
//       user_type: userType,
//       ...(userType === "tutor" && { experience: values.experience }),
//       full_name: values.fullName,
//       phone: values.phoneNumber,
//       gmail: values.email,
//       department: values.departmentName,
//       institution: values.instutionName,
//       address: values.address,
//       upazila_id: values.upazila_id || "637",
//       password: values.password,
//       confirm_password: values.confirmPassword,
//     };

//     // Sign up API handle
//     API.post(API_ENDPOINS.SIGN_UP, payload)
//       .then((res) => {
//         const successMessage = res.data.success;
//         if (successMessage) {
//           setApiSuccess(successMessage);
//         }
//         navigate(PATH.otpVerification, {
//           state: { email: values.email, from: "registration" },
//         });
//       })
//       .catch((err) => {
//         console.error(err);
//         const errorMessage = err.response?.data?.error || "Registration failed";
//         setApiError(errorMessage);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   // UseFormik with Yup validation
//   const registrationFormik = useFormik({
//     initialValues: {
//       fullName: "",
//       phoneNumber: "",
//       email: "",
//       instutionName: "",
//       departmentName: "",
//       experience: "",
//       upazila_id: "",
//       address: "",
//       password: "",
//       confirmPassword: "",
//     },
//     validationSchema,
//     onSubmit: handleSubmitRegistration,
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
//               className="inline-block bg-gradient-to-r from-primary to-secondary px-1 rounded text-white"
//             >
//               log in
//             </Link>
//           </p>
//         </div>

//         <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <div className="space-y-4 mb-6 lg:mb-0">
//             <h3 className="text-base lg:text-lg text-gray-700 font-medium relative">
//               Login with TutorWise / EduWise / Social Profile
//             </h3>
//             <div className="flex items-center gap-1">
//               <a href="#" className="flex">
//                 <img
//                   src={Eduwise}
//                   alt="eduwise logo"
//                   className="h-20 border border-gray-text-gray-700"
//                 />
//               </a>
//               <a href="#" className="flex">
//                 <img
//                   src={TutorWise}
//                   alt="tutorwise logo"
//                   className="h-20 border border-gray-text-gray-700"
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

//           <div className="space-y-4 lg:pl-4 lg:border-l-2 lg:border-slate200">
//             <div className="flex items-center justify-between">
//               <h3 className="text-base lg:text-lg text-gray-700 font-medium relative">
//                 Register as a{" "}
//                 <span
//                   className={`px-1 rounded ${
//                     userType === "student"
//                       ? "bg-gradient-to-r from-primary to-secondary text-white py-0"
//                       : "text-gray-700"
//                   }`}
//                 >
//                   Student
//                 </span>{" "}
//                 or{" "}
//                 <span
//                   className={`px-1 rounded ${
//                     userType === "tutor"
//                       ? "bg-gradient-to-r from-primary to-secondary text-white py-0"
//                       : "text-gray-700"
//                   }`}
//                 >
//                   Tutor
//                 </span>
//               </h3>
//               <Link to="/" className="w-6 h-5 flex items-center justify-center">
//                 <MdOutlineKeyboardBackspace size={24} className="w-full" />
//               </Link>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={() => setUserType("student")}
//                 className={`${
//                   userType === "student"
//                     ? "bg-gradient-to-r from-primary to-secondary text-white"
//                     : "bg-gray-200 text-gray-700"
//                 } block w-full rounded-md p-2 transition`}
//               >
//                 Student
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setUserType("tutor")}
//                 className={`${
//                   userType === "tutor"
//                     ? "bg-gradient-to-r from-primary to-secondary text-white"
//                     : "bg-gray-200 text-gray-700"
//                 } block w-full rounded-md p-2 transition`}
//               >
//                 Tutor
//               </button>
//             </div>

//             {/* API Error/Success Display */}
//             {(apiError || apiSuccess) && (
//               <div className="flex items-center justify-center mb-6">
//                 <div
//                   className={`flex items-center justify-between rounded py-1 px-2 ${
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

//             <form
//               onSubmit={registrationFormik.handleSubmit}
//               className="space-y-2"
//             >
//               <div className="input-wrapper">
//                 <label
//                   htmlFor="fullName"
//                   className="text-sm font-medium text-gray-700 mb-1 block"
//                 >
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   id="fullName"
//                   name="fullName"
//                   onChange={registrationFormik.handleChange}
//                   value={registrationFormik.values.fullName}
//                   onBlur={registrationFormik.handleBlur}
//                   placeholder="Enter Your Full Name"
//                   className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
//                   required
//                 />
//                 {registrationFormik.touched.fullName &&
//                   registrationFormik.errors.fullName && (
//                     <span className="text-sm text-primary">
//                       {registrationFormik.errors.fullName}
//                     </span>
//                   )}
//               </div>

//               <div className="input-wrapper">
//                 <label
//                   htmlFor="phoneNumber"
//                   className="text-sm font-medium text-gray-700 mb-1 block"
//                 >
//                   Phone No:
//                 </label>
//                 <div className="flex gap-2">
//                   <PhoneInput
//                     country={"bd"}
//                     id="phoneNumber"
//                     name="phoneNumber"
//                     onChange={(phone) =>
//                       registrationFormik.setFieldValue(
//                         "phoneNumber",
//                         `+${phone}`
//                       )
//                     }
//                     value={registrationFormik.values.phoneNumber}
//                     onBlur={registrationFormik.handleBlur}
//                     placeholder="Enter Phone Number"
//                     inputClass="!h-[42px] !w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
//                   />
//                 </div>
//                 {registrationFormik.touched.phoneNumber &&
//                   registrationFormik.errors.phoneNumber && (
//                     <span className="text-sm text-primary">
//                       {registrationFormik.errors.phoneNumber}
//                     </span>
//                   )}
//               </div>

//               <div className="input-wrapper">
//                 <label
//                   htmlFor="email"
//                   className="text-sm font-medium text-gray-700 mb-1 block"
//                 >
//                   Email:
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   onChange={registrationFormik.handleChange}
//                   value={registrationFormik.values.email}
//                   onBlur={registrationFormik.handleBlur}
//                   placeholder="Enter Email"
//                   className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
//                 />
//                 {registrationFormik.touched.email &&
//                   registrationFormik.errors.email && (
//                     <span className="text-sm text-primary">
//                       {registrationFormik.errors.email}
//                     </span>
//                   )}
//               </div>

//               <div className="input-group grid grid-cols-2 gap-2">
//                 <div className="input-wrapper">
//                   <label
//                     htmlFor="instutionName"
//                     className="text-sm font-medium text-gray-700 mb-1 block"
//                   >
//                     Institution Name:
//                   </label>
//                   <input
//                     type="text"
//                     id="instutionName"
//                     name="instutionName"
//                     onChange={registrationFormik.handleChange}
//                     value={registrationFormik.values.instutionName}
//                     onBlur={registrationFormik.handleBlur}
//                     placeholder="Enter Institution Name"
//                     className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
//                   />
//                   {registrationFormik.touched.instutionName &&
//                     registrationFormik.errors.instutionName && (
//                       <span className="text-sm text-primary">
//                         {registrationFormik.errors.instutionName}
//                       </span>
//                     )}
//                 </div>
//                 <div className="input-wrapper">
//                   <label
//                     htmlFor="departmentName"
//                     className="text-sm font-medium text-gray-700 mb-1 block"
//                   >
//                     Department Name:
//                   </label>
//                   <input
//                     type="text"
//                     id="departmentName"
//                     name="departmentName"
//                     onChange={registrationFormik.handleChange}
//                     value={registrationFormik.values.departmentName}
//                     onBlur={registrationFormik.handleBlur}
//                     placeholder="Enter Department Name"
//                     className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
//                   />
//                   {registrationFormik.touched.departmentName &&
//                     registrationFormik.errors.departmentName && (
//                       <span className="text-sm text-primary">
//                         {registrationFormik.errors.departmentName}
//                       </span>
//                     )}
//                 </div>
//               </div>

//               <div className="input-group grid grid-cols-2 gap-2">
//                 <div className="input-wrapper relative">
//                   <label
//                     htmlFor="upazila_id"
//                     className="text-sm font-medium text-gray-700 mb-1 block"
//                   >
//                     Choose City:
//                   </label>
//                   <input
//                     type="text"
//                     id="upazila_id"
//                     name="upazila_id"
//                     value={cityInput}
//                     onChange={(e) => {
//                       const searchValue = e.target.value;
//                       setCityInput(searchValue);
//                       setFilteredCities(
//                         cities.filter((c) =>
//                           c.name
//                             .toLowerCase()
//                             .includes(searchValue.toLowerCase())
//                         )
//                       );
//                       setShowSuggestions(true);
//                     }}
//                     onFocus={() => setShowSuggestions(true)}
//                     onBlur={() =>
//                       setTimeout(() => setShowSuggestions(false), 100)
//                     }
//                     placeholder="Search city..."
//                     className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
//                   />

//                   {showSuggestions && filteredCities.length > 0 && (
//                     <ul className="absolute bg-white border-b border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow z-10">
//                       {filteredCities.map((city) => (
//                         <li
//                           key={city.id}
//                           className="px-3 py-2 cursor-pointer hover:bg-gray-200"
//                           onClick={() => {
//                             registrationFormik.setFieldValue(
//                               "upazila_id",
//                               city.id
//                             );
//                             setCityInput(city.name);
//                             setShowSuggestions(false);
//                           }}
//                         >
//                           {city.name}
//                         </li>
//                       ))}
//                     </ul>
//                   )}

//                   {registrationFormik.touched.upazila_id &&
//                     registrationFormik.errors.upazila_id && (
//                       <span className="text-sm text-primary">
//                         {registrationFormik.errors.upazila_id}
//                       </span>
//                     )}
//                 </div>

//                 <div className="input-wrapper">
//                   <label
//                     htmlFor="address"
//                     className="text-sm font-medium text-gray-700 mb-1 block"
//                   >
//                     Address:
//                   </label>
//                   <input
//                     type="text"
//                     id="address"
//                     name="address"
//                     onChange={registrationFormik.handleChange}
//                     value={registrationFormik.values.address}
//                     onBlur={registrationFormik.handleBlur}
//                     placeholder="Enter Address"
//                     className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border focus:primary"
//                   />
//                   {registrationFormik.touched.address &&
//                     registrationFormik.errors.address && (
//                       <span className="text-sm text-primary">
//                         {registrationFormik.errors.address}
//                       </span>
//                     )}
//                 </div>
//               </div>

//               {userType === "tutor" && (
//                 <div className="input-wrapper">
//                   <label
//                     htmlFor="experience"
//                     className="text-sm font-medium text-gray-700 mb-1 block"
//                   >
//                     Experience:
//                   </label>
//                   <textarea
//                     id="experience"
//                     name="experience"
//                     onChange={registrationFormik.handleChange}
//                     value={registrationFormik.values.experience}
//                     onBlur={registrationFormik.handleBlur}
//                     placeholder="Describe your teaching experience"
//                     className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
//                     rows={4}
//                   />
//                   {registrationFormik.touched.experience &&
//                     registrationFormik.errors.experience && (
//                       <span className="text-sm text-primary">
//                         {registrationFormik.errors.experience}
//                       </span>
//                     )}
//                 </div>
//               )}

//               <div className="input-wrapper relative">
//                 <label
//                   htmlFor="password"
//                   className="text-sm font-medium text-gray-700 mb-1 block"
//                 >
//                   Enter Password:
//                 </label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   name="password"
//                   onChange={registrationFormik.handleChange}
//                   value={registrationFormik.values.password}
//                   onBlur={registrationFormik.handleBlur}
//                   placeholder="Enter Password"
//                   className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-[38px] text-sm text-gray500"
//                 >
//                   {showPassword ? <FiEye /> : <FiEyeOff />}
//                 </button>
//                 {registrationFormik.touched.password &&
//                   registrationFormik.errors.password && (
//                     <span className="text-sm text-primary">
//                       {registrationFormik.errors.password}
//                     </span>
//                   )}
//               </div>

//               <div className="input-wrapper relative">
//                 <label
//                   htmlFor="confirmPassword"
//                   className="text-sm font-medium text-gray-700 mb-1 block"
//                 >
//                   Enter Confirm Password:
//                 </label>
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   onChange={registrationFormik.handleChange}
//                   value={registrationFormik.values.confirmPassword}
//                   onBlur={registrationFormik.handleBlur}
//                   placeholder="Enter Confirm Password"
//                   className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-[38px] text-sm text-gray500"
//                 >
//                   {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
//                 </button>
//                 {registrationFormik.touched.confirmPassword &&
//                   registrationFormik.errors.confirmPassword && (
//                     <span className="text-sm text-primary">
//                       {registrationFormik.errors.confirmPassword}
//                     </span>
//                   )}
//               </div>

//               <button
//                 type="submit"
//                 onClick={registrationFormik.handleSubmit}
//                 className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary w-full rounded-md text-white p-2 transition !mt-[24px]"
//               >
//                 {loading && <FaSpinner className="animate-spin" />}
//                 Create New Account
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Registration;
