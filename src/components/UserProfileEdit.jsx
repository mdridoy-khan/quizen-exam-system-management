import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import "react-phone-input-2/lib/style.css";
import * as Yup from "yup";
import API from "../api/API";
import { API_ENDPOINS } from "../api/ApiEndpoints";

const UserProfileEdit = ({ userData, onCancelModal, onProfileUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(
    userData?.profile_picture || null
  );
  const [profileFile, setProfileFile] = useState(null);

  // fetch upazila data
  useEffect(() => {
    setLoading(true);
    API.get(API_ENDPOINS.UPAZILA_NAME)
      .then((res) => {
        if (Array.isArray(res.data?.upazilas)) {
          setCities(res.data.upazilas);
        }
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
        setErrorMessage("Failed to load cities. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const validationSchema = Yup.object({
    fullName: Yup.string().min(3, "At least 3 characters").required("Required"),
    phoneNumber: Yup.string()
      .matches(/^\+?[0-9]{10,14}$/, "Invalid phone number")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    instutionName: Yup.string().required("Required"),
    departmentName: Yup.string().required("Required"),
    upazila_id: Yup.string().required("Please select a city"),
    address: Yup.string().required("Required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: userData?.full_name || "",
      phoneNumber: userData?.phone || "",
      email: userData?.gmail || "",
      instutionName: userData?.institution || "",
      departmentName: userData?.department || "",
      upazila_id: userData?.upazila_id || "",
      address: userData?.address || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      try {
        const formData = new FormData();
        formData.append("full_name", values.fullName);
        formData.append("phone", values.phoneNumber);
        formData.append("gmail", values.email);
        formData.append("institution", values.instutionName);
        formData.append("department", values.departmentName);
        formData.append("address", values.address);
        formData.append("upazila_id", values.upazila_id);
        if (profileFile) formData.append("profile_picture", profileFile);

        const res = await API.put(API_ENDPOINS.UPDATE_PROFILE, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const updatedData = res.data;
        onProfileUpdated(updatedData); // instantly updates parent
        setSuccessMessage("Profile updated successfully!");

        setTimeout(() => {
          onCancelModal();
        }, 1000);
      } catch (err) {
        console.error("Error updating profile:", err);
        setErrorMessage(
          err.response?.data?.message ||
            "Failed to update profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.upazila_id) {
      const selectedCity = cities.find(
        (c) => c.id === formik.values.upazila_id
      );
      setCityInput(selectedCity ? selectedCity.name : "");
    } else {
      setCityInput("");
    }
  }, [formik.values.upazila_id, cities]);

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    if (value === "") {
      formik.setFieldValue("upazila_id", "");
    } else {
      setFilteredCities(
        cities.filter((c) => c.name.toLowerCase().includes(value.toLowerCase()))
      );
      setShowSuggestions(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setPreviewImage(URL.createObjectURL(file)); // instant preview
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-2">
      {/* Close button */}
      <div className="flex items-center justify-end">
        <button type="button" onClick={onCancelModal}>
          <IoClose size={24} />
        </button>
      </div>

      <h3 className="text-center text-2xl font-semibold">
        Update Your Profile
      </h3>

      {/* Success / Error messages */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-2 rounded-md text-center">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-primary p-2 rounded-md text-center">
          {errorMessage}
        </div>
      )}

      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center space-y-3">
        <img
          src={previewImage || userData?.profile_picture}
          alt="Profile preview"
          className="w-24 h-24 object-cover rounded-full border"
        />
        <label className="cursor-pointer text-sm font-semibold text-primary hover:underline">
          Upload New Picture
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Full Name */}
      <div>
        <label className="text-sm font-medium">Full Name</label>
        <input
          type="text"
          name="fullName"
          onChange={formik.handleChange}
          value={formik.values.fullName}
          onBlur={formik.handleBlur}
          placeholder="Enter your full name"
          className="w-full border p-2 rounded-md focus:border-primary"
        />
        {formik.touched.fullName && formik.errors.fullName && (
          <span className="text-sm text-primary">{formik.errors.fullName}</span>
        )}
      </div>

      {/* Institution & Department */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium">Institution Name:</label>
          <input
            type="text"
            name="instutionName"
            onChange={formik.handleChange}
            value={formik.values.instutionName}
            onBlur={formik.handleBlur}
            className="w-full border p-2 rounded-md focus:border-primary"
          />
          {formik.touched.instutionName && formik.errors.instutionName && (
            <span className="text-sm text-primary">
              {formik.errors.instutionName}
            </span>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">Department Name:</label>
          <input
            type="text"
            name="departmentName"
            onChange={formik.handleChange}
            value={formik.values.departmentName}
            onBlur={formik.handleBlur}
            className="w-full border p-2 rounded-md focus:border-primary"
          />
          {formik.touched.departmentName && formik.errors.departmentName && (
            <span className="text-sm text-primary">
              {formik.errors.departmentName}
            </span>
          )}
        </div>
      </div>

      {/* City Search */}
      <div className="relative">
        <label className="text-sm font-medium">Choose City:</label>
        <input
          type="text"
          value={cityInput}
          onChange={handleCityChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          className="w-full border p-2 rounded-md focus:border-primary"
          placeholder="Search city..."
        />
        {showSuggestions && filteredCities.length > 0 && (
          <ul className="absolute bg-white border rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow z-10">
            {filteredCities.map((city) => (
              <li
                key={city.id}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  formik.setFieldValue("upazila_id", city.id);
                  setCityInput(city.name);
                  setShowSuggestions(false);
                }}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
        {formik.touched.upazila_id && formik.errors.upazila_id && (
          <span className="text-sm text-primary">
            {formik.errors.upazila_id}
          </span>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="text-sm font-medium">Address:</label>
        <input
          type="text"
          name="address"
          onChange={formik.handleChange}
          value={formik.values.address}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded-md focus:border-primary"
        />
        {formik.touched.address && formik.errors.address && (
          <span className="text-sm text-primary">{formik.errors.address}</span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary  w-full rounded-md text-white p-2 mt-4"
        disabled={loading}
      >
        {loading && <FaSpinner className="animate-spin" />}
        Update Profile
      </button>
    </form>
  );
};

export default UserProfileEdit;

// import { useFormik } from "formik";
// import { useEffect, useState } from "react";
// import { FaSpinner } from "react-icons/fa";
// import { IoClose } from "react-icons/io5";
// // import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import * as Yup from "yup";
// import API from "../api/API";
// import { API_ENDPOINS } from "../api/ApiEndpoints";

// const UserProfileEdit = ({ userData, onCancelModal, onProfileUpdated }) => {
//   const [loading, setLoading] = useState(false);
//   const [cities, setCities] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [cityInput, setCityInput] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     setLoading(true);
//     API.get(API_ENDPOINS.UPAZILA_NAME)
//       .then((res) => {
//         if (Array.isArray(res.data?.upazilas)) {
//           setCities(res.data.upazilas);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching cities:", err);
//         setErrorMessage("Failed to load cities. Please try again.");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const validationSchema = Yup.object({
//     fullName: Yup.string().min(3, "At least 3 characters").required("Required"),
//     phoneNumber: Yup.string()
//       .matches(/^\+?[0-9]{10,14}$/, "Invalid phone number")
//       .required("Required"),
//     email: Yup.string().email("Invalid email").required("Required"),
//     instutionName: Yup.string().required("Required"),
//     departmentName: Yup.string().required("Required"),
//     upazila_id: Yup.string().required("Please select a city"),
//     address: Yup.string().required("Required"),
//   });

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       fullName: userData?.full_name || "",
//       phoneNumber: userData?.phone || "",
//       email: userData?.gmail || "",
//       instutionName: userData?.institution || "",
//       departmentName: userData?.department || "",
//       upazila_id: userData?.upazila_id || "",
//       address: userData?.address || "",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       setLoading(true);
//       setSuccessMessage("");
//       setErrorMessage("");
//       const payload = {
//         full_name: values.fullName,
//         phone: values.phoneNumber,
//         gmail: values.email,
//         department: values.departmentName,
//         institution: values.instutionName,
//         address: values.address,
//         upazila_id: values.upazila_id || "",
//       };

//       API.put(API_ENDPOINS.UPDATE_PROFILE, payload)
//         .then((res) => {
//           const updatedData = res.data || payload;
//           onProfileUpdated(updatedData);
//           setSuccessMessage("Profile updated successfully!");
//           setTimeout(() => {
//             onCancelModal();
//           }, 1000);
//         })
//         .catch((err) => {
//           console.error("Error updating profile:", err);
//           setErrorMessage(
//             err.response?.data?.message ||
//               "Failed to update profile. Please try again."
//           );
//         })
//         .finally(() => setLoading(false));
//     },
//   });

//   useEffect(() => {
//     if (formik.values.upazila_id) {
//       const selectedCity = cities.find(
//         (c) => c.id === formik.values.upazila_id
//       );
//       setCityInput(selectedCity ? selectedCity.name : "");
//     } else {
//       setCityInput("");
//     }
//   }, [formik.values.upazila_id, cities]);

//   const handleCityChange = (e) => {
//     const value = e.target.value;
//     setCityInput(value);
//     if (value === "") {
//       formik.setFieldValue("upazila_id", "");
//     } else {
//       setFilteredCities(
//         cities.filter((c) => c.name.toLowerCase().includes(value.toLowerCase()))
//       );
//       setShowSuggestions(true);
//     }
//   };

//   return (
//     <form onSubmit={formik.handleSubmit} className="space-y-2">
//       <div className="flex items-center justify-end">
//         <button type="button" onClick={onCancelModal}>
//           <IoClose size={24} />
//         </button>
//       </div>
//       <h3 className="text-center text-2xl font-semibold">
//         Update Your Profile
//       </h3>

//       {/* Success Message */}
//       {successMessage && (
//         <div className="bg-green-100 text-green-700 p-2 rounded-md text-center">
//           {successMessage}
//         </div>
//       )}

//       {/* Error Message */}
//       {errorMessage && (
//         <div className="bg-red-100 text-primary p-2 rounded-md text-center">
//           {errorMessage}
//         </div>
//       )}

//       {/* Full Name */}
//       <div>
//         <label className="text-sm font-medium">Full Name</label>
//         <input
//           type="text"
//           name="fullName"
//           onChange={formik.handleChange}
//           value={formik.values.fullName}
//           onBlur={formik.handleBlur}
//           placeholder="Enter your full name"
//           className="w-full border p-2 rounded-md focus:border-primary"
//         />
//         {formik.touched.fullName && formik.errors.fullName && (
//           <span className="text-sm text-primary">{formik.errors.fullName}</span>
//         )}
//       </div>

//       {/* Phone Number */}
//       {/* <div>
//         <label className="text-sm font-medium">Phone No:</label>
//         <PhoneInput
//           country={"bd"}
//           value={formik.values.phoneNumber}
//           onChange={(phone) => formik.setFieldValue("phoneNumber", `+${phone}`)}
//           onBlur={formik.handleBlur}
//           inputClass="!h-[42px] !w-full border p-2 rounded-md"
//         />
//         {formik.touched.phoneNumber && formik.errors.phoneNumber && (
//           <span className="text-sm text-primary">
//             {formik.errors.phoneNumber}
//           </span>
//         )}
//       </div> */}

//       {/* Email */}
//       {/* <div>
//         <label className="text-sm font-medium">Email:</label>
//         <input
//           type="email"
//           name="email"
//           onChange={formik.handleChange}
//           value={formik.values.email}
//           onBlur={formik.handleBlur}
//           className="w-full border p-2 rounded-md"
//         />
//         {formik.touched.email && formik.errors.email && (
//           <span className="text-sm text-primary">{formik.errors.email}</span>
//         )}
//       </div> */}

//       {/* Institution & Department */}
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className="text-sm font-medium">Institution Name:</label>
//           <input
//             type="text"
//             name="instutionName"
//             onChange={formik.handleChange}
//             value={formik.values.instutionName}
//             onBlur={formik.handleBlur}
//             className="w-full border p-2 rounded-md focus:border-primary"
//           />
//           {formik.touched.instutionName && formik.errors.instutionName && (
//             <span className="text-sm text-primary">
//               {formik.errors.instutionName}
//             </span>
//           )}
//         </div>
//         <div>
//           <label className="text-sm font-medium">Department Name:</label>
//           <input
//             type="text"
//             name="departmentName"
//             onChange={formik.handleChange}
//             value={formik.values.departmentName}
//             onBlur={formik.handleBlur}
//             className="w-full border p-2 rounded-md focus:border-primary"
//           />
//           {formik.touched.departmentName && formik.errors.departmentName && (
//             <span className="text-sm text-primary">
//               {formik.errors.departmentName}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* City Search */}
//       <div className="relative">
//         <label className="text-sm font-medium">Choose City:</label>
//         <input
//           type="text"
//           value={cityInput}
//           onChange={handleCityChange}
//           onFocus={() => setShowSuggestions(true)}
//           onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
//           className="w-full border p-2 rounded-md focus:border-primary"
//           placeholder="Search city..."
//         />
//         {showSuggestions && filteredCities.length > 0 && (
//           <ul className="absolute bg-white border rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow z-10">
//             {filteredCities.map((city) => (
//               <li
//                 key={city.id}
//                 className="px-3 py-2 cursor-pointer hover:bg-gray200"
//                 onClick={() => {
//                   formik.setFieldValue("upazila_id", city.id);
//                   setCityInput(city.name);
//                   setShowSuggestions(false);
//                 }}
//               >
//                 {city.name}
//               </li>
//             ))}
//           </ul>
//         )}
//         {formik.touched.upazila_id && formik.errors.upazila_id && (
//           <span className="text-sm text-primary">
//             {formik.errors.upazila_id}
//           </span>
//         )}
//       </div>

//       {/* Address */}
//       <div>
//         <label className="text-sm font-medium">Address:</label>
//         <input
//           type="text"
//           name="address"
//           onChange={formik.handleChange}
//           value={formik.values.address}
//           onBlur={formik.handleBlur}
//           className="w-full border p-2 rounded-md focus:border-primary"
//         />
//         {formik.touched.address && formik.errors.address && (
//           <span className="text-sm text-primary">{formik.errors.address}</span>
//         )}
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary  w-full rounded-md text-white p-2 mt-4"
//         disabled={loading}
//       >
//         {loading && <FaSpinner className="animate-spin" />}
//         Update Profile
//       </button>
//     </form>
//   );
// };

// export default UserProfileEdit;

// import { useFormik } from "formik";
// import { useEffect, useState } from "react";
// import { FaSpinner } from "react-icons/fa";
// import { IoClose } from "react-icons/io5";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import * as Yup from "yup";
// import API from "../api/API";
// import { API_ENDPOINS } from "../api/ApiEndpoints";

// const UserProfileEdit = ({ userData, onCancelModal, onProfileUpdated }) => {
//   const [loading, setLoading] = useState(false);
//   const [cities, setCities] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [cityInput, setCityInput] = useState("");
//   const [successMessage, setSuccessMessage] = useState(""); // Add success message state

//   useEffect(() => {
//     API.get(API_ENDPOINS.UPAZILA_NAME)
//       .then((res) => {
//         if (Array.isArray(res.data?.upazilas)) {
//           setCities(res.data.upazilas);
//         }
//       })
//       .catch((err) => console.error("Error fetching cities:", err));
//   }, []);

//   const validationSchema = Yup.object({
//     fullName: Yup.string().min(3, "At least 3 characters").required("Required"),
//     phoneNumber: Yup.string()
//       .matches(/^\+?[0-9]{10,14}$/, "Invalid phone number")
//       .required("Required"),
//     email: Yup.string().email("Invalid email").required("Required"),
//     instutionName: Yup.string().required("Required"),
//     departmentName: Yup.string().required("Required"),
//     upazila_id: Yup.string().required("Please select a city"),
//     address: Yup.string().required("Required"),
//   });

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       fullName: userData?.full_name || "",
//       phoneNumber: userData?.phone || "",
//       email: userData?.gmail || "",
//       instutionName: userData?.institution || "",
//       departmentName: userData?.department || "",
//       upazila_id: userData?.upazila_id || "",
//       address: userData?.address || "",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       setLoading(true);
//       setSuccessMessage(""); // Clear previous success message
//       const payload = {
//         full_name: values.fullName,
//         phone: values.phoneNumber,
//         gmail: values.email,
//         department: values.departmentName,
//         institution: values.instutionName,
//         address: values.address,
//         upazila_id: values.upazila_id || "",
//       };

//       API.put(API_ENDPOINS.UPDATE_PROFILE, payload)
//         .then((res) => {
//           const updatedData = res.data || payload; // Use API response or payload
//           console.log("Updated data sent to UserProfileCard:", updatedData); // Debug log
//           onProfileUpdated(updatedData); // Pass updated data to parent
//           setSuccessMessage("Profile updated successfully!"); // Set success message
//           // Optionally delay closing or navigation if needed
//           setTimeout(() => {
//             onCancelModal(); // Close modal after success
//           }, 1000); // 1-second delay to show success message
//         })
//         .catch((err) => {
//           console.error("Error updating profile:", err);
//         })
//         .finally(() => setLoading(false));
//     },
//   });

//   // Update city input when upazila_id changes
//   useEffect(() => {
//     if (formik.values.upazila_id) {
//       const selectedCity = cities.find(
//         (c) => c.id === formik.values.upazila_id
//       );
//       setCityInput(selectedCity ? selectedCity.name : "");
//     } else {
//       setCityInput("");
//     }
//   }, [formik.values.upazila_id, cities]);

//   // Handle city input change with clearing logic
//   const handleCityChange = (e) => {
//     const value = e.target.value;
//     setCityInput(value);
//     if (value === "") {
//       formik.setFieldValue("upazila_id", ""); // Reset upazila_id when input is empty
//     } else {
//       setFilteredCities(
//         cities.filter((c) => c.name.toLowerCase().includes(value.toLowerCase()))
//       );
//       setShowSuggestions(true);
//     }
//   };

//   return (
//     <form onSubmit={formik.handleSubmit} className="space-y-2">
//       <div className="flex items-center justify-end">
//         <button type="button" onClick={onCancelModal}>
//           <IoClose size={24} />
//         </button>
//       </div>
//       <h3 className="text-center text-2xl font-semibold">
//         Update Your Profile
//       </h3>

//       {/* Success Message */}
//       {successMessage && (
//         <div className="bg-green100 text-green700 p-2 rounded-md text-center">
//           {successMessage}
//         </div>
//       )}

//       {/* Full Name */}
//       <div>
//         <label className="text-sm font-medium">Full Name</label>
//         <input
//           type="text"
//           name="fullName"
//           onChange={formik.handleChange}
//           value={formik.values.fullName}
//           onBlur={formik.handleBlur}
//           placeholder="Enter your full name"
//           className="w-full border p-2 rounded-md"
//         />
//         {formik.touched.fullName && formik.errors.fullName && (
//           <span className="text-sm text-primary">{formik.errors.fullName}</span>
//         )}
//       </div>

//       {/* Phone Number */}
//       <div>
//         <label className="text-sm font-medium">Phone No:</label>
//         <PhoneInput
//           country={"bd"}
//           value={formik.values.phoneNumber}
//           onChange={(phone) => formik.setFieldValue("phoneNumber", `+${phone}`)}
//           onBlur={formik.handleBlur}
//           inputClass="!h-[42px] !w-full border p-2 rounded-md"
//         />
//         {formik.touched.phoneNumber && formik.errors.phoneNumber && (
//           <span className="text-sm text-primary">
//             {formik.errors.phoneNumber}
//           </span>
//         )}
//       </div>

//       {/* Email */}
//       <div>
//         <label className="text-sm font-medium">Email:</label>
//         <input
//           type="email"
//           name="email"
//           onChange={formik.handleChange}
//           value={formik.values.email}
//           onBlur={formik.handleBlur}
//           className="w-full border p-2 rounded-md"
//         />
//         {formik.touched.email && formik.errors.email && (
//           <span className="text-sm text-primary">{formik.errors.email}</span>
//         )}
//       </div>

//       {/* Institution & Department */}
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className="text-sm font-medium">Institution Name:</label>
//           <input
//             type="text"
//             name="instutionName"
//             onChange={formik.handleChange}
//             value={formik.values.instutionName}
//             onBlur={formik.handleBlur}
//             className="w-full border p-2 rounded-md"
//           />
//           {formik.touched.instutionName && formik.errors.instutionName && (
//             <span className="text-sm text-primary">
//               {formik.errors.instutionName}
//             </span>
//           )}
//         </div>
//         <div>
//           <label className="text-sm font-medium">Department Name:</label>
//           <input
//             type="text"
//             name="departmentName"
//             onChange={formik.handleChange}
//             value={formik.values.departmentName}
//             onBlur={formik.handleBlur}
//             className="w-full border p-2 rounded-md"
//           />
//           {formik.touched.departmentName && formik.errors.departmentName && (
//             <span className="text-sm text-primary">
//               {formik.errors.departmentName}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* City Search */}
//       <div className="relative">
//         <label className="text-sm font-medium">Choose City:</label>
//         <input
//           type="text"
//           value={cityInput}
//           onChange={handleCityChange}
//           onFocus={() => setShowSuggestions(true)}
//           onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
//           className="w-full border p-2 rounded-md"
//           placeholder="Search city..."
//         />
//         {showSuggestions && filteredCities.length > 0 && (
//           <ul className="absolute bg-white border rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow z-10">
//             {filteredCities.map((city) => (
//               <li
//                 key={city.id}
//                 className="px-3 py-2 cursor-pointer hover:bg-gray200"
//                 onClick={() => {
//                   formik.setFieldValue("upazila_id", city.id);
//                   setCityInput(city.name);
//                   setShowSuggestions(false);
//                 }}
//               >
//                 {city.name}
//               </li>
//             ))}
//           </ul>
//         )}
//         {formik.touched.upazila_id && formik.errors.upazila_id && (
//           <span className="text-sm text-primary">
//             {formik.errors.upazila_id}
//           </span>
//         )}
//       </div>

//       {/* Address */}
//       <div>
//         <label className="text-sm font-medium">Address:</label>
//         <input
//           type="text"
//           name="address"
//           onChange={formik.handleChange}
//           value={formik.values.address}
//           onBlur={formik.handleBlur}
//           className="w-full border p-2 rounded-md"
//         />
//         {formik.touched.address && formik.errors.address && (
//           <span className="text-sm text-primary">{formik.errors.address}</span>
//         )}
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         className="flex items-center justify-center gap-2 bg-primary w-full rounded-md text-white p-2 hover:bg-primarySlate mt-4"
//         disabled={loading}
//       >
//         {loading && <FaSpinner className="animate-spin" />}
//         Update Profile
//       </button>
//     </form>
//   );
// };

// export default UserProfileEdit;
