import { format } from "date-fns";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt, FaSpinner } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../../api/API";
import { API_ENDPOINS } from "../../../api/ApiEndpoints";

const AnnouncementCreationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    announcement_name: "",
    announcement_details: "",
    class_department_id: "",
    department_name: false,
    subject: "",
    question_type: "",
    address: "",
    exam_type: "",
    organizer_name: "",
    round_number: "",
    total_days: "",
    terms_condition: "",
    price_money: "",
    is_pricemoney: false,
    is_certificate: false,
    is_exciting_price: false,
    tutor_share_qes_number: "",
    is_event: true,
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [eventImage, setEventImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [eventImageName, setEventImageName] = useState("No file chosen");
  const [bannerImageName, setBannerImageName] = useState("No file chosen");
  const [eventImagePreview, setEventImagePreview] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [eventImageAttempted, setEventImageAttempted] = useState(false);
  const [bannerImageAttempted, setBannerImageAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [excitingPrices, setExcitingPrices] = useState([
    { item_name: "", quantity: "" },
  ]);

  // Class/Department Autocomplete
  const [classDepartments, setClassDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [showDeptSuggestions, setShowDeptSuggestions] = useState(false);
  const [deptInput, setDeptInput] = useState("");
  const [deptLoading, setDeptLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle date formatting for API
  const formatDateForAPI = (date) => {
    return date ? format(date, "yyyy-MM-dd") : "";
  };

  // Handle exciting price checkbox
  const handleExcitingPrice = (e) => {
    setFormData((prev) => ({ ...prev, is_exciting_price: e.target.checked }));
    if (e.target.checked && excitingPrices.length === 0) {
      setExcitingPrices([{ item_name: "", quantity: "" }]);
    }
  };

  // Handle adding exciting price
  const handleAddExcitingPrice = () => {
    setExcitingPrices([...excitingPrices, { item_name: "", quantity: "" }]);
  };

  // Handle exciting price input changes
  const handleExcitingPriceChange = (index, field, value) => {
    const updated = [...excitingPrices];
    if (field === "quantity") {
      updated[index][field] = value === "" ? "" : Number(value);
    } else {
      updated[index][field] = value;
    }
    setExcitingPrices(updated);
  };

  // Handle file input changes with preview
  const handleEventImageChange = (e) => {
    const file = e.target.files[0];
    setEventImageAttempted(true);
    if (file && file.type.startsWith("image/")) {
      setEventImage(file);
      setEventImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setEventImage(null);
      setEventImageName("No file chosen");
      setEventImagePreview(null);
      toast.error("Please upload a valid image file for event image.");
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    setBannerImageAttempted(true);
    if (file && file.type.startsWith("image/")) {
      setBannerImage(file);
      setBannerImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBannerImage(null);
      setBannerImageName("No file chosen");
      setBannerImagePreview(null);
      toast.error("Please upload a valid image file for banner image.");
    }
  };

  // Validate exciting prices
  const validateExcitingPrices = () => {
    if (formData.is_exciting_price) {
      return excitingPrices.every(
        (price) =>
          price.item_name?.toString().trim() !== "" &&
          price.quantity !== null &&
          price.quantity.toString().trim() !== ""
      );
    }
    return true;
  };

  // Fetch Class/Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDeptLoading(true);
        const res = await API.get(API_ENDPOINS.CLASS_DEPARTMENT);
        if (res.data && Array.isArray(res.data)) {
          setClassDepartments(res.data);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
        toast.error("Failed to load class/departments.");
      } finally {
        setDeptLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch announcement data with image preview validation
  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) return;

      try {
        const response = await API.get(`${API_ENDPOINS.OWN_DATA}${id}/`);
        const announcement = response.data.data;

        if (announcement) {
          // set form fields
          setFormData({
            announcement_name: announcement.announcement_name || "",
            announcement_details: announcement.announcement_details || "",
            class_department_id:
              announcement.class_department?.id?.toString() || "",
            subject: announcement.subject || "",
            question_type: announcement.question_type || "",
            address: announcement.address || "",
            exam_type: announcement.exam_type || "",
            organizer_name: announcement.organizer_name || "",
            round_number: announcement.round_number || "",
            total_days: announcement.total_days || "",
            terms_condition: announcement.terms_condition || "",
            price_money: announcement.price_money || "",
            is_pricemoney: announcement.is_pricemoney || false,
            is_certificate: announcement.is_certificate || false,
            is_exciting_price: announcement.is_exciting_price || false,
            tutor_share_qes_number: announcement.tutor_share_qes_number || "",
          });

          setStartDate(
            announcement.registration_start_date
              ? new Date(announcement.registration_start_date)
              : null
          );
          setEndDate(
            announcement.registration_end_date
              ? new Date(announcement.registration_end_date)
              : null
          );

          // peview banner image and event image
          if (announcement.announcement_event_image) {
            const imageUrl = announcement.announcement_event_image.startsWith(
              "http"
            )
              ? announcement.announcement_event_image
              : `http://192.168.0.240:8001${announcement.announcement_event_image}`;

            setEventImagePreview(imageUrl);
            // setEventImageName(imageUrl);
          }

          if (announcement.announcement_event_banner) {
            const bannerUrl = announcement.announcement_event_banner.startsWith(
              "http"
            )
              ? announcement.announcement_event_banner
              : `http://192.168.0.240:8001${announcement.announcement_event_banner}`;

            setBannerImagePreview(bannerUrl);
            // setBannerImageName(bannerUrl);
          }
          // Exciting prices
          if (
            announcement.is_exciting_price &&
            announcement.exciting_prizes?.length > 0
          ) {
            setExcitingPrices(announcement.exciting_prizes);
          } else {
            setExcitingPrices([{ item_name: "", quantity: "" }]);
          }
        }
      } catch (err) {
        console.error("Error fetching announcement:", err);
        toast.error("Failed to fetch announcement data. Please try again.");
      }
    };

    fetchAnnouncement();
  }, [id]);

  // Submit form data to API
  const postData = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Enhanced validation with toast notifications
    if (!formData.announcement_name) {
      toast.error("Please enter an announcement name.");
      setLoading(false);
      return;
    }
    if (!formData.class_department_id)
      return toast.error("Please select Class/Department.");
    if (!eventImage && !id) {
      toast.error("Please upload an event image.");
      setLoading(false);
      return;
    }
    if (!bannerImage && !id) {
      toast.error("Please upload a banner image.");
      setLoading(false);
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      setLoading(false);
      return;
    }
    if (formData.is_pricemoney && !formData.price_money) {
      toast.error("Please enter the price money amount.");
      setLoading(false);
      return;
    }
    if (!validateExcitingPrices()) {
      toast.error("Please fill in all exciting price details.");
      setLoading(false);
      return;
    }

    const data = new FormData();

    // Append text fields
    Object.keys(formData).forEach((key) => {
      if (
        key === "is_pricemoney" ||
        key === "is_certificate" ||
        key === "is_exciting_price"
      ) {
        data.append(key, formData[key].toString());
      } else {
        data.append(key, formData[key]);
      }
    });

    // Append dates
    data.append("registration_start_date", formatDateForAPI(startDate));
    data.append("registration_end_date", formatDateForAPI(endDate));

    // Append files (only if new files are uploaded)
    if (eventImage) {
      data.append("announcement_event_image", eventImage);
    }
    if (bannerImage) {
      data.append("announcement_event_banner", bannerImage);
    }

    // Append exciting prices
    if (formData.is_exciting_price) {
      data.append("exciting_prizes", JSON.stringify(excitingPrices));
    }

    try {
      let response;
      if (id) {
        response = await API.put(
          `${API_ENDPOINS.UPDATE_QUIZCARD}${id}/`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Announcement updated successfully!");
      } else {
        response = await API.post(API_ENDPOINS.CREATE_ANNOUNCEMENT, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Announcement created successfully!");
      }

      navigate("/president/events");
    } catch (err) {
      // console.error("API Error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message ||
          "Failed to submit form. Please check your inputs and try again."
      );
    } finally {
      // Always stop loading (success or error both case)
      setLoading(false);
    }
  };

  // const postData = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   // Enhanced validation with toast notifications
  //   if (!formData.announcement_name) {
  //     toast.error("Please enter an announcement name.");
  //     return;
  //   }
  //   if (!eventImage && !id) {
  //     toast.error("Please upload an event image.");
  //     return;
  //   }
  //   if (!bannerImage && !id) {
  //     toast.error("Please upload a banner image.");
  //     return;
  //   }
  //   if (!startDate || !endDate) {
  //     toast.error("Please select both start and end dates.");
  //     return;
  //   }
  //   if (formData.is_pricemoney && !formData.price_money) {
  //     toast.error("Please enter the price money amount.");
  //     return;
  //   }
  //   if (!validateExcitingPrices()) {
  //     toast.error("Please fill in all exciting price details.");
  //     return;
  //   }

  //   const data = new FormData();

  //   // Append text fields
  //   Object.keys(formData).forEach((key) => {
  //     if (
  //       key === "is_pricemoney" ||
  //       key === "is_certificate" ||
  //       key === "is_exciting_price"
  //     ) {
  //       data.append(key, formData[key].toString());
  //     } else {
  //       data.append(key, formData[key]);
  //     }
  //   });

  //   // Append dates
  //   data.append("registration_start_date", formatDateForAPI(startDate));
  //   data.append("registration_end_date", formatDateForAPI(endDate));

  //   // Append files (only if new files are uploaded)
  //   if (eventImage) {
  //     data.append("announcement_event_image", eventImage);
  //   }
  //   if (bannerImage) {
  //     data.append("announcement_event_banner", bannerImage);
  //   }

  //   // Append exciting prices
  //   if (formData.is_exciting_price) {
  //     data.append("exciting_prizes", JSON.stringify(excitingPrices));
  //   }

  //   try {
  //     let response;
  //     if (id) {
  //       response = await API.put(
  //         `${API_ENDPOINS.UPDATE_QUIZCARD}${id}/`,
  //         data,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //       toast.success("Announcement updated successfully!");
  //     } else {
  //       response = await API.post(API_ENDPOINS.CREATE_ANNOUNCEMENT, data, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       toast.success("Announcement created successfully!");
  //     }

  //     navigate("/president/announcement-list");
  //   } catch (err) {
  //     console.error("API Error:", err.response?.data || err.message);
  //     toast.error(
  //       err.response?.data?.message ||
  //         "Failed to submit form. Please check your inputs and try again."
  //     );
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl mx-auto rounded-xl shadow-md p-8 md:p-10 lg:p-12">
        <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          {id ? "Edit Announcement" : "Announcement Creation Form"}
        </h3>
        <form
          onSubmit={postData}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* announcement name */}
            <div className="input-wrapper">
              <label
                htmlFor="announcement_name"
                className="text-sm font-medium text-gray700 mb-1 block"
              >
                Announcement Name
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="announcement_name"
                placeholder="Enter Announcement Name"
                value={formData.announcement_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
              />
            </div>

            {/* organization Name */}
            <div className="input-wrapper">
              <label
                htmlFor="organizer_name"
                className="text-sm font-medium text-gray700 mb-1 block"
              >
                Organization Name
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="organizer_name"
                placeholder="Enter Organization Name"
                value={formData.organizer_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
              />
            </div>
            {/* rounder number */}
            <div className="input-wrapper">
              <label
                htmlFor="round_number"
                className="text-sm font-medium text-gray700 mb-1 block"
              >
                Round Number
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                id="round_number"
                placeholder="Enter Round Number"
                value={formData.round_number}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* registration start date */}
            <div className="input-wrapper w-full datepicker relative">
              <label
                htmlFor="startDate"
                className="text-sm font-medium text-gray700 mb-1 block"
              >
                Registration Start Date
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Registration Start Date"
                  dateFormat="EEEE, dd MMMM yyyy"
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
                  calendarClassName="custom-calendar"
                  popperPlacement="bottom"
                />
                <FaRegCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray500 pointer-events-none" />
              </div>
            </div>
            {/* registration end date */}
            <div className="input-wrapper w-full datepicker relative">
              <label
                htmlFor="endDate"
                className="text-sm font-medium text-gray700 mb-1 block"
              >
                Registration End Date
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="Registration End Date"
                  dateFormat="EEEE, dd MMMM yyyy"
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
                  calendarClassName="custom-calendar"
                  popperPlacement="bottom"
                />
                <FaRegCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray500 pointer-events-none" />
              </div>
            </div>
            {/* total days */}
            <div className="input-wrapper">
              <label
                htmlFor="total_days"
                className="text-sm font-medium text-gray700 mb-1 block"
              >
                Total Days
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                id="total_days"
                placeholder="Enter Total Days"
                value={formData.total_days}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="input-wrapper relative">
              <label className="text-sm font-medium text-gray700 mb-1 block">
                Class/Department <span className="text-red500">*</span>
              </label>

              {deptLoading ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={deptInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDeptInput(val);
                      const filtered = classDepartments.filter((d) =>
                        d.class_department
                          .toLowerCase()
                          .includes(val.toLowerCase())
                      );
                      setFilteredDepartments(filtered);
                      setShowDeptSuggestions(true);
                    }}
                    onFocus={() => setShowDeptSuggestions(true)}
                    placeholder="Search Class/Department"
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary outline-none bg-gray-50"
                  />

                  {showDeptSuggestions && filteredDepartments.length > 0 && (
                    <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow z-20">
                      {filteredDepartments.map((dept) => (
                        <li
                          key={dept.id}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              class_department_id: dept.id.toString(),
                            }));
                            setDeptInput(dept.class_department);
                            setShowDeptSuggestions(false);
                          }}
                        >
                          {dept.class_department}
                        </li>
                      ))}
                    </ul>
                  )}

                  {showDeptSuggestions &&
                    filteredDepartments.length === 0 &&
                    deptInput && (
                      <div className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full p-2 text-sm text-gray-500">
                        No department found
                      </div>
                    )}
                </>
              )}
            </div>
            {/* tutor share questions */}
            <div className="input-wrapper">
              <label
                htmlFor="tutor_share_qes_number"
                className="text-sm font-medium text-gray700 mb-1 block"
              >
                Tutor Share Question
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                id="tutor_share_qes_number"
                placeholder="Share question"
                value={formData.tutor_share_qes_number}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
              />
            </div>
            {/* question types */}
            <div className="input-wrapper">
              <label
                htmlFor="question_type"
                className="text-sm font-medium text-gray700 mb-1 block"
              >
                Question Type
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
              <select
                id="question_type"
                value={formData.question_type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
              >
                <option value="">Select Question Type</option>
                {/* <option value="multiple">Multiple</option> */}
                <option value="mcq">MCQ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* exam types */}
            <div className="input-wrapper">
              <label
                htmlFor="exam_type"
                className="text-sm font-medium text-gray700 mb-1 block"
              >
                Exam Type
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
              <select
                id="exam_type"
                value={formData.exam_type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
              >
                <option value="">Select Exam Type</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="mix">Mix</option>
              </select>
            </div>
          </div>

          <div className="input-group grid grid-cols-2 sm:grid-cols-3 items-center py-5 gap-4">
            {/* price money */}
            <div className="input-wrapper flex items-center gap-1">
              <input
                type="checkbox"
                id="is_pricemoney"
                checked={formData.is_pricemoney}
                onChange={handleInputChange}
                className="appearance-none w-4 h-4 border border-gray400 rounded-sm checked:bg-blue-500 checked:border-transparent flex items-center justify-center"
              />
              <label
                htmlFor="is_pricemoney"
                className="text-sm cursor-pointer font-medium text-gray700"
              >
                Is Price Money?
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
            </div>
            {/* certificate */}
            <div className="input-wrapper flex items-center gap-1">
              <input
                type="checkbox"
                id="is_certificate"
                checked={formData.is_certificate}
                onChange={handleInputChange}
                className="appearance-none w-4 h-4 border border-gray400 rounded-sm checked:bg-blue-500 checked:border-transparent flex items-center justify-center"
              />
              <label
                htmlFor="is_certificate"
                className="text-sm font-medium text-gray700 cursor-pointer"
              >
                Is Certificate?
              </label>
            </div>
            {/* exciting price */}
            <div className="input-wrapper flex items-center gap-1">
              <input
                type="checkbox"
                id="is_exciting_price"
                checked={formData.is_exciting_price}
                onChange={handleExcitingPrice}
                className="appearance-none w-4 h-4 border border-gray400 rounded-sm checked:bg-blue-500 checked:border-transparent flex items-center justify-center"
              />
              <label
                htmlFor="is_exciting_price"
                className="text-sm font-medium text-gray700 cursor-pointer"
              >
                Is Exciting Price?
              </label>
            </div>
          </div>

          {formData.is_pricemoney && (
            <div className="input-wrapper mt-2">
              <label
                htmlFor="price_money"
                className="text-sm font-medium text-gray700 mb-1 block"
              >
                Price Money
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                id="price_money"
                placeholder="Enter Price Money"
                value={formData.price_money}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
              />
            </div>
          )}

          {formData.is_exciting_price &&
            excitingPrices.map((entry, index) => (
              <div key={index} className="input-group mt-2 relative">
                <div className="grid grid-cols-[87%_13%]">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="input-wrapper">
                      <label
                        htmlFor={`item_name-${index}`}
                        className="text-sm font-medium text-gray700 mb-1 block"
                      >
                        Item Name
                      </label>
                      <input
                        type="text"
                        id={`item_name-${index}`}
                        placeholder="Enter Item Name"
                        value={entry.item_name}
                        onChange={(e) =>
                          handleExcitingPriceChange(
                            index,
                            "item_name",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
                      />
                    </div>
                    <div className="input-wrapper relative">
                      <label
                        htmlFor={`quantity-${index}`}
                        className="text-sm font-medium text-gray700 mb-1 block"
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        id={`quantity-${index}`}
                        placeholder="Enter Quantity"
                        value={entry.quantity}
                        onChange={(e) =>
                          handleExcitingPriceChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    {index === excitingPrices.length - 1 && (
                      <button
                        type="button"
                        onClick={handleAddExcitingPrice}
                        className="absolute right-2 bottom-2 text-lg bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-blue-600"
                        title="Add More"
                      >
                        <FiPlus size={18} />
                      </button>
                    )}
                    {excitingPrices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...excitingPrices];
                          updated.splice(index, 1);
                          setExcitingPrices(updated);
                        }}
                        className="absolute right-10 bottom-2 text-lg bg-red-text-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600"
                        title="Remove"
                      >
                        <FiMinus size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {/* address */}
          <div className="input-wrapper">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray700 mb-1 block"
            >
              Address
              <span className="text-sm text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-2.5 py-5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
            />
          </div>

          {/* upload event image */}
          <div className="input-group grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-wrapper">
              <label
                htmlFor="eventImage"
                className="text-sm font-medium text-gray700 mb-1 block"
              >
                Upload Event Image
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
              <label
                htmlFor="eventImage"
                className={`border bg-white border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition 
                ${
                  eventImageAttempted
                    ? eventImage
                      ? "bg-green100"
                      : "bg-red100"
                    : ""
                }`}
              >
                <span className="w-full flex flex-col items-center justify-center gap-2 px-3 py-1 rounded-md text-sm font-medium text-gray500">
                  <LuUpload className="text-2xl text-indigo-500" />
                  <span className="text-indigo-500">Upload a file</span>
                  or drag and drop PNG, JPG, GIF up to 10MB
                </span>
              </label>
              <input
                type="file"
                id="eventImage"
                name="announcement_event_image"
                className="hidden"
                accept="image/*"
                onChange={handleEventImageChange}
              />
              <span className="text-sm text-gray700">{eventImageName}</span>
              {eventImagePreview && (
                <div className="mt-2">
                  <img
                    src={eventImagePreview}
                    alt="Event Preview"
                    className="h-32 w-full rounded border bg-cover bg-no-repeat object-cover"
                  />
                </div>
              )}
            </div>

            <div className="input-wrapper">
              <label
                htmlFor="bannerImage"
                className="text-sm font-medium text-gray700 mb-1 block"
              >
                Upload Banner Image
                <span className="text-sm text-red-500 ml-1">*</span>
              </label>
              <label
                htmlFor="bannerImage"
                className={`border bg-white border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition 
                ${
                  bannerImageAttempted
                    ? bannerImage
                      ? "bg-green100"
                      : "bg-red100"
                    : ""
                }`}
              >
                <span className="w-full flex flex-col items-center justify-center gap-2 px-3 py-1 rounded-md text-sm font-medium text-gray500">
                  <LuUpload className="text-2xl text-indigo-500" />
                  <span className="text-indigo-500">Upload a file</span>
                  or drag and drop PNG, JPG up to 5MB
                </span>
              </label>
              <input
                type="file"
                id="bannerImage"
                name="announcement_event_banner"
                className="hidden"
                accept="image/*"
                onChange={handleBannerImageChange}
              />
              <span className="text-sm text-gray700">{bannerImageName}</span>
              {bannerImagePreview && (
                <div className="mt-2">
                  <img
                    src={bannerImagePreview}
                    alt="Banner Preview"
                    className="h-32 w-full rounded border bg-cover bg-no-repeat object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* terms and conditons */}
          <div className="input-wrapper">
            <label
              htmlFor="terms_condition"
              className="text-sm font-medium text-gray700 mb-1 block"
            >
              Terms & Condition
              <span className="text-sm text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="terms_condition"
              placeholder="Enter Terms & Condition"
              value={formData.terms_condition}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50 h-32"
            ></textarea>
          </div>

          {/* announcement details */}
          <div className="input-wrapper">
            <label
              htmlFor="announcement_details"
              className="text-sm font-medium text-gray700 mb-1 block"
            >
              Announcement Details
              <span className="text-sm text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="announcement_details"
              placeholder="Enter Announcement Details"
              value={formData.announcement_details}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50 h-32"
            ></textarea>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`rounded-md text-white py-2 px-8 transition mt-6 flex items-center justify-center gap-2
      ${
        loading
          ? "bg-secondary/60 cursor-not-allowed"
          : "bg-secondary hover:bg-primary"
      }`}
            >
              {loading && <FaSpinner className="animate-spin" />}
              {id
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                ? "Saving..."
                : "Save"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default AnnouncementCreationForm;

// import { format } from "date-fns";
// import { useEffect, useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { FiMinus, FiPlus } from "react-icons/fi";
// import { useNavigate, useParams } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import UploadIcon from "../../assets/icons/upload.svg";

// const AnnouncementCreationForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // State for form fields
//   const [formData, setFormData] = useState({
//     announcement_name: "",
//     announcement_details: "",
//     department_name: "",
//     subject: "",
//     question_type: "",
//     address: "",
//     exam_type: "",
//     organizer_name: "",
//     round_number: "",
//     total_days: "",
//     terms_condition: "",
//     price_money: "",
//     is_pricemoney: false,
//     is_certificate: false,
//     is_exciting_price: false,
//     tutor_share_qes_number: "",
//   });

//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [eventImage, setEventImage] = useState(null);
//   const [bannerImage, setBannerImage] = useState(null);
//   const [eventImageName, setEventImageName] = useState("No file chosen");
//   const [bannerImageName, setBannerImageName] = useState("No file chosen");
//   const [eventImagePreview, setEventImagePreview] = useState(null);
//   const [bannerImagePreview, setBannerImagePreview] = useState(null);
//   const [eventImageAttempted, setEventImageAttempted] = useState(false);
//   const [bannerImageAttempted, setBannerImageAttempted] = useState(false);
//   const [excitingPrices, setExcitingPrices] = useState([
//     { item_name: "", quantity: "" },
//   ]);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { id, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [id]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Handle date formatting for API
//   const formatDateForAPI = (date) => {
//     return date ? format(date, "yyyy-MM-dd") : "";
//   };

//   // Handle exciting price checkbox
//   const handleExcitingPrice = (e) => {
//     setFormData((prev) => ({ ...prev, is_exciting_price: e.target.checked }));
//     if (e.target.checked && excitingPrices.length === 0) {
//       setExcitingPrices([{ item_name: "", quantity: "" }]);
//     }
//   };

//   // Handle adding exciting price
//   const handleAddExcitingPrice = () => {
//     setExcitingPrices([...excitingPrices, { item_name: "", quantity: "" }]);
//   };

//   // Handle exciting price input changes
//   const handleExcitingPriceChange = (index, field, value) => {
//     const updated = [...excitingPrices];
//     updated[index][field] = value;
//     setExcitingPrices(updated);
//   };

//   // Handle file input changes with preview
//   const handleEventImageChange = (e) => {
//     const file = e.target.files[0];
//     setEventImageAttempted(true);
//     if (file && file.type.startsWith("image/")) {
//       setEventImage(file);
//       setEventImageName(file.name);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setEventImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setEventImage(null);
//       setEventImageName("No file chosen");
//       setEventImagePreview(null);
//       toast.error("Please upload a valid image file for event image.");
//     }
//   };

//   const handleBannerImageChange = (e) => {
//     const file = e.target.files[0];
//     setBannerImageAttempted(true);
//     if (file && file.type.startsWith("image/")) {
//       setBannerImage(file);
//       setBannerImageName(file.name);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setBannerImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setBannerImage(null);
//       setBannerImageName("No file chosen");
//       setBannerImagePreview(null);
//       toast.error("Please upload a valid image file for banner image.");
//     }
//   };

//   // Validate exciting prices
//   const validateExcitingPrices = () => {
//     if (formData.is_exciting_price) {
//       return excitingPrices.every(
//         (price) => price.item_name.trim() && String(price.quantity).trim()
//       );
//     }
//     return true;
//   };

//   // Fetch announcement data with image preview validation
//   useEffect(() => {
//     const fetchAnnouncement = async () => {
//       if (!id) return;

//       try {
//         const response = await API.get(`${API_ENDPOINS.OWN_DATA}${id}/`);
//         const announcement = response.data.data;

//         if (announcement) {
//           // set form fields
//           setFormData({
//             announcement_name: announcement.announcement_name || "",
//             announcement_details: announcement.announcement_details || "",
//             department_name: announcement.department_name || "",
//             subject: announcement.subject || "",
//             question_type: announcement.question_type || "",
//             address: announcement.address || "",
//             exam_type: announcement.exam_type || "",
//             organizer_name: announcement.organizer_name || "",
//             round_number: announcement.round_number || "",
//             total_days: announcement.total_days || "",
//             terms_condition: announcement.terms_condition || "",
//             price_money: announcement.price_money || "",
//             is_pricemoney: announcement.is_pricemoney || false,
//             is_certificate: announcement.is_certificate || false,
//             is_exciting_price: announcement.is_exciting_price || false,
//             tutor_share_qes_number: announcement.tutor_share_qes_number || "",
//           });

//           setStartDate(
//             announcement.registration_start_date
//               ? new Date(announcement.registration_start_date)
//               : null
//           );
//           setEndDate(
//             announcement.registration_end_date
//               ? new Date(announcement.registration_end_date)
//               : null
//           );

//           // peview banner image and event image
//           if (announcement.announcement_event_image) {
//             const imageUrl = announcement.announcement_event_image.startsWith(
//               "http"
//             )
//               ? announcement.announcement_event_image
//               : `http://192.168.0.240:8001${announcement.announcement_event_image}`;

//             setEventImagePreview(imageUrl);
//             // setEventImageName(imageUrl);
//           }

//           if (announcement.announcement_event_banner) {
//             const bannerUrl = announcement.announcement_event_banner.startsWith(
//               "http"
//             )
//               ? announcement.announcement_event_banner
//               : `http://192.168.0.240:8001${announcement.announcement_event_banner}`;

//             setBannerImagePreview(bannerUrl);
//             // setBannerImageName(bannerUrl);
//           }
//           // Exciting prices
//           if (
//             announcement.is_exciting_price &&
//             announcement.exciting_prizes?.length > 0
//           ) {
//             setExcitingPrices(announcement.exciting_prizes);
//           } else {
//             setExcitingPrices([{ item_name: "", quantity: "" }]);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching announcement:", err);
//         toast.error("Failed to fetch announcement data. Please try again.");
//       }
//     };

//     fetchAnnouncement();
//   }, [id]);

//   // Submit form data to API
//   const postData = async (e) => {
//     e.preventDefault();

//     // Enhanced validation with toast notifications
//     if (!formData.announcement_name) {
//       toast.error("Please enter an announcement name.");
//       return;
//     }
//     if (!eventImage && !id) {
//       toast.error("Please upload an event image.");
//       return;
//     }
//     if (!bannerImage && !id) {
//       toast.error("Please upload a banner image.");
//       return;
//     }
//     if (!startDate || !endDate) {
//       toast.error("Please select both start and end dates.");
//       return;
//     }
//     if (formData.is_pricemoney && !formData.price_money) {
//       toast.error("Please enter the price money amount.");
//       return;
//     }
//     if (!validateExcitingPrices()) {
//       toast.error("Please fill in all exciting price details.");
//       return;
//     }

//     const data = new FormData();

//     // Append text fields
//     Object.keys(formData).forEach((key) => {
//       if (
//         key === "is_pricemoney" ||
//         key === "is_certificate" ||
//         key === "is_exciting_price"
//       ) {
//         data.append(key, formData[key].toString());
//       } else {
//         data.append(key, formData[key]);
//       }
//     });

//     // Append dates
//     data.append("registration_start_date", formatDateForAPI(startDate));
//     data.append("registration_end_date", formatDateForAPI(endDate));

//     // Append files (only if new files are uploaded)
//     if (eventImage) {
//       data.append("announcement_event_image", eventImage);
//     }
//     if (bannerImage) {
//       data.append("announcement_event_banner", bannerImage);
//     }

//     // Append exciting prices
//     if (formData.is_exciting_price) {
//       data.append("exciting_prizes", JSON.stringify(excitingPrices));
//     }

//     try {
//       let response;
//       if (id) {
//         response = await API.put(
//           `${API_ENDPOINS.UPDATE_QUIZCARD}${id}/`,
//           data,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//         toast.success("Announcement updated successfully!");
//       } else {
//         response = await API.post(API_ENDPOINS.CREATE_ANNOUNCEMENT, data, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         toast.success("Announcement created successfully!");
//       }

//       navigate("/president/announcement-list");
//     } catch (err) {
//       console.error("API Error:", err.response?.data || err.message);
//       toast.error(
//         err.response?.data?.message ||
//           "Failed to submit form. Please check your inputs and try again."
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="bg-white p-12 shadow mx-auto max-w-2xl rounded-lg">
//         <h3 className="text-center text-2xl font-semibold mb-4">
//           {id ? "Edit Announcement" : "Announcement Creation Form"}
//         </h3>
//         <form
//           onSubmit={postData}
//           encType="multipart/form-data"
//           className="space-y-4"
//         >
//           <div className="input-wrapper">
//             <label
//               htmlFor="announcement_name"
//               className="text-sm font-medium text-gray700 mb-1 block"
//             >
//               Announcement Name
//               <span className="text-sm text-red-500 ml-1">*</span>
//             </label>
//             <input
//               type="text"
//               id="announcement_name"
//               placeholder="Enter Announcement Name"
//               value={formData.announcement_name}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
//             />
//           </div>

//           <div className="input-group grid grid-cols-2 gap-4">
//             <div className="input-wrapper">
//               <label
//                 htmlFor="eventImage"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Upload Event Image
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <label
//                 htmlFor="eventImage"
//                 className={`w-full cursor-pointer border border-gray300 p-2 rounded-md flex items-center justify-center gap-2
//                 ${
//                   eventImageAttempted
//                     ? eventImage
//                       ? "bg-green100"
//                       : "bg-red100"
//                     : ""
//                 }`}
//               >
//                 <span className="w-full flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium text-gray500">
//                   <img src={UploadIcon} alt="upload icon" className="max-w-4" />{" "}
//                   Choose File
//                 </span>
//               </label>
//               <input
//                 type="file"
//                 id="eventImage"
//                 name="announcement_event_image"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleEventImageChange}
//               />
//               <span className="text-sm text-gray700">{eventImageName}</span>
//               {eventImagePreview && (
//                 <div className="mt-2">
//                   <img
//                     src={eventImagePreview}
//                     alt="Event Preview"
//                     className="h-32 w-full rounded border bg-cover bg-no-repeat object-cover"
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="input-wrapper">
//               <label
//                 htmlFor="bannerImage"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Upload Banner Image
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <label
//                 htmlFor="bannerImage"
//                 className={`w-full cursor-pointer border border-gray300 p-2 rounded-md flex items-center justify-center gap-2
//                 ${
//                   bannerImageAttempted
//                     ? bannerImage
//                       ? "bg-green100"
//                       : "bg-red100"
//                     : ""
//                 }`}
//               >
//                 <span className="w-full flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium text-gray500">
//                   <img src={UploadIcon} alt="upload icon" className="max-w-4" />{" "}
//                   Choose File
//                 </span>
//               </label>
//               <input
//                 type="file"
//                 id="bannerImage"
//                 name="announcement_event_banner"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleBannerImageChange}
//               />
//               <span className="text-sm text-gray700">{bannerImageName}</span>
//               {bannerImagePreview && (
//                 <div className="mt-2">
//                   <img
//                     src={bannerImagePreview}
//                     alt="Banner Preview"
//                     className="h-32 w-full rounded border bg-cover bg-no-repeat object-cover"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="input-group grid grid-cols-2 gap-4">
//             <div className="input-wrapper w-full datepicker relative">
//               <label
//                 htmlFor="startDate"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Registration Start Date
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <div className="relative">
//                 <DatePicker
//                   selected={startDate}
//                   onChange={(date) => setStartDate(date)}
//                   placeholderText="Registration Start Date"
//                   dateFormat="EEEE, dd MMMM yyyy"
//                   className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
//                   calendarClassName="custom-calendar"
//                   popperPlacement="bottom"
//                 />
//                 <FaRegCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray500 pointer-events-none" />
//               </div>
//             </div>

//             <div className="input-wrapper w-full datepicker relative">
//               <label
//                 htmlFor="endDate"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Registration End Date
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <div className="relative">
//                 <DatePicker
//                   selected={endDate}
//                   onChange={(date) => setEndDate(date)}
//                   placeholderText="Registration End Date"
//                   dateFormat="EEEE, dd MMMM yyyy"
//                   className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
//                   calendarClassName="custom-calendar"
//                   popperPlacement="bottom"
//                 />
//                 <FaRegCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray500 pointer-events-none" />
//               </div>
//             </div>
//           </div>

//           <div className="input-group grid grid-cols-2 gap-4">
//             <div className="input-wrapper">
//               <label
//                 htmlFor="subject"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Subject
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="subject"
//                 placeholder="Enter Subject Name"
//                 value={formData.subject}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500"
//               />
//             </div>
//             <div className="input-wrapper">
//               <label
//                 htmlFor="department_name"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Department
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="department_name"
//                 placeholder="Enter Department Name"
//                 value={formData.department_name}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500"
//               />
//             </div>
//           </div>
//           <div className="input-group grid grid-cols-2 gap-4">
//             <div className="input-wrapper">
//               <label
//                 htmlFor="address"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Address
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="address"
//                 placeholder="Enter Address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500"
//               />
//             </div>
//             <div className="input-wrapper">
//               <label
//                 htmlFor="tutor_share_qes_number"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Tutor Share Question
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <input
//                 type="number"
//                 id="tutor_share_qes_number"
//                 placeholder="Share question"
//                 value={formData.tutor_share_qes_number}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500"
//               />
//             </div>
//           </div>
//           <div className="input-group grid grid-cols-2 gap-4">
//             <div className="input-wrapper">
//               <label
//                 htmlFor="question_type"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Question Type
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <select
//                 id="question_type"
//                 value={formData.question_type}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500"
//               >
//                 <option value="">Select Question Type</option>
//                 <option value="multiple">Multiple</option>
//                 <option value="mcq">MCQ</option>
//               </select>
//             </div>

//             <div className="input-wrapper">
//               <label
//                 htmlFor="exam_type"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Exam Type
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <select
//                 id="exam_type"
//                 value={formData.exam_type}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500"
//               >
//                 <option value="">Select Exam Type</option>
//                 <option value="online">Online</option>
//                 <option value="offline">Offline</option>
//                 <option value="mix">Mix</option>
//               </select>
//             </div>
//           </div>
//           <div className="input-wrapper">
//             <label
//               htmlFor="organizer_name"
//               className="text-sm font-medium text-gray700 mb-1 block"
//             >
//               Organization Name
//               <span className="text-sm text-red-500 ml-1">*</span>
//             </label>
//             <input
//               type="text"
//               id="organizer_name"
//               placeholder="Enter Organization Name"
//               value={formData.organizer_name}
//               onChange={handleInputChange}
//               className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500"
//             />
//           </div>
//           <div className="input-group grid grid-cols-2 gap-4">
//             <div className="input-wrapper">
//               <label
//                 htmlFor="total_days"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Total Days
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <input
//                 type="number"
//                 id="total_days"
//                 placeholder="Enter Total Days"
//                 value={formData.total_days}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500"
//               />
//             </div>
//             <div className="input-wrapper">
//               <label
//                 htmlFor="round_number"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Round Number
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <input
//                 type="number"
//                 id="round_number"
//                 placeholder="Enter Round Number"
//                 value={formData.round_number}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500"
//               />
//             </div>
//           </div>

//           <div className="input-group flex items-center gap-5">
//             <div className="input-wrapper flex items-center gap-1">
//               <input
//                 type="checkbox"
//                 id="is_pricemoney"
//                 checked={formData.is_pricemoney}
//                 onChange={handleInputChange}
//                 className="appearance-none w-4 h-4 border border-gray400 rounded-sm checked:bg-blue-500 checked:border-transparent flex items-center justify-center"
//               />
//               <label
//                 htmlFor="is_pricemoney"
//                 className="text-sm cursor-pointer font-medium text-gray700"
//               >
//                 Is Price Money?
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//             </div>

//             <div className="input-wrapper flex items-center gap-1">
//               <input
//                 type="checkbox"
//                 id="is_certificate"
//                 checked={formData.is_certificate}
//                 onChange={handleInputChange}
//                 className="appearance-none w-4 h-4 border border-gray400 rounded-sm checked:bg-blue-500 checked:border-transparent flex items-center justify-center"
//               />
//               <label
//                 htmlFor="is_certificate"
//                 className="text-sm font-medium text-gray700 cursor-pointer"
//               >
//                 Is Certificate?
//               </label>
//             </div>
//           </div>

//           {formData.is_pricemoney && (
//             <div className="input-wrapper mt-2">
//               <label
//                 htmlFor="price_money"
//                 className="text-sm font-medium text-gray700 mb-1 block"
//               >
//                 Price Money
//                 <span className="text-sm text-red-500 ml-1">*</span>
//               </label>
//               <input
//                 type="number"
//                 id="price_money"
//                 placeholder="Enter Price Money"
//                 value={formData.price_money}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500"
//               />
//             </div>
//           )}

//           <div className="input-wrapper flex items-center gap-1 mt-4">
//             <input
//               type="checkbox"
//               id="is_exciting_price"
//               checked={formData.is_exciting_price}
//               onChange={handleExcitingPrice}
//               className="appearance-none w-4 h-4 border border-gray400 rounded-sm checked:bg-blue-500 checked:border-transparent flex items-center justify-center"
//             />
//             <label
//               htmlFor="is_exciting_price"
//               className="text-sm font-medium text-gray700 cursor-pointer"
//             >
//               Is Exciting Price?
//             </label>
//           </div>

//           {formData.is_exciting_price &&
//             excitingPrices.map((entry, index) => (
//               <div key={index} className="input-group mt-2 relative">
//                 <div className="grid grid-cols-[87%_13%]">
//                   <div className="grid grid-cols-2 gap-2">
//                     <div className="input-wrapper">
//                       <label
//                         htmlFor={`item_name-${index}`}
//                         className="text-sm font-medium text-gray700 mb-1 block"
//                       >
//                         Item Name
//                       </label>
//                       <input
//                         type="text"
//                         id={`item_name-${index}`}
//                         placeholder="Enter Item Name"
//                         value={entry.item_name}
//                         onChange={(e) =>
//                           handleExcitingPriceChange(
//                             index,
//                             "item_name",
//                             e.target.value
//                           )
//                         }
//                         className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500"
//                       />
//                     </div>
//                     <div className="input-wrapper relative">
//                       <label
//                         htmlFor={`quantity-${index}`}
//                         className="text-sm font-medium text-gray700 mb-1 block"
//                       >
//                         Quantity
//                       </label>
//                       <input
//                         type="number"
//                         id={`quantity-${index}`}
//                         placeholder="Enter Quantity"
//                         value={entry.quantity}
//                         onChange={(e) =>
//                           handleExcitingPriceChange(
//                             index,
//                             "quantity",
//                             e.target.value
//                           )
//                         }
//                         className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     {index === excitingPrices.length - 1 && (
//                       <button
//                         type="button"
//                         onClick={handleAddExcitingPrice}
//                         className="absolute right-2 bottom-2 text-lg bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-blue-600"
//                         title="Add More"
//                       >
//                         <FiPlus size={18} />
//                       </button>
//                     )}
//                     {excitingPrices.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => {
//                           const updated = [...excitingPrices];
//                           updated.splice(index, 1);
//                           setExcitingPrices(updated);
//                         }}
//                         className="absolute right-10 bottom-2 text-lg bg-red-text-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600"
//                         title="Remove"
//                       >
//                         <FiMinus size={18} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}

//           <div className="input-wrapper">
//             <label
//               htmlFor="terms_condition"
//               className="text-sm font-medium text-gray700 mb-1 block"
//             >
//               Terms & Condition
//               <span className="text-sm text-red-500 ml-1">*</span>
//             </label>
//             <textarea
//               id="terms_condition"
//               placeholder="Enter Terms & Condition"
//               value={formData.terms_condition}
//               onChange={handleInputChange}
//               className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500 h-32"
//             ></textarea>
//           </div>
//           <div className="input-wrapper">
//             <label
//               htmlFor="announcement_details"
//               className="text-sm font-medium text-gray700 mb-1 block"
//             >
//               Announcement Details
//               <span className="text-sm text-red-500 ml-1">*</span>
//             </label>
//             <textarea
//               id="announcement_details"
//               placeholder="Enter Announcement Details"
//               value={formData.announcement_details}
//               onChange={handleInputChange}
//               className="w-full border border-gray300 p-2 rounded-md outline-none shadow-none focus:border-blue-500 h-32"
//             ></textarea>
//           </div>
//           <div className="flex items-center justify-center">
//             <button
//               type="submit"
//               className="bg-blue-500 rounded-md text-white py-2 px-6 transition hover:bg-blue-600 mt-6"
//             >
//               {id ? "Update" : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </div>
//   );
// };

// export default AnnouncementCreationForm;
