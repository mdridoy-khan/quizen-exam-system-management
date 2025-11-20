import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
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
import API from "../../api/API";
import { API_ENDPOINS } from "../../api/ApiEndpoints";
import FormImage from "../../assets/auth/authBg.jpg";
import { PATH } from "../../routes/PATH";

// Capitalize utility
const capitalize = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const Registration = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Refs for click outside
  const deptRef = useRef(null);
  const cityRef = useRef(null);
  const categoryRef = useRef(null);

  // States
  const [userType, setUserType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  // City (Upazila)
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [cityInput, setCityInput] = useState("");

  // Categories
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  // Class/Department
  const [classDepartments, setClassDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [showDeptSuggestions, setShowDeptSuggestions] = useState(false);
  const [deptInput, setDeptInput] = useState("");
  const [deptLoading, setDeptLoading] = useState(false);

  // Set userType from navigation state
  useEffect(() => {
    if (location.state?.userType) {
      setUserType(location.state.userType);
    }
  }, [location.state?.userType]);

  // Click Outside Handler - Hide dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptRef.current && !deptRef.current.contains(event.target)) {
        setShowDeptSuggestions(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCitySuggestions(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategorySuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Upazila
  useEffect(() => {
    API.get(API_ENDPOINS.UPAZILA_NAME)
      .then((res) => {
        if (res.data?.upazilas && Array.isArray(res.data.upazilas)) {
          setCities(res.data.upazilas);
          setFilteredCities(res.data.upazilas);
        }
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
        setApiError("Failed to load cities.");
      });
  }, []);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        setCategoryError(null);
        const res = await API.get("/auth/category/");
        if (res.status === 200 && Array.isArray(res.data)) {
          setCategories(res.data);
          setFilteredCategories(res.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategoryError(
          err.response?.data?.message || "Failed to load categories."
        );
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Class/Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDeptLoading(true);
        const res = await API.get(API_ENDPOINS.CLASS_DEPARTMENT);
        if (res.data && Array.isArray(res.data)) {
          setClassDepartments(res.data);
          setFilteredDepartments(res.data);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
        setApiError("Failed to load departments.");
      } finally {
        setDeptLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Handle category selection (case-insensitive duplicate prevent)
  const handleCategorySelect = (cat) => {
    if (
      !selectedCategories.some(
        (c) => c.toLowerCase() === cat.category_name.toLowerCase()
      )
    ) {
      setSelectedCategories((prev) => [...prev, cat.category_name]);
    }
    setCategoryInput("");
    setShowCategorySuggestions(false);
  };

  // Validation Schema
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(3, "Full Name must be at least 3 characters")
      .required("Full Name is required"),
    phoneNumber: Yup.string()
      .matches(/^\+?[0-9]{10,14}$/, "Enter a valid phone number")
      .required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    instutionName: Yup.string().required("Institution Name is required"),
    class_department_id: Yup.string().required(
      "Please select a class/department"
    ),
    experience: Yup.string().when([], {
      is: () => userType === "tutor",
      then: (schema) => schema.required("Experience is required for tutors"),
      otherwise: (schema) => schema.notRequired(),
    }),
    upazila_id: Yup.string().required("Please select a city"),
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

  const registrationFormik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      instutionName: "",
      class_department_id: "",
      experience: "",
      upazila_id: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      setApiError("");
      setApiSuccess("");
      const payload = {
        user_type: userType,
        ...(userType === "tutor" && { experience: values.experience }),
        full_name: values.fullName,
        phone: values.phoneNumber,
        gmail: values.email,
        institution: values.instutionName,
        class_department_id: values.class_department_id,
        address: values.address,
        upazila_id: values.upazila_id,
        password: values.password,
        confirm_password: values.confirmPassword,
        category_choice: selectedCategories.map(capitalize),
      };

      API.post(API_ENDPOINS.SIGN_UP, payload)
        .then((res) => {
          setApiSuccess(res.data.success || "Registration successful!");
          navigate(PATH.otpVerification, {
            state: { email: values.email, from: "registration" },
          });
        })
        .catch((err) => {
          setApiError(err.response?.data?.error || "Registration failed");
        })
        .finally(() => setLoading(false));
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
                alt="Signup"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 p-6 sm:p-10">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4">
                Sign Up
              </h3>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg text-gray-700 font-medium">
                  Register as a{" "}
                  <span
                    className={
                      userType === "student" ? "text-primary" : "text-gray-700"
                    }
                  >
                    Student
                  </span>{" "}
                  or{" "}
                  <span
                    className={
                      userType === "tutor" ? "text-primary" : "text-gray-700"
                    }
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
                    className="transition hover:text-primary"
                  />
                </Link>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setUserType("student")}
                  className={`flex-1 rounded-md p-2 transition ${
                    userType === "student"
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-[#F6F4E3] text-gray-700"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("tutor")}
                  className={`flex-1 rounded-md p-2 transition ${
                    userType === "tutor"
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-[#F6F4E3] text-gray-700"
                  }`}
                >
                  Tutor
                </button>
              </div>

              {(apiError || apiSuccess || categoryError) && (
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`flex items-center justify-between rounded py-1 px-2 w-full ${
                      apiError || categoryError ? "bg-pink-200" : "bg-green-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {(apiError || categoryError) && (
                        <HiMiniExclamationCircle size={20} color="#681923" />
                      )}
                      <span>{apiError || apiSuccess || categoryError}</span>
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
                className="space-y-4"
              >
                {/* Full Name */}
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter Your Full Name *"
                    className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
                    {...registrationFormik.getFieldProps("fullName")}
                  />
                  {registrationFormik.touched.fullName &&
                    registrationFormik.errors.fullName && (
                      <span className="text-sm text-primary">
                        {registrationFormik.errors.fullName}
                      </span>
                    )}
                </div>

                {/* Phone Number */}
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

                {/* Email */}
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email *"
                    className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
                    {...registrationFormik.getFieldProps("email")}
                  />
                  {registrationFormik.touched.email &&
                    registrationFormik.errors.email && (
                      <span className="text-sm text-primary">
                        {registrationFormik.errors.email}
                      </span>
                    )}
                </div>

                {/* Institution & Class/Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="instutionName"
                      placeholder="Enter Institution Name *"
                      className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
                      {...registrationFormik.getFieldProps("instutionName")}
                    />
                    {registrationFormik.touched.instutionName &&
                      registrationFormik.errors.instutionName && (
                        <span className="text-sm text-primary">
                          {registrationFormik.errors.instutionName}
                        </span>
                      )}
                  </div>

                  {/* Class/Department - PERFECT */}
                  <div className="input-wrapper relative" ref={deptRef}>
                    {deptLoading ? (
                      <div className="flex items-center text-gray-600 gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={deptInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDeptInput(val);
                          const filtered = val
                            ? classDepartments.filter((d) =>
                                d.class_department
                                  .toLowerCase()
                                  .includes(val.toLowerCase())
                              )
                            : classDepartments;
                          setFilteredDepartments(filtered);
                        }}
                        onFocus={() => {
                          setFilteredDepartments(classDepartments);
                          setShowDeptSuggestions(true);
                        }}
                        placeholder="Class / Department *"
                        className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
                      />
                    )}

                    {showDeptSuggestions && filteredDepartments.length > 0 && (
                      <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-lg z-50">
                        {filteredDepartments.map((dept) => (
                          <li
                            key={dept.id}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                            onClick={() => {
                              registrationFormik.setFieldValue(
                                "class_department_id",
                                dept.id
                              );
                              registrationFormik.setFieldTouched(
                                "class_department_id",
                                true,
                                false
                              );
                              setDeptInput(dept.class_department);
                              setShowDeptSuggestions(false);
                            }}
                          >
                            {dept.class_department}
                          </li>
                        ))}
                      </ul>
                    )}
                    {registrationFormik.touched.class_department_id &&
                      registrationFormik.errors.class_department_id && (
                        <span className="text-sm text-primary mt-1 block">
                          {registrationFormik.errors.class_department_id}
                        </span>
                      )}
                  </div>
                </div>

                {/* Upazila & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upazila - PERFECT */}
                  <div className="input-wrapper relative" ref={cityRef}>
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCityInput(val);
                        const filtered = val
                          ? cities.filter((c) =>
                              c.name.toLowerCase().includes(val.toLowerCase())
                            )
                          : cities;
                        setFilteredCities(filtered);
                      }}
                      onFocus={() => {
                        setFilteredCities(cities);
                        setShowCitySuggestions(true);
                      }}
                      placeholder="Your Upazila *"
                      className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
                    />

                    {showCitySuggestions && filteredCities.length > 0 && (
                      <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-lg z-50">
                        {filteredCities.map((city) => (
                          <li
                            key={city.id}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              registrationFormik.setFieldValue(
                                "upazila_id",
                                city.id
                              );
                              registrationFormik.setFieldTouched(
                                "upazila_id",
                                true,
                                false
                              );
                              setCityInput(city.name);
                              setShowCitySuggestions(false);
                            }}
                          >
                            {city.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    {registrationFormik.touched.upazila_id &&
                      registrationFormik.errors.upazila_id && (
                        <span className="text-sm text-primary mt-1 block">
                          {registrationFormik.errors.upazila_id}
                        </span>
                      )}
                  </div>

                  {/* Address */}
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter Address *"
                      className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
                      {...registrationFormik.getFieldProps("address")}
                    />
                    {registrationFormik.touched.address &&
                      registrationFormik.errors.address && (
                        <span className="text-sm text-primary">
                          {registrationFormik.errors.address}
                        </span>
                      )}
                  </div>
                </div>

                {/* Experience (Tutor Only) */}
                {userType === "tutor" && (
                  <div className="input-wrapper">
                    <textarea
                      name="experience"
                      placeholder="Describe your teaching experience *"
                      rows={4}
                      className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary resize-none"
                      {...registrationFormik.getFieldProps("experience")}
                    />
                    {registrationFormik.touched.experience &&
                      registrationFormik.errors.experience && (
                        <span className="text-sm text-primary">
                          {registrationFormik.errors.experience}
                        </span>
                      )}
                  </div>
                )}

                {/* Category Selection - PERFECT */}
                <div className="input-wrapper relative" ref={categoryRef}>
                  {categoryLoading ? (
                    <div className="flex items-center text-gray-600 gap-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading categories...</span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCategoryInput(val);
                        const filtered = val
                          ? categories.filter((cat) =>
                              cat.category_name
                                .toLowerCase()
                                .includes(val.toLowerCase())
                            )
                          : categories;
                        setFilteredCategories(filtered);
                      }}
                      onFocus={() => {
                        setFilteredCategories(categories);
                        setShowCategorySuggestions(true);
                      }}
                      placeholder="Search and select subjects..."
                      className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
                    />
                  )}

                  {showCategorySuggestions && filteredCategories.length > 0 && (
                    <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-lg z-50">
                      {filteredCategories.map((cat) => (
                        <li
                          key={cat.id}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm flex items-center gap-2"
                          onClick={() => handleCategorySelect(cat)}
                        >
                          <TbCategoryPlus size={16} />
                          {cat.category_name}
                        </li>
                      ))}
                    </ul>
                  )}

                  {selectedCategories.length > 0 && (
                    <div className="mt-3 p-3 border border-gray-300 rounded-md bg-gray-50 flex flex-wrap gap-2">
                      {selectedCategories.map((cat, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center bg-[#F6F4E3] text-secondary px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          {capitalize(cat)}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedCategories((prev) =>
                                prev.filter((c) => c !== cat)
                              )
                            }
                            className="ml-2 text-primary hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="input-wrapper relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter Password *"
                    className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary pr-10"
                    {...registrationFormik.getFieldProps("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  {registrationFormik.touched.password &&
                    registrationFormik.errors.password && (
                      <span className="text-sm text-primary">
                        {registrationFormik.errors.password}
                      </span>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="input-wrapper relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Enter Confirm Password *"
                    className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary pr-10"
                    {...registrationFormik.getFieldProps("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  {registrationFormik.touched.confirmPassword &&
                    registrationFormik.errors.confirmPassword && (
                      <span className="text-sm text-primary">
                        {registrationFormik.errors.confirmPassword}
                      </span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || categoryLoading || deptLoading}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary w-full rounded-md text-white py-3 mt-6 disabled:opacity-50 font-medium text-lg transition hover:shadow-lg"
                >
                  {loading && <FaSpinner className="animate-spin" />}
                  Create New Account
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-sm">
                  Already have an Account?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    Login Here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
// import { useFormik } from "formik";
// import { useEffect, useState } from "react";
// import { FaSpinner } from "react-icons/fa";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import { HiMiniExclamationCircle } from "react-icons/hi2";
// import { IoCloseOutline } from "react-icons/io5";
// import { MdOutlineKeyboardBackspace } from "react-icons/md";
// import { TbCategoryPlus } from "react-icons/tb";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import FormImage from "../../assets/auth/authBg.jpg";
// import { PATH } from "../../routes/PATH";

// // Capitalize utility
// const capitalize = (str) =>
//   str
//     .split(" ")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join(" ");

// const Registration = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // States
//   const [userType, setUserType] = useState("student");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [apiSuccess, setApiSuccess] = useState("");

//   // City (Upazila)
//   const [cities, setCities] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [showCitySuggestions, setShowCitySuggestions] = useState(false);
//   const [cityInput, setCityInput] = useState("");

//   // Categories
//   const [categories, setCategories] = useState([]);
//   const [categoryLoading, setCategoryLoading] = useState(false);
//   const [categoryError, setCategoryError] = useState(null);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [categoryInput, setCategoryInput] = useState("");
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

//   // Class/Department
//   const [classDepartments, setClassDepartments] = useState([]);
//   const [filteredDepartments, setFilteredDepartments] = useState([]);
//   const [showDeptSuggestions, setShowDeptSuggestions] = useState(false);
//   const [deptInput, setDeptInput] = useState("");
//   const [deptLoading, setDeptLoading] = useState(false);

//   // Set userType from navigation state
//   useEffect(() => {
//     if (location.state?.userType) {
//       setUserType(location.state.userType);
//     }
//   }, [location.state?.userType]);

//   // Fetch Upazila
//   useEffect(() => {
//     API.get(API_ENDPOINS.UPAZILA_NAME)
//       .then((res) => {
//         if (res.data?.upazilas && Array.isArray(res.data.upazilas)) {
//           setCities(res.data.upazilas);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching cities:", err);
//         setApiError("Failed to load cities.");
//       });
//   }, []);

//   // Fetch Categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setCategoryLoading(true);
//         setCategoryError(null);
//         const res = await API.get("/auth/category/");
//         if (res.status === 200 && Array.isArray(res.data)) {
//           setCategories(res.data);
//         } else {
//           throw new Error("Invalid response");
//         }
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//         setCategoryError(
//           err.response?.data?.message ||
//             "Failed to load categories. Please try again."
//         );
//       } finally {
//         setCategoryLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch Class/Departments
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         setDeptLoading(true);
//         const res = await API.get(API_ENDPOINS.CLASS_DEPARTMENT);
//         if (res.data && Array.isArray(res.data)) {
//           setClassDepartments(res.data);
//         }
//       } catch (err) {
//         console.error("Error fetching departments:", err);
//         setApiError("Failed to load departments.");
//       } finally {
//         setDeptLoading(false);
//       }
//     };
//     fetchDepartments();
//   }, []);

//   // Handle category selection
//   const handleCategorySelect = (cat) => {
//     if (!selectedCategories.includes(cat.category_name)) {
//       setSelectedCategories((prev) => [...prev, cat.category_name]);
//     }
//     setCategoryInput("");
//     setFilteredCategories([]);
//     setShowCategorySuggestions(false);
//   };

//   // Validation Schema
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
//     class_department_id: Yup.string().required(
//       "Please select a class/department"
//     ),
//     experience: Yup.string().when([], {
//       is: () => userType === "tutor",
//       then: (schema) => schema.required("Experience is required for tutors"),
//       otherwise: (schema) => schema.notRequired(),
//     }),
//     upazila_id: Yup.string().required("Please select a city"),
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

//   // Formik
//   const registrationFormik = useFormik({
//     initialValues: {
//       fullName: "",
//       phoneNumber: "",
//       email: "",
//       instutionName: "",
//       class_department_id: "",
//       experience: "",
//       upazila_id: "",
//       address: "",
//       password: "",
//       confirmPassword: "",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       setLoading(true);
//       setApiError("");
//       setApiSuccess("");

//       const payload = {
//         user_type: userType,
//         ...(userType === "tutor" && { experience: values.experience }),
//         full_name: values.fullName,
//         phone: values.phoneNumber,
//         gmail: values.email,
//         institution: values.instutionName,
//         class_department_id: values.class_department_id,
//         address: values.address,
//         upazila_id: values.upazila_id,
//         password: values.password,
//         confirm_password: values.confirmPassword,
//         category_choice: selectedCategories.map(capitalize),
//       };

//       API.post(API_ENDPOINS.SIGN_UP, payload)
//         .then((res) => {
//           const successMessage = res.data.success || "Registration successful!";
//           setApiSuccess(successMessage);
//           navigate(PATH.otpVerification, {
//             state: { email: values.email, from: "registration" },
//           });
//         })
//         .catch((err) => {
//           const errorMessage =
//             err.response?.data?.error || "Registration failed";
//           setApiError(errorMessage);
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     },
//   });

//   return (
//     <>
//       <div className="container mx-auto px-4">
//         <div className="flex justify-center items-center min-h-screen py-10">
//           <div className="flex bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl w-full">
//             <div className="hidden lg:block w-[45%]">
//               <img
//                 src={FormImage}
//                 alt="Signup"
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             <div className="flex-1 p-6 sm:p-10">
//               <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4">
//                 Sign Up
//               </h3>

//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-base lg:text-lg text-gray-700 font-medium">
//                   Register as a{" "}
//                   <span
//                     className={
//                       userType === "student" ? "text-primary" : "text-gray-700"
//                     }
//                   >
//                     Student
//                   </span>{" "}
//                   or{" "}
//                   <span
//                     className={
//                       userType === "tutor" ? "text-primary" : "text-gray-700"
//                     }
//                   >
//                     Tutor
//                   </span>
//                 </h3>
//                 <Link
//                   to="/"
//                   className="w-6 h-5 flex items-center justify-center"
//                 >
//                   <MdOutlineKeyboardBackspace
//                     size={24}
//                     className="transition hover:text-primary"
//                   />
//                 </Link>
//               </div>

//               <div className="flex gap-2 mb-4">
//                 <button
//                   type="button"
//                   onClick={() => setUserType("student")}
//                   className={`flex-1 rounded-md p-2 transition ${
//                     userType === "student"
//                       ? "bg-gradient-to-r from-primary to-secondary text-white"
//                       : "bg-[#F6F4E3] text-gray-700"
//                   }`}
//                 >
//                   Student
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setUserType("tutor")}
//                   className={`flex-1 rounded-md p-2 transition ${
//                     userType === "tutor"
//                       ? "bg-gradient-to-r from-primary to-secondary text-white"
//                       : "bg-[#F6F4E3] text-gray-700"
//                   }`}
//                 >
//                   Tutor
//                 </button>
//               </div>

//               {(apiError || apiSuccess || categoryError) && (
//                 <div className="flex items-center justify-center mb-4">
//                   <div
//                     className={`flex items-center justify-between rounded py-1 px-2 w-full ${
//                       apiError || categoryError ? "bg-pink-200" : "bg-green-100"
//                     }`}
//                   >
//                     <div className="flex items-center gap-2">
//                       {(apiError || categoryError) && (
//                         <HiMiniExclamationCircle size={20} color="#681923" />
//                       )}
//                       <span>{apiError || apiSuccess || categoryError}</span>
//                     </div>
//                     <button
//                       onClick={() => {
//                         setApiError("");
//                         setApiSuccess("");
//                         setCategoryError(null);
//                       }}
//                     >
//                       <IoCloseOutline size={20} />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <form
//                 onSubmit={registrationFormik.handleSubmit}
//                 className="space-y-4"
//               >
//                 {/* Full Name */}
//                 <div className="input-wrapper">
//                   <input
//                     type="text"
//                     name="fullName"
//                     placeholder="Enter Your Full Name *"
//                     className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
//                     {...registrationFormik.getFieldProps("fullName")}
//                   />
//                   {registrationFormik.touched.fullName &&
//                     registrationFormik.errors.fullName && (
//                       <span className="text-sm text-primary">
//                         {registrationFormik.errors.fullName}
//                       </span>
//                     )}
//                 </div>

//                 {/* Phone */}

//                 <div className="input-wrapper">
//                   {/* <label
//                       htmlFor="phoneNumber"
//                       className="text-sm font-medium text-gray-700 mb-1 block"
//                     >
//                       Phone No <span className="text-red-500">*</span>
//                     </label> */}
//                   <div className="flex gap-2 tel_wrapper">
//                     <PhoneInput
//                       country={"bd"}
//                       id="phoneNumber"
//                       name="phoneNumber"
//                       onChange={(phone) =>
//                         registrationFormik.setFieldValue(
//                           "phoneNumber",
//                           `+${phone}`
//                         )
//                       }
//                       value={registrationFormik.values.phoneNumber}
//                       onBlur={registrationFormik.handleBlur}
//                       placeholder="Enter Phone Number *"
//                       inputClass="!h-[42px] !w-full border-b border-gray-300 p-2 outline-none shadow_team1 focus:border-primary"
//                     />
//                   </div>
//                   {registrationFormik.touched.phoneNumber &&
//                     registrationFormik.errors.phoneNumber && (
//                       <span className="text-sm text-primary">
//                         {registrationFormik.errors.phoneNumber}
//                       </span>
//                     )}
//                 </div>

//                 {/* Email */}
//                 <div className="input-wrapper">
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Enter Email *"
//                     className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
//                     {...registrationFormik.getFieldProps("email")}
//                   />
//                   {registrationFormik.touched.email &&
//                     registrationFormik.errors.email && (
//                       <span className="text-sm text-primary">
//                         {registrationFormik.errors.email}
//                       </span>
//                     )}
//                 </div>

//                 {/* Institution & Department */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {/* Institution */}
//                   <div className="input-wrapper">
//                     <input
//                       type="text"
//                       name="instutionName"
//                       placeholder="Enter Institution Name *"
//                       className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
//                       {...registrationFormik.getFieldProps("instutionName")}
//                     />
//                     {registrationFormik.touched.instutionName &&
//                       registrationFormik.errors.instutionName && (
//                         <span className="text-sm text-primary">
//                           {registrationFormik.errors.instutionName}
//                         </span>
//                       )}
//                   </div>

//                   {/* Class/Department Autocomplete */}
//                   <div className="input-wrapper relative">
//                     {deptLoading ? (
//                       <div className="flex items-center text-gray-600 gap-2">
//                         <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
//                         <span>Loading...</span>
//                       </div>
//                     ) : (
//                       <>
//                         <input
//                           type="text"
//                           value={deptInput}
//                           onChange={(e) => {
//                             const val = e.target.value;
//                             setDeptInput(val);
//                             const filtered = classDepartments.filter((d) =>
//                               d.class_department
//                                 .toLowerCase()
//                                 .includes(val.toLowerCase())
//                             );
//                             setFilteredDepartments(filtered);
//                             setShowDeptSuggestions(true);
//                           }}
//                           onFocus={() => setShowDeptSuggestions(true)}
//                           placeholder="Enter Department/Class Name *"
//                           className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
//                         />

//                         {showDeptSuggestions &&
//                           filteredDepartments.length > 0 && (
//                             <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow z-20">
//                               {filteredDepartments.map((dept) => (
//                                 <li
//                                   key={dept.id}
//                                   className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
//                                   onMouseDown={(e) => e.preventDefault()}
//                                   onClick={() => {
//                                     registrationFormik.setFieldValue(
//                                       "class_department_id",
//                                       dept.id
//                                     );
//                                     setDeptInput(dept.class_department);
//                                     setShowDeptSuggestions(false);
//                                   }}
//                                 >
//                                   {dept.class_department}
//                                 </li>
//                               ))}
//                             </ul>
//                           )}

//                         {showDeptSuggestions &&
//                           filteredDepartments.length === 0 &&
//                           deptInput && (
//                             <div className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full p-2 text-sm text-gray-500">
//                               No department found
//                             </div>
//                           )}
//                       </>
//                     )}
//                     {registrationFormik.touched.class_department_id &&
//                       registrationFormik.errors.class_department_id && (
//                         <span className="text-sm text-primary">
//                           {registrationFormik.errors.class_department_id}
//                         </span>
//                       )}
//                   </div>
//                 </div>

//                 {/* Upazila & Address */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {/* Upazila Autocomplete */}
//                   <div className="input-wrapper relative">
//                     <input
//                       type="text"
//                       value={cityInput}
//                       onChange={(e) => {
//                         const val = e.target.value;
//                         setCityInput(val);
//                         const filtered = cities.filter((c) =>
//                           c.name.toLowerCase().includes(val.toLowerCase())
//                         );
//                         setFilteredCities(filtered);
//                         setShowCitySuggestions(true);
//                       }}
//                       onFocus={() => setShowCitySuggestions(true)}
//                       placeholder="Your Upazila *"
//                       className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
//                     />

//                     {showCitySuggestions && filteredCities.length > 0 && (
//                       <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow z-20">
//                         {filteredCities.map((city) => (
//                           <li
//                             key={city.id}
//                             className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                             onMouseDown={(e) => e.preventDefault()}
//                             onClick={() => {
//                               registrationFormik.setFieldValue(
//                                 "upazila_id",
//                                 city.id
//                               );
//                               setCityInput(city.name);
//                               setShowCitySuggestions(false);
//                             }}
//                           >
//                             {city.name}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                     {registrationFormik.touched.upazila_id &&
//                       registrationFormik.errors.upazila_id && (
//                         <span className="text-sm text-primary">
//                           {registrationFormik.errors.upazila_id}
//                         </span>
//                       )}
//                   </div>

//                   {/* Address */}
//                   <div className="input-wrapper">
//                     <input
//                       type="text"
//                       name="address"
//                       placeholder="Enter Address *"
//                       className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
//                       {...registrationFormik.getFieldProps("address")}
//                     />
//                     {registrationFormik.touched.address &&
//                       registrationFormik.errors.address && (
//                         <span className="text-sm text-primary">
//                           {registrationFormik.errors.address}
//                         </span>
//                       )}
//                   </div>
//                 </div>

//                 {/* Experience (Tutor Only) */}
//                 {userType === "tutor" && (
//                   <div className="input-wrapper">
//                     <textarea
//                       name="experience"
//                       placeholder="Describe your teaching experience *"
//                       className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
//                       rows={4}
//                       {...registrationFormik.getFieldProps("experience")}
//                     />
//                     {registrationFormik.touched.experience &&
//                       registrationFormik.errors.experience && (
//                         <span className="text-sm text-primary">
//                           {registrationFormik.errors.experience}
//                         </span>
//                       )}
//                   </div>
//                 )}

//                 {/* Category Selection */}
//                 <div className="input-wrapper relative">
//                   {categoryLoading ? (
//                     <div className="flex items-center text-gray-600 gap-2">
//                       <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
//                       <span>Loading categories...</span>
//                     </div>
//                   ) : (
//                     <>
//                       <input
//                         type="text"
//                         placeholder="Search and select subject..."
//                         value={categoryInput}
//                         onChange={(e) => {
//                           const val = e.target.value;
//                           setCategoryInput(val);
//                           const filtered = categories.filter((cat) =>
//                             cat.category_name
//                               .toLowerCase()
//                               .includes(val.toLowerCase())
//                           );
//                           setFilteredCategories(filtered);
//                           setShowCategorySuggestions(true);
//                         }}
//                         onFocus={() => setShowCategorySuggestions(true)}
//                         className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
//                       />

//                       {showCategorySuggestions &&
//                         filteredCategories.length > 0 && (
//                           <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow z-20">
//                             {filteredCategories.map((cat) => (
//                               <li
//                                 key={cat.id}
//                                 className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm flex items-center gap-2"
//                                 onMouseDown={(e) => e.preventDefault()}
//                                 onClick={() => handleCategorySelect(cat)}
//                               >
//                                 <TbCategoryPlus size={16} />
//                                 {cat.category_name}
//                               </li>
//                             ))}
//                           </ul>
//                         )}

//                       {selectedCategories.length > 0 && (
//                         <div className="mt-2 p-2 border border-gray-300 rounded-md min-h-[50px] bg-gray-50 flex flex-wrap gap-2">
//                           {selectedCategories.map((cat, i) => (
//                             <span
//                               key={i}
//                               className="inline-block bg-[#F6F4E3] text-secondary px-2 py-1 rounded-md text-sm"
//                             >
//                               {capitalize(cat)}
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   setSelectedCategories((prev) =>
//                                     prev.filter((c) => c !== cat)
//                                   )
//                                 }
//                                 className="ml-2 text-primary"
//                               >
//                                 &times;
//                               </button>
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 {/* Password */}
//                 <div className="input-wrapper relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder="Enter Password *"
//                     className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
//                     {...registrationFormik.getFieldProps("password")}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-gray-500"
//                   >
//                     {showPassword ? <FiEye /> : <FiEyeOff />}
//                   </button>
//                   {registrationFormik.touched.password &&
//                     registrationFormik.errors.password && (
//                       <span className="text-sm text-primary">
//                         {registrationFormik.errors.password}
//                       </span>
//                     )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div className="input-wrapper relative">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     placeholder="Enter Confirm Password *"
//                     className="w-full border-b border-gray-300 p-2 outline-none focus:border-primary"
//                     {...registrationFormik.getFieldProps("confirmPassword")}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-3 text-gray-500"
//                   >
//                     {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
//                   </button>
//                   {registrationFormik.touched.confirmPassword &&
//                     registrationFormik.errors.confirmPassword && (
//                       <span className="text-sm text-primary">
//                         {registrationFormik.errors.confirmPassword}
//                       </span>
//                     )}
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   disabled={loading || categoryLoading || deptLoading}
//                   className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary w-full rounded-md text-white p-2 transition mt-6 disabled:opacity-50"
//                 >
//                   {loading && <FaSpinner className="animate-spin" />}
//                   Create New Account
//                 </button>
//               </form>

//               <div className="text-center mt-6">
//                 <p className="text-sm">
//                   Already have an Account?{" "}
//                   <Link to="/login" className="text-primary">
//                     Login Here
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Registration;

// // without category list

// // import { useFormik } from "formik";
// // import { useEffect, useState } from "react";
// // import { FaSpinner } from "react-icons/fa";
// // import { FiEye, FiEyeOff } from "react-icons/fi";
// // import { HiMiniExclamationCircle } from "react-icons/hi2";
// // import { IoCloseOutline } from "react-icons/io5";
// // import { MdOutlineKeyboardBackspace } from "react-icons/md";
// // import PhoneInput from "react-phone-input-2";
// // import "react-phone-input-2/lib/style.css";
// // import { Link, useLocation, useNavigate } from "react-router-dom";
// // import * as Yup from "yup";
// // import API from "../../api/API";
// // import { API_ENDPOINS } from "../../api/ApiEndpoints";
// // import Eduwise from "../../assets/icons/eduwise.png";
// // import Facebook from "../../assets/icons/facebook.png";
// // import Github from "../../assets/icons/github.png";
// // import Google from "../../assets/icons/google.png";
// // import TutorWise from "../../assets/icons/tutorwise.png";
// // import { PATH } from "../../routes/PATH";

// // const Registration = () => {
// //   const navigate = useNavigate();
// //   const [userType, setUserType] = useState("student");
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [cities, setCities] = useState([]);
// //   const [filteredCities, setFilteredCities] = useState([]);
// //   const [showSuggestions, setShowSuggestions] = useState(false);
// //   const [cityInput, setCityInput] = useState("");
// //   const [apiError, setApiError] = useState("");
// //   const [apiSuccess, setApiSuccess] = useState("");

// //   const location = useLocation();

// //   // user type base tab select
// //   useEffect(() => {
// //     if (location.state?.userType) {
// //       setUserType(location.state.userType);
// //     }
// //   }, [location.state]);

// //   // Upazila name list call
// //   useEffect(() => {
// //     API.get(API_ENDPOINS.UPAZILA_NAME)
// //       .then((res) => {
// //         if (res.data?.upazilas && Array.isArray(res.data.upazilas)) {
// //           setCities(res.data.upazilas);
// //         }
// //       })
// //       .catch((err) => {
// //         console.error("Error fetching cities:", err);
// //         setApiError("Failed to load cities. Please try again.");
// //       });
// //   }, []);

// //   // Registration form validation here
// //   const validationSchema = Yup.object({
// //     fullName: Yup.string()
// //       .min(3, "Full Name must be at least 3 characters")
// //       .required("Full Name is required"),
// //     phoneNumber: Yup.string()
// //       .matches(
// //         /^\+?[0-9]{10,14}$/,
// //         "Enter a valid phone number with country code"
// //       )
// //       .required("Phone number is required"),
// //     email: Yup.string()
// //       .email("Invalid email format")
// //       .required("Email is required"),
// //     instutionName: Yup.string().required("Institution Name is required"),
// //     departmentName: Yup.string().required("Department Name is required"),
// //     experience: Yup.string().when([], {
// //       is: () => userType === "tutor",
// //       then: (schema) => schema.required("Experience is required for tutors"),
// //       otherwise: (schema) => schema.notRequired(),
// //     }),
// //     upazila_id: Yup.string()
// //       .required("Please select a city")
// //       .test(
// //         "is-valid",
// //         "Invalid city selection",
// //         (value) => !!value && value.trim() !== ""
// //       ),
// //     address: Yup.string().required("Address is required"),
// //     password: Yup.string()
// //       .matches(/[A-Z]/, "Must contain at least one uppercase letter")
// //       .matches(/[a-z]/, "Must contain at least one lowercase letter")
// //       .matches(/[0-9]/, "Must contain at least one number")
// //       .matches(/[@$!%*?&]/, "Must contain at least one special character")
// //       .min(8, "Password must be at least 8 characters long")
// //       .required("Password is required"),
// //     confirmPassword: Yup.string()
// //       .oneOf([Yup.ref("password"), null], "Passwords must match")
// //       .required("Confirm password is required"),
// //   });

// //   // Handle submit registration form here
// //   const handleSubmitRegistration = (values) => {
// //     setLoading(true);
// //     setApiError("");
// //     setApiSuccess("");
// //     const payload = {
// //       user_type: userType,
// //       ...(userType === "tutor" && { experience: values.experience }),
// //       full_name: values.fullName,
// //       phone: values.phoneNumber,
// //       gmail: values.email,
// //       department: values.departmentName,
// //       institution: values.instutionName,
// //       address: values.address,
// //       upazila_id: values.upazila_id || "637",
// //       password: values.password,
// //       confirm_password: values.confirmPassword,
// //     };

// //     // Sign up API handle
// //     API.post(API_ENDPOINS.SIGN_UP, payload)
// //       .then((res) => {
// //         const successMessage = res.data.success;
// //         if (successMessage) {
// //           setApiSuccess(successMessage);
// //         }
// //         navigate(PATH.otpVerification, {
// //           state: { email: values.email, from: "registration" },
// //         });
// //       })
// //       .catch((err) => {
// //         console.error(err);
// //         const errorMessage = err.response?.data?.error || "Registration failed";
// //         setApiError(errorMessage);
// //       })
// //       .finally(() => {
// //         setLoading(false);
// //       });
// //   };

// //   // UseFormik with Yup validation
// //   const registrationFormik = useFormik({
// //     initialValues: {
// //       fullName: "",
// //       phoneNumber: "",
// //       email: "",
// //       instutionName: "",
// //       departmentName: "",
// //       experience: "",
// //       upazila_id: "",
// //       address: "",
// //       password: "",
// //       confirmPassword: "",
// //     },
// //     validationSchema,
// //     onSubmit: handleSubmitRegistration,
// //   });

// //   return (
// //     <>
// //       <div className="container mx-auto px-4 mb-20">
// //         <div className="text-center mb-10 lg:mb-16">
// //           <h3 className="text-xl lg:text-2xl font-semibold mb-0">
// //             Create a FleekQuiz Account
// //           </h3>
// //           <p className="text-sm">
// //             Already have an Account?{" "}
// //             <Link
// //               to="/login"
// //               className="inline-block bg-gradient-to-r from-primary to-secondary px-1 rounded text-white"
// //             >
// //               log in
// //             </Link>
// //           </p>
// //         </div>

// //         <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
// //           <div className="space-y-4 mb-6 lg:mb-0">
// //             <h3 className="text-base lg:text-lg text-gray-700 font-medium relative">
// //               Login with TutorWise / EduWise / Social Profile
// //             </h3>
// //             <div className="flex items-center gap-1">
// //               <a href="#" className="flex">
// //                 <img
// //                   src={Eduwise}
// //                   alt="eduwise logo"
// //                   className="h-20 border border-gray-text-gray-700"
// //                 />
// //               </a>
// //               <a href="#" className="flex">
// //                 <img
// //                   src={TutorWise}
// //                   alt="tutorwise logo"
// //                   className="h-20 border border-gray-text-gray-700"
// //                 />
// //               </a>
// //             </div>
// //             <div className="flex items-center justify-center gap-1">
// //               <a href="#" className="flex">
// //                 <img src={Facebook} alt="Facebook logo" className="w-[60px]" />
// //               </a>
// //               <a href="#" className="flex">
// //                 <img src={Google} alt="Google logo" className="w-[60px]" />
// //               </a>
// //               <a href="#" className="flex">
// //                 <img src={Github} alt="Github logo" className="w-[60px]" />
// //               </a>
// //             </div>
// //           </div>

// //           <div className="space-y-4 lg:pl-4 lg:border-l-2 lg:border-slate200">
// //             <div className="flex items-center justify-between">
// //               <h3 className="text-base lg:text-lg text-gray-700 font-medium relative">
// //                 Register as a{" "}
// //                 <span
// //                   className={`px-1 rounded ${
// //                     userType === "student"
// //                       ? "bg-gradient-to-r from-primary to-secondary text-white py-0"
// //                       : "text-gray-700"
// //                   }`}
// //                 >
// //                   Student
// //                 </span>{" "}
// //                 or{" "}
// //                 <span
// //                   className={`px-1 rounded ${
// //                     userType === "tutor"
// //                       ? "bg-gradient-to-r from-primary to-secondary text-white py-0"
// //                       : "text-gray-700"
// //                   }`}
// //                 >
// //                   Tutor
// //                 </span>
// //               </h3>
// //               <Link to="/" className="w-6 h-5 flex items-center justify-center">
// //                 <MdOutlineKeyboardBackspace size={24} className="w-full" />
// //               </Link>
// //             </div>

// //             <div className="flex items-center gap-2">
// //               <button
// //                 type="button"
// //                 onClick={() => setUserType("student")}
// //                 className={`${
// //                   userType === "student"
// //                     ? "bg-gradient-to-r from-primary to-secondary text-white"
// //                     : "bg-gray-200 text-gray-700"
// //                 } block w-full rounded-md p-2 transition`}
// //               >
// //                 Student
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setUserType("tutor")}
// //                 className={`${
// //                   userType === "tutor"
// //                     ? "bg-gradient-to-r from-primary to-secondary text-white"
// //                     : "bg-gray-200 text-gray-700"
// //                 } block w-full rounded-md p-2 transition`}
// //               >
// //                 Tutor
// //               </button>
// //             </div>

// //             {/* API Error/Success Display */}
// //             {(apiError || apiSuccess) && (
// //               <div className="flex items-center justify-center mb-6">
// //                 <div
// //                   className={`flex items-center justify-between rounded py-1 px-2 ${
// //                     apiError ? "bg-pink200" : "bg-green100"
// //                   }`}
// //                 >
// //                   <div className="flex items-center gap-2">
// //                     {apiError && (
// //                       <HiMiniExclamationCircle size={20} color="#681923" />
// //                     )}
// //                     <span className="block">{apiError || apiSuccess}</span>
// //                   </div>
// //                   <button
// //                     onClick={() => {
// //                       setApiError("");
// //                       setApiSuccess("");
// //                     }}
// //                   >
// //                     <IoCloseOutline size={20} />
// //                   </button>
// //                 </div>
// //               </div>
// //             )}

// //             <form
// //               onSubmit={registrationFormik.handleSubmit}
// //               className="space-y-2"
// //             >
// //               <div className="input-wrapper">
// //                 <label
// //                   htmlFor="fullName"
// //                   className="text-sm font-medium text-gray-700 mb-1 block"
// //                 >
// //                   Full Name
// //                 </label>
// //                 <input
// //                   type="text"
// //                   id="fullName"
// //                   name="fullName"
// //                   onChange={registrationFormik.handleChange}
// //                   value={registrationFormik.values.fullName}
// //                   onBlur={registrationFormik.handleBlur}
// //                   placeholder="Enter Your Full Name"
// //                   className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
// //                   required
// //                 />
// //                 {registrationFormik.touched.fullName &&
// //                   registrationFormik.errors.fullName && (
// //                     <span className="text-sm text-primary">
// //                       {registrationFormik.errors.fullName}
// //                     </span>
// //                   )}
// //               </div>

// //               <div className="input-wrapper">
// //                 <label
// //                   htmlFor="phoneNumber"
// //                   className="text-sm font-medium text-gray-700 mb-1 block"
// //                 >
// //                   Phone No:
// //                 </label>
// //                 <div className="flex gap-2">
// //                   <PhoneInput
// //                     country={"bd"}
// //                     id="phoneNumber"
// //                     name="phoneNumber"
// //                     onChange={(phone) =>
// //                       registrationFormik.setFieldValue(
// //                         "phoneNumber",
// //                         `+${phone}`
// //                       )
// //                     }
// //                     value={registrationFormik.values.phoneNumber}
// //                     onBlur={registrationFormik.handleBlur}
// //                     placeholder="Enter Phone Number"
// //                     inputClass="!h-[42px] !w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
// //                   />
// //                 </div>
// //                 {registrationFormik.touched.phoneNumber &&
// //                   registrationFormik.errors.phoneNumber && (
// //                     <span className="text-sm text-primary">
// //                       {registrationFormik.errors.phoneNumber}
// //                     </span>
// //                   )}
// //               </div>

// //               <div className="input-wrapper">
// //                 <label
// //                   htmlFor="email"
// //                   className="text-sm font-medium text-gray-700 mb-1 block"
// //                 >
// //                   Email:
// //                 </label>
// //                 <input
// //                   type="email"
// //                   id="email"
// //                   name="email"
// //                   onChange={registrationFormik.handleChange}
// //                   value={registrationFormik.values.email}
// //                   onBlur={registrationFormik.handleBlur}
// //                   placeholder="Enter Email"
// //                   className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
// //                 />
// //                 {registrationFormik.touched.email &&
// //                   registrationFormik.errors.email && (
// //                     <span className="text-sm text-primary">
// //                       {registrationFormik.errors.email}
// //                     </span>
// //                   )}
// //               </div>

// //               <div className="input-group grid grid-cols-2 gap-2">
// //                 <div className="input-wrapper">
// //                   <label
// //                     htmlFor="instutionName"
// //                     className="text-sm font-medium text-gray-700 mb-1 block"
// //                   >
// //                     Institution Name:
// //                   </label>
// //                   <input
// //                     type="text"
// //                     id="instutionName"
// //                     name="instutionName"
// //                     onChange={registrationFormik.handleChange}
// //                     value={registrationFormik.values.instutionName}
// //                     onBlur={registrationFormik.handleBlur}
// //                     placeholder="Enter Institution Name"
// //                     className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
// //                   />
// //                   {registrationFormik.touched.instutionName &&
// //                     registrationFormik.errors.instutionName && (
// //                       <span className="text-sm text-primary">
// //                         {registrationFormik.errors.instutionName}
// //                       </span>
// //                     )}
// //                 </div>
// //                 <div className="input-wrapper">
// //                   <label
// //                     htmlFor="departmentName"
// //                     className="text-sm font-medium text-gray-700 mb-1 block"
// //                   >
// //                     Department Name:
// //                   </label>
// //                   <input
// //                     type="text"
// //                     id="departmentName"
// //                     name="departmentName"
// //                     onChange={registrationFormik.handleChange}
// //                     value={registrationFormik.values.departmentName}
// //                     onBlur={registrationFormik.handleBlur}
// //                     placeholder="Enter Department Name"
// //                     className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
// //                   />
// //                   {registrationFormik.touched.departmentName &&
// //                     registrationFormik.errors.departmentName && (
// //                       <span className="text-sm text-primary">
// //                         {registrationFormik.errors.departmentName}
// //                       </span>
// //                     )}
// //                 </div>
// //               </div>

// //               <div className="input-group grid grid-cols-2 gap-2">
// //                 <div className="input-wrapper relative">
// //                   <label
// //                     htmlFor="upazila_id"
// //                     className="text-sm font-medium text-gray-700 mb-1 block"
// //                   >
// //                     Choose City:
// //                   </label>
// //                   <input
// //                     type="text"
// //                     id="upazila_id"
// //                     name="upazila_id"
// //                     value={cityInput}
// //                     onChange={(e) => {
// //                       const searchValue = e.target.value;
// //                       setCityInput(searchValue);
// //                       setFilteredCities(
// //                         cities.filter((c) =>
// //                           c.name
// //                             .toLowerCase()
// //                             .includes(searchValue.toLowerCase())
// //                         )
// //                       );
// //                       setShowSuggestions(true);
// //                     }}
// //                     onFocus={() => setShowSuggestions(true)}
// //                     onBlur={() =>
// //                       setTimeout(() => setShowSuggestions(false), 100)
// //                     }
// //                     placeholder="Search city..."
// //                     className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
// //                   />

// //                   {showSuggestions && filteredCities.length > 0 && (
// //                     <ul className="absolute bg-white border-b border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow z-10">
// //                       {filteredCities.map((city) => (
// //                         <li
// //                           key={city.id}
// //                           className="px-3 py-2 cursor-pointer hover:bg-gray-200"
// //                           onClick={() => {
// //                             registrationFormik.setFieldValue(
// //                               "upazila_id",
// //                               city.id
// //                             );
// //                             setCityInput(city.name);
// //                             setShowSuggestions(false);
// //                           }}
// //                         >
// //                           {city.name}
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   )}

// //                   {registrationFormik.touched.upazila_id &&
// //                     registrationFormik.errors.upazila_id && (
// //                       <span className="text-sm text-primary">
// //                         {registrationFormik.errors.upazila_id}
// //                       </span>
// //                     )}
// //                 </div>

// //                 <div className="input-wrapper">
// //                   <label
// //                     htmlFor="address"
// //                     className="text-sm font-medium text-gray-700 mb-1 block"
// //                   >
// //                     Address:
// //                   </label>
// //                   <input
// //                     type="text"
// //                     id="address"
// //                     name="address"
// //                     onChange={registrationFormik.handleChange}
// //                     value={registrationFormik.values.address}
// //                     onBlur={registrationFormik.handleBlur}
// //                     placeholder="Enter Address"
// //                     className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border focus:primary"
// //                   />
// //                   {registrationFormik.touched.address &&
// //                     registrationFormik.errors.address && (
// //                       <span className="text-sm text-primary">
// //                         {registrationFormik.errors.address}
// //                       </span>
// //                     )}
// //                 </div>
// //               </div>

// //               {userType === "tutor" && (
// //                 <div className="input-wrapper">
// //                   <label
// //                     htmlFor="experience"
// //                     className="text-sm font-medium text-gray-700 mb-1 block"
// //                   >
// //                     Experience:
// //                   </label>
// //                   <textarea
// //                     id="experience"
// //                     name="experience"
// //                     onChange={registrationFormik.handleChange}
// //                     value={registrationFormik.values.experience}
// //                     onBlur={registrationFormik.handleBlur}
// //                     placeholder="Describe your teaching experience"
// //                     className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
// //                     rows={4}
// //                   />
// //                   {registrationFormik.touched.experience &&
// //                     registrationFormik.errors.experience && (
// //                       <span className="text-sm text-primary">
// //                         {registrationFormik.errors.experience}
// //                       </span>
// //                     )}
// //                 </div>
// //               )}

// //               <div className="input-wrapper relative">
// //                 <label
// //                   htmlFor="password"
// //                   className="text-sm font-medium text-gray-700 mb-1 block"
// //                 >
// //                   Enter Password:
// //                 </label>
// //                 <input
// //                   type={showPassword ? "text" : "password"}
// //                   id="password"
// //                   name="password"
// //                   onChange={registrationFormik.handleChange}
// //                   value={registrationFormik.values.password}
// //                   onBlur={registrationFormik.handleBlur}
// //                   placeholder="Enter Password"
// //                   className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   className="absolute right-3 top-[38px] text-sm text-gray500"
// //                 >
// //                   {showPassword ? <FiEye /> : <FiEyeOff />}
// //                 </button>
// //                 {registrationFormik.touched.password &&
// //                   registrationFormik.errors.password && (
// //                     <span className="text-sm text-primary">
// //                       {registrationFormik.errors.password}
// //                     </span>
// //                   )}
// //               </div>

// //               <div className="input-wrapper relative">
// //                 <label
// //                   htmlFor="confirmPassword"
// //                   className="text-sm font-medium text-gray-700 mb-1 block"
// //                 >
// //                   Enter Confirm Password:
// //                 </label>
// //                 <input
// //                   type={showConfirmPassword ? "text" : "password"}
// //                   id="confirmPassword"
// //                   name="confirmPassword"
// //                   onChange={registrationFormik.handleChange}
// //                   value={registrationFormik.values.confirmPassword}
// //                   onBlur={registrationFormik.handleBlur}
// //                   placeholder="Enter Confirm Password"
// //                   className="w-full border-b border-gray-300 p-2 outline-none shadow-none focus:border-primary"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// //                   className="absolute right-3 top-[38px] text-sm text-gray500"
// //                 >
// //                   {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
// //                 </button>
// //                 {registrationFormik.touched.confirmPassword &&
// //                   registrationFormik.errors.confirmPassword && (
// //                     <span className="text-sm text-primary">
// //                       {registrationFormik.errors.confirmPassword}
// //                     </span>
// //                   )}
// //               </div>

// //               <button
// //                 type="submit"
// //                 onClick={registrationFormik.handleSubmit}
// //                 className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary w-full rounded-md text-white p-2 transition !mt-[24px]"
// //               >
// //                 {loading && <FaSpinner className="animate-spin" />}
// //                 Create New Account
// //               </button>
// //             </form>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default Registration;
