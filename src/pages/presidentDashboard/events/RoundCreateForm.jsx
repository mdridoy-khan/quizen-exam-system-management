import { format, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt, FaSpinner } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import API from "../../../api/API";
import UploadIcon from "../../../assets/icons/upload.svg";
import QuizCard from "../../../components/QuizCard";
import { FormHandleEnterKey } from "../../../utils/FormHandleEnterKey";

const RoundCreationForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const roundID = searchParams.get("round_id");
  const [studyMaterial, setStudyMaterial] = useState(null);
  const [eventImageName, setEventImageName] = useState("No file chosen");
  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const datePickerRef = useRef(null);
  const datePickerRefEnd = useRef(null);

  const navigate = useNavigate();

  // form initial value assign
  const [formData, setFormData] = useState({
    round_name: "",
    department: "",
    // topic_subject: "",
    duration: "",
    quiz_start_date: null,
    quiz_end_date: null,
    question_type: "",
    total_questions: "",
    marks_per_question: "",
    negative_marks_per_question: "",
    next_round_qualifier: "",
    exam_type: "",
    address: "",
  });

  // Fetch announcement details
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    API.get(`/anc/single-announcement-details/${id}/`)
      .then((res) => {
        setAnnouncement(res.data.data);
        setError(null);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Failed to fetch announcement details"
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch round details for edit mode
  useEffect(() => {
    if (!id || !roundID) return;
    setLoading(true);
    API.get(`/anc/single-round-details-view/${roundID}`)
      .then((res) => {
        const round = res.data.data;
        if (round) {
          setFormData({
            round_name: round.round_name || "",
            department: round.department || "",
            // topic_subject: round.topic_subject || "",
            duration: round.duration || "",
            quiz_start_date: round.quiz_start_date
              ? new Date(round.quiz_start_date)
              : null,
            quiz_end_date: round.quiz_end_date
              ? new Date(round.quiz_end_date)
              : null,
            question_type: round.question_type || "",
            total_questions: round.total_questions || "",
            marks_per_question: round.marks_per_question || "",
            negative_marks_per_question: round.negative_marks_per_question || 0,
            next_round_qualifier: round.next_round_qualifier || "",
            exam_type: round.exam_type || "",
            address: round.address || "",
          });
          if (round.study_material) {
            setEventImageName(round.study_material.split("/").pop());
            setStudyMaterial({
              file: null,
              previewURL: round.study_material,
            });
          }
        }
        setError(null);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Failed to fetch round details"
        );
      })
      .finally(() => setLoading(false));
  }, [id, roundID]);

  // Input change handler
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // File change
  const handleEventImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setStudyMaterial({ file, previewURL });
      setEventImageName(file.name);
    } else {
      setStudyMaterial(null);
      setEventImageName("No file chosen");
    }
  };

  // Date change handlers
  const handleStartDateChange = (date) => {
    setFormData((prev) => {
      const newData = { ...prev, quiz_start_date: date };
      if (newData.quiz_end_date) {
        newData.duration = Math.max(
          Math.round((newData.quiz_end_date - date) / 60000),
          0
        );
      }
      return newData;
    });
  };

  // handle end date change
  const handleEndDateChange = (date) => {
    setFormData((prev) => {
      const newData = { ...prev, quiz_end_date: date };
      if (newData.quiz_start_date) {
        newData.duration = Math.max(
          Math.round((date - newData.quiz_start_date) / 60000),
          0
        );
      }
      return newData;
    });
  };

  // duration time
  const getDurationText = (minutes) => {
    if (!minutes) return "";
    return minutes >= 60
      ? `${Math.floor(minutes / 60)} hour${minutes > 60 ? "s" : ""}`
      : `${minutes} minute${minutes > 1 ? "s" : ""}`;
  };

  const formatDate = (dateString) => {
    try {
      return dateString ? format(parseISO(dateString), "MMM dd, yyyy") : "";
    } catch (err) {
      return "";
    }
  };

  // Form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const payload = new FormData();
      payload.append("announcement", id);

      Object.keys(formData).forEach((key) => {
        let value = formData[key];
        if (key === "quiz_start_date" || key === "quiz_end_date") {
          value = value instanceof Date ? value.toISOString() : "";
        }
        payload.append(key, value);
      });

      if (studyMaterial?.file) {
        payload.append("study_material", studyMaterial.file);
      }

      if (roundID) {
        await API.put(
          `/anc/announcement/${id}/round/${roundID}/edit/`,
          payload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await API.post(`/anc/create-round/${id}/`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate(`/president/all-rounds/${id}/`);
    } catch (err) {
      const errorMessage = err.response?.data?.error;
      setSubmitError(
        errorMessage || "Failed to save round details. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Quiz Card */}
        <h2 className="text-xl md:text-2xl 2xl:text-3xl text-black font-semibold mb-8">
          Create New Round
        </h2>
        <div className="flex items-center justify-center pt-6 md:pt-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-3xl xl:text-4xl text-primary" />
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 text-red-700 rounded-xl border-l-4 border-red-500 flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          ) : (
            announcement && (
              <div className="w-full rounded-2xl border border-gray-200 transition-all duration-300">
                <QuizCard
                  image={announcement.announcement_event_image}
                  title={announcement.announcement_name}
                  startDate={formatDate(announcement.registration_start_date)}
                  endDate={formatDate(announcement.registration_end_date)}
                  rounds={announcement.round_number}
                  duration={announcement.total_days}
                  registrationText={announcement.is_reg_open}
                  showCashPrize={announcement.is_pricemoney}
                  showCertificate={announcement.is_certificate}
                  termsLink="/terms-and-conditions"
                  organizer={announcement.organizer_name}
                  subject={announcement.subject}
                  department_name={announcement.department_name}
                />
              </div>
            )
          )}
        </div>
        {/* Round Form */}
        <div className="bg-white p-8 rounded-2xl border border-gray200 transition-all duration-300">
          <h3 className="text-center text-2xl font-bold mb-10">
            Round Details
          </h3>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {submitError}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-14 w-14 border-t-3 border-b-3 border-[#FF2474]"></div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleFormSubmit}>
              {/* Round Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-wrapper">
                  <label
                    htmlFor="round_name"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Round Name
                    <span className="text-[#FF2474] ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="round_name"
                    value={formData.round_name}
                    onChange={handleChange}
                    onKeyDown={FormHandleEnterKey}
                    placeholder="Enter Round Name"
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
                    disabled={loading}
                  />
                </div>

                {/* Department */}
                <div className="input-wrapper">
                  <label
                    htmlFor="department"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Department
                    <span className="text-[#FF2474] ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="department"
                    value={formData.department}
                    onChange={handleChange}
                    onKeyDown={FormHandleEnterKey}
                    placeholder="Enter Department"
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Topic Subject */}
                {/* <div className="input-wrapper">
                  <label
                    htmlFor="topic_subject"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Topic Subject
                    <span className="text-[#FF2474] ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="topic_subject"
                    value={formData.topic_subject}
                    onChange={handleChange}
                    onKeyDown={FormHandleEnterKey}
                    placeholder="Enter Topic Subject"
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
                    disabled={loading}
                  />
                </div> */}

                {/* Next Round Qualifier */}
                <div className="input-wrapper">
                  <label
                    htmlFor="next_round_qualifier"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Next Round Qualifier
                    <span className="text-[#FF2474] ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    id="next_round_qualifier"
                    value={formData.next_round_qualifier}
                    onChange={handleChange}
                    onKeyDown={FormHandleEnterKey}
                    placeholder="Enter Next Round Qualifier"
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Quiz Dates & Duration */}
                <div className="input-wrapper datepicker relative">
                  <label
                    htmlFor="quiz_start_date"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Quiz Start Date
                    <span className="text-[#FF2474] ml-1">*</span>
                  </label>
                  <div className="relative date_time">
                    <DatePicker
                      ref={datePickerRef}
                      selected={formData.quiz_start_date}
                      onChange={handleStartDateChange}
                      onKeyDown={FormHandleEnterKey}
                      placeholderText="Quiz Start Date"
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      showTimeInput
                      className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
                      disabled={loading}
                    />
                    <FaRegCalendarAlt
                      onClick={() => datePickerRef.current?.setFocus()}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
                    />
                  </div>
                </div>
                <div className="input-wrapper datepicker relative">
                  <label
                    htmlFor="quiz_end_date"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Quiz End Date
                    <span className="text-[#FF2474] ml-1">*</span>
                  </label>
                  <div className="relative date_time">
                    <DatePicker
                      ref={datePickerRefEnd}
                      selected={formData.quiz_end_date}
                      onChange={handleEndDateChange}
                      onKeyDown={FormHandleEnterKey}
                      placeholderText="Quiz End Date"
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      showTimeInput
                      className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
                      disabled={loading}
                    />
                    <FaRegCalendarAlt
                      onClick={() => datePickerRefEnd.current?.setFocus()}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
                    />
                  </div>
                </div>
                <div className="input-wrapper">
                  <label
                    htmlFor="duration"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Duration
                    <span className="text-[#FF2474] ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="duration"
                    value={getDurationText(formData.duration)}
                    onKeyDown={FormHandleEnterKey}
                    readOnly
                    placeholder="Duration will be calculated"
                    className="w-full border border-gray-300 p-3 rounded-lg outline-none bg-gray-100 cursor-not-allowed text-gray-600 font-medium"
                    disabled
                  />
                </div>
              </div>

              {/* Total Questions, Marks, Negative Marks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="input-wrapper">
                  <label
                    htmlFor="total_questions"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Total Questions
                    <span className="text-[#FF2474] ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    id="total_questions"
                    value={formData.total_questions}
                    onChange={handleChange}
                    onKeyDown={FormHandleEnterKey}
                    placeholder="Enter Total Questions"
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none !bg-gray-50"
                    disabled={loading}
                  />
                </div>

                <div className="input-wrapper">
                  <label
                    htmlFor="marks_per_question"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Marks/Question
                    <span className="text-[#FF2474] ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    id="marks_per_question"
                    value={formData.marks_per_question}
                    onChange={handleChange}
                    onKeyDown={FormHandleEnterKey}
                    placeholder="Enter Marks per Question"
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none !bg-gray-50"
                    disabled={loading}
                  />
                </div>

                <div className="input-wrapper">
                  <label
                    htmlFor="negative_marks_per_question"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Negative Marks/Question
                  </label>
                  <input
                    type="number"
                    id="negative_marks_per_question"
                    value={formData.negative_marks_per_question}
                    onChange={handleChange}
                    onKeyDown={FormHandleEnterKey}
                    placeholder="Enter Negative Marks"
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Question Type & Exam Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-wrapper">
                  <label
                    htmlFor="question_type"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Question Type
                    <span className="text-[#FF2474] ml-1">*</span>
                  </label>
                  <select
                    id="question_type"
                    value={formData.question_type}
                    onChange={handleChange}
                    onKeyDown={FormHandleEnterKey}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50 appearance-none"
                    disabled={loading}
                  >
                    <option value="">Select Question Type</option>
                    <option value="mcq">MCQ</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                <div className="input-wrapper">
                  <label
                    htmlFor="exam_type"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Exam Type
                    <span className="text-[#FF2474] ml-1">*</span>
                  </label>
                  <select
                    id="exam_type"
                    value={formData.exam_type}
                    onChange={handleChange}
                    onKeyDown={FormHandleEnterKey}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50 appearance-none"
                    disabled={loading}
                  >
                    <option value="">Select Exam Type</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="mix">Mix</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="input-wrapper">
                <label
                  htmlFor="address"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  onKeyDown={FormHandleEnterKey}
                  placeholder="Enter Address"
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:border-primary focus:ring-primary outline-none bg-gray-50"
                  disabled={loading}
                />
              </div>

              {/* Study Material Upload */}
              <div className="input-wrapper">
                <label
                  htmlFor="eventFile"
                  className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                >
                  Study Material
                  <span className="text-[#FF2474] ml-1">*</span>
                </label>

                <label
                  htmlFor="eventFile"
                  className="w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-xl flex flex-col items-center justify-center gap-3 bg-white hover:border-[#FF2474] transition-all duration-300 hover:bg-[#FF2474]/5"
                >
                  <div className="bg-[#FF2474]/10 p-3 rounded-full">
                    <img
                      src={UploadIcon}
                      alt="upload icon"
                      className="max-w-8"
                    />
                  </div>
                  <span className="text-center">
                    <span className="text-[#FF2474] font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX, or images (MAX. 10MB)
                    </p>
                  </span>
                </label>

                <input
                  type="file"
                  id="eventFile"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      let previewURL = null;
                      if (file.type.startsWith("image/")) {
                        previewURL = URL.createObjectURL(file);
                      }

                      setStudyMaterial({ file, previewURL });
                      setEventImageName(file.name);
                    } else {
                      setStudyMaterial(null);
                      setEventImageName("No file chosen");
                    }
                  }}
                  onKeyDown={FormHandleEnterKey}
                  accept=".pdf,.doc,.docx,image/*"
                  disabled={loading}
                />

                {/* Preview */}
                {studyMaterial && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-[#261E69]/10 p-2 rounded-lg mr-3">
                          <svg
                            className="w-6 h-6 text-[#261E69]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 truncate max-w-xs">
                            {studyMaterial.file?.name || "No file chosen"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(studyMaterial.file?.size / 1024 / 1024).toFixed(
                              2
                            )}{" "}
                            MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setStudyMaterial(null);
                          setEventImageName("No file chosen");
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>

                    {studyMaterial.file?.type?.startsWith("image/") &&
                      studyMaterial.previewURL && (
                        <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={studyMaterial.previewURL}
                            alt="Study Material Preview"
                            className="w-full h-40 object-cover"
                            onError={() => {
                              setStudyMaterial(null);
                              setEventImageName("No file chosen");
                            }}
                          />
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex items-center justify-center pt-4">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className={`relative flex items-center justify-center bg-gradient-to-r from-[#FF2474] to-[#FF5C8A] 
      rounded text-white font-semibold py-3 px-8 transition-all duration-300 
      ${
        submitLoading
          ? "opacity-70 cursor-not-allowed"
          : "hover:scale-105 hover:shadow-lg"
      }
    `}
                >
                  {submitLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 
              0 5.373 0 12h4zm2 
              5.291A7.962 7.962 0 014 12H0c0 
              3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      Save Round
                    </span>
                  )}
                </button>
              </div>

              {/* <div className="flex items-center justify-center pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#FF2474] to-[#FF5C8A] rounded text-white font-semibold py-3 px-8 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      Save Round
                    </>
                  )}
                </button>
              </div> */}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoundCreationForm;
