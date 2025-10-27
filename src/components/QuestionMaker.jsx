import { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineFile, AiOutlineLink } from "react-icons/ai";
import { FaExclamationCircle, FaSpinner } from "react-icons/fa";
import { GiStarFormation } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { TbExclamationCircle } from "react-icons/tb";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/API";

const QuestionMaker = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [inputMode, setInputMode] = useState("file");

  const [rounds, setRounds] = useState(null);
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [language, setLanguage] = useState("english");
  const [difficulty, setDifficulty] = useState("easy");
  const [questionType, setQuestionType] = useState("multiple");
  const [textInput, setTextInput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [quizResponse, setQuizResponse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [showNotice, setShowNotice] = useState(true);

  const location = useLocation();
  const { roundId } = location.state || {};
  const { announcementId } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  console.log("tutor announcementId:", announcementId);

  const navigate = useNavigate();

  // Fetch announcement or round details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!announcementId) return;

      setLoading(true);
      setError(null);

      try {
        let response;

        if (roundId) {
          response = await API.get(
            `/anc/single-round-details-view/${roundId}/`
          );
        } else if (announcementId) {
          response = await API.get(
            `/anc/single-announcement-details/${announcementId}/`
          );
        }

        console.log("Details:", response.data.data);
        setRounds(response.data.data);
        setAnnouncement(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [roundId, announcementId]);

  // handleQuizQuestionSave
  async function handleQuizQuestionSave() {
    try {
      if (!announcementId) {
        setSaveError("Round ID or Announcement ID missing");
        return;
      }
      setIsSaving(true);

      const payload = {
        quiz_prompt: prompt,
        quiz_link: link,
        quiz: questions.map((q, index) => ({
          question_no: index + 1,
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation || "",
          type: "mcq",
        })),
      };

      const response = await API.post(
        `/qzz/tut/anc/${announcementId}/save-quiz/`,
        payload
      );

      console.log("Quiz saved successfully:", response.data);
      setSuccessMessage("Quiz saved successfully!");
      setShowModal(false);
      setSaveError("");
      toast.success("Quiz created and saved successfully!");
    } catch (err) {
      console.error("Error saving quiz:", err);
      setSaveError("Failed to save quiz. Please try again.");
      setSuccessMessage("");
      toast.error("Failed to save quiz. Please try again.");
    } finally {
      setIsSaving(false);
      navigate("/president/dashboard");
    }
  }

  // Auto-hide effect
  useEffect(() => {
    let timer;
    if (successMessage || saveError) {
      timer = setTimeout(() => {
        setSuccessMessage("");
        setSaveError("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [successMessage, saveError]);

  // Set default number of questions if announcement has tutor_share_qes_number
  useEffect(() => {
    if (announcement?.tutor_share_qes_number) {
      setNumberOfQuestions(announcement.tutor_share_qes_number);
    }
  }, [announcement]);

  // Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;

    // allow empty string so user can backspace
    if (value === "") {
      setNumberOfQuestions("");
      return;
    }

    const number = parseInt(value, 10);

    // prevent 0 or negative
    if (number >= 1) {
      setNumberOfQuestions(number);
    }
  };

  const validateLink = (value) => {
    setLink(value);
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?([\\w\\-]+\\.)+[\\w]{2,}(\\/[\\w\\-._~:/?#[\\]@!$&'()*+,;=]*)?$",
      "i"
    );
    setLinkError(
      value && !urlPattern.test(value)
        ? "Invalid link! Please enter a valid URL."
        : ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("language", language === "bangla" ? "bn" : "en");
      formData.append(
        "type",
        questionType === "multiple" ? "mcq" : questionType
      );
      formData.append("num_questions", numberOfQuestions);
      formData.append("prompt", prompt);

      if (inputMode === "text") formData.append("text", textInput);
      if (inputMode === "file" && selectedFile)
        formData.append("file", selectedFile);
      if (inputMode === "link" && link) formData.append("link", link);

      const response = await API.post(
        `/qzz/tutor-json-response/${announcementId}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Quiz Response:", response.data);
      setQuizResponse(response.data);
      setShowModal(true);

      if (response.data?.quiz) {
        setQuestions(response.data.quiz);
      }

      // setShowModal(true);
    } catch (err) {
      console.error("Submit Error:", err);
      const backendMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Failed to generate quiz. Please try again.";

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-10">
      {/* bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4 sm:px-6 */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 xl:mb-10">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex flex-col sm:flex-row items-center justify-center flex-wrap gap-2 mb-4">
            <span>Quiz Maker That's</span>
            <span className="text-primary">Delightfully Easy</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 128 128"
              className="w-16 h-16 xl:w-[100px] xl:h-[100px] animate-softBounce"
            >
              <path
                fill="#a1887f"
                d="M64 47.54s7.72.19 18.71-3.94s15.6-9.79 23.1-12.25s14.55-2.31 18.07 5.69s.25 17.17-1.22 21.18s-9.2 11.73-18.4 15.82c0 0-20.98 5.42-40.25 6.22V47.54zm0 0s-7.72.19-18.71-3.94s-15.7-9.8-23.2-12.26s-14.45-2.3-17.97 5.7s-.25 17.16 1.22 21.17s9.2 11.73 18.4 15.82c0 0 20.98 5.42 40.25 6.22V47.54z"
              />
              <path
                fill="#8d6e63"
                d="M30.85 36.16s-11.19-5.3-14.94-1.34c-2.23 2.36-1.87 7.49 5.49 13.63zm66.47 0s11.19-5.3 14.94-1.34c2.23 2.36 1.87 7.49-5.49 13.63z"
              />
              <path
                fill="#fcc21b"
                d="M64 19.77c-60.16 0-61.59 67.44-61.59 80.79S29.99 124.73 64 124.73c34.02 0 61.59-10.82 61.59-24.17S124.17 19.77 64 19.77"
              />
              <path
                fill="#bcaaa4"
                d="M64 6.57c-4.11 0-4.52-3.3-8.94-3.3c-5.4 0-21.43 15.61-22.73 18.12c-1.04 2-3.89 8.94-4.25 10.59c-.38 1.74-2.85 1.47-4.01.68c0 0 9.5 7.6 19.41 11.14C53.39 47.33 64 47.68 64 47.68zm0 0c4.11 0 4.52-3.3 8.94-3.3c5.4 0 21.36 15.65 22.73 18.12c1.41 2.54 4.15 8.94 4.58 10.77c.41 1.74.51 2.29 1.68 1.49c0 0-7.5 6.6-17.41 10.14S64 47.68 64 47.68z"
              />
              <path
                fill="#ed6c30"
                d="M89.47 88.41c-1.06-2.07-3.7-3.88-7.25-3.79c-3.73.1-9.11 1.55-12.68 2.06c-1.82.25-3.7.37-5.5.42c-1.81-.05-3.69-.16-5.52-.42c-3.57-.51-8.95-1.96-12.68-2.06c-3.55-.09-6.19 1.72-7.25 3.79c-2.68 5.14 2.96 12.12 7.73 15.32c5.03 3.38 9.63 5.06 14.79 5.74c1.22.16 4.58.2 5.94-.02c5.52-.9 9.5-2.33 14.54-5.72c4.76-3.2 10.56-10.18 7.88-15.32"
              />
              <path
                fill="#bcaaa4"
                d="M33.16 29.53s12.05-2.55 30.86-3.44L64 47.68s-18.71.29-37.14-12.88c0 0 5.22 1.76 6.3-5.27"
              />
              <path
                fill="#bcaaa4"
                d="M94.84 29.53s-12.5-2.34-30.83-3.44L64 47.68s18.48.44 36.91-12.74c0 .01-4.97 1.49-6.07-5.41"
              />
              <path
                fill="#bcaaa4"
                d="M126.4 34.65c-2.12-6.58-8.79-10.91-16.96-8.79c-8.18 2.12-19.69 13.8-26.66 16.83S68.24 45.64 64 45.64v1.59s7.62.58 19.32-3.96s17.41-9.64 26.75-11.23c9.35-1.59 13.4 3.37 14.28 6.18c1.25 3.98 1.56 15.17-4.26 22.98c-.11.15-.21.28-.31.41l.49 1.78c.61-.72 1.18-1.51 1.92-2.57c6.96-10 5.35-22.65 4.21-26.17M8.22 61.6c-.1-.13-.21-.26-.32-.4c-6.06-7.62-5.51-19-4.26-22.98c.88-2.81 4.77-7.94 14.12-6.35s15.38 7.02 27.08 11.56S64 47.23 64 47.23v-1.59c-4.24 0-11.81.08-18.78-2.95s-18.48-14.7-26.66-16.83c-8.18-2.12-14.84 2.2-16.96 8.79c-1.14 3.52-2.74 16.17 4.2 26.18c.71 1.02 1.33 1.84 1.86 2.49z"
              />
              <path
                fill="#a1887f"
                d="M52.02 7.16c2.13-.93 5.51 1.1 5.69 3.96s-7.08 9.9-18.53 12.55S48.37 8.75 52.02 7.16m23.84 0c-2.13-.93-5.51 1.1-5.69 3.96s7.08 9.9 18.53 12.55S79.52 8.75 75.86 7.16"
                opacity="0.5"
              />
              <path
                fill="#bcaaa4"
                d="M41.6 40.81s10.71 6.14 22.4 6.14s20.62-5.15 20.62-5.15S64 48.22 41.6 40.81"
              />
              <path
                fill="#a1887f"
                d="M33.62 35.49s14.2-3.38 31.44-2.98s29.17 2.98 29.17 2.98l3.63-3.17S84.22 27.2 64.77 27.2s-34.63 5.14-34.63 5.14z"
              />
              <path
                fill="#8d6e63"
                d="M64.49 28.45c-.73 0-6.29 1.02-6.29 1.64s5.54 1.46 6.29 1.46s6.17-.77 6.17-1.3s-5.72-1.8-6.17-1.8m16.38.99c-.64-.06-5.58.37-5.63.91s4.72 1.74 5.37 1.8s5.45-.16 5.5-.62s-4.84-2.05-5.24-2.09m-33.59 0c.64-.06 5.58.37 5.63.91s-4.72 1.74-5.37 1.8s-5.45-.16-5.5-.62c-.04-.46 4.84-2.05 5.24-2.09"
              />
              <path
                fill="#2f2f2f"
                d="M42.21 72.65c-4.49.04-8.17-4.27-8.22-9.62c-.05-5.37 3.55-9.75 8.04-9.79c4.48-.04 8.17 4.27 8.22 9.64c.05 5.36-3.55 9.73-8.04 9.77m44.11 0c4.48-.01 8.11-4.36 8.1-9.71c-.01-5.37-3.66-9.7-8.14-9.69c-4.49.01-8.13 4.36-8.12 9.73c.01 5.36 3.67 9.69 8.16 9.67"
              />
            </svg>
          </h2>

          {/* Notice message */}
          {showNotice && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-5 mb-4 xl:mb-8 text-left shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <TbExclamationCircle
                    size={24}
                    className="text-amber-500 mt-1 mr-3 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-amber-800 mb-1">
                      Notice for “Math Quiz 2025”
                    </h3>
                    <p className="text-amber-700 text-sm">
                      We're truly excited to have you here! You're valued and
                      supported every step of the way. Make yourself at home,
                      explore freely, and don't hesitate to reach out if you
                      need anything. Once again, a heartfelt welcome — we're
                      excited for what lies ahead!
                    </p>
                  </div>
                </div>
                <button
                  className="text-amber-500 hover:text-amber-700"
                  onClick={() => setShowNotice(false)}
                >
                  <RxCross2 size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Announcement info */}
          <div className="bg-white rounded-xl shadow-md p-6 xl:mb-8 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="text-sm">
                <div className="bg-blue-50 text-primary px-3 py-3 md:py-1 rounded-full flex flex-col sm:flex-row items-center gap-2 text-sm font-medium mb-2 sm:mb-0 ">
                  <FaExclamationCircle className="h-4 w-4" />
                  YOU ARE MAKING QUESTIONS FOR
                  {rounds?.announcement ? (
                    <Link
                      to={`/quiz-details/${rounds.announcement}`}
                      className="text-primary hover:text-primary text-sm xl:text-base font-medium underline"
                      target="_blank"
                    >
                      {rounds.announcement_name}
                    </Link>
                  ) : announcement?.id ? (
                    <Link
                      to={`/quiz-details/${announcement.id}`}
                      className="text-primary hover:text-primary font-medium underline"
                      target="_blank"
                    >
                      {announcement.announcement_name}
                    </Link>
                  ) : (
                    <span className="font-medium">“QUIZ COMPETITION”</span>
                  )}
                </div>
              </div>
            </div>

            {(rounds?.topic_subject || announcement?.subject) && (
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Subject:</span>
                <span className="font-medium text-gray-800">
                  {rounds?.topic_subject || announcement?.subject}
                </span>
              </div>
            )}

            {rounds?.total_questions && (
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Required Questions:</span>
                <span className="font-medium text-gray-800">
                  {rounds?.total_questions}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error & Loading */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex">
            <FaExclamationCircle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="bg-blue-50 border-l-4 border-primary text-primary p-4 rounded-lg mb-6 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-3"></div>
            <span>Loading...</span>
          </div>
        )}

        {/* Input mode switcher */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-4 xl:mb-8">
          <div className="flex flex-col sm:flex-row">
            {[
              {
                id: "file",
                label: "By File",
                icon: <AiOutlineFile size={20} />,
              },
              {
                id: "text",
                label: "By Text",
                icon: <AiOutlineEdit size={20} />,
              },
              {
                id: "link",
                label: "By Link",
                icon: <AiOutlineLink size={20} />,
              },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setInputMode(mode.id)}
                className={`flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-200 flex-1 m-1 ${
                  inputMode === mode.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{mode.icon}</span>
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quiz Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={numberOfQuestions}
                  min={1}
                  onChange={handleNumberChange}
                  disabled={!!announcement?.tutor_share_qes_number}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition outline-none shadow-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition outline-none shadow-none"
                >
                  <option value="english">English</option>
                  <option value="bangla">Bangla</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition outline-none shadow-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition outline-none shadow-none"
                >
                  <option value="multiple">Multiple Choice</option>
                </select>
              </div>
            </div>

            {/* Messages */}
            {saveError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center">
                <FaExclamationCircle className="h-5 w-5 mr-2" />
                <span>{saveError}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Input area */}
            <div className="space-y-6">
              {inputMode === "text" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter your text
                  </label>
                  <textarea
                    className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition outline-none shadow-none"
                    placeholder="Paste your text here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                </div>
              )}

              {inputMode === "file" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload a file
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo400 transition cursor-pointer relative">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="h-12 w-12 text-primary mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, PPTX, DOC, DOCX, TXT, PNG, JPG
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.pptx,.doc,.docx,.txt,.png,.jpg,.jpeg"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="absolute inset-0 cursor-pointer"
                    ></label>
                  </div>

                  {selectedFile && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-lg flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {inputMode === "link" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter a URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter a valid URL..."
                      value={link}
                      onChange={(e) => validateLink(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg outline-none shadow-none focus:ring-1 focus:ring-primary focus:border-primary transition pl-10 ${
                        linkError ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <svg
                      className="absolute left-3 top-3 h-4 w-4 text-gray400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    {linkError && (
                      <p className="text-red-500 text-xs mt-1">{linkError}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Prompt (Optional)
                </label>
                <textarea
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition outline-none shadow-none"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70"
                >
                  {loading ? "Generating..." : "Generate Quiz"}
                  <GiStarFormation className="ml-2" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Quiz Question save modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-600 bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-2 lg:p-4 xl:p-6 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg lg:text-xl xl:text-2xl font-bold">
                  Quiz Created Successfully
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 transition"
                >
                  <RxCross2 className="w-4 h-5 sm:w-4 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                </button>
              </div>
              <p className="xl:mt-2 opacity-90 text-sm lg:text-base">
                Your AI-generated quiz is ready to be saved
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Number of Questions</span>
                  <span className="font-medium">{numberOfQuestions}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium capitalize">{language}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-medium capitalize">{difficulty}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Question Type</span>
                  <span className="font-medium capitalize">{questionType}</span>
                </div>

                {prompt && (
                  <div className="py-3">
                    <p className="text-gray-600 mb-2">Prompt</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800">{prompt}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            {/* <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                className="flex items-center justify-center bg-gradient-to-r text-sm xl:text-base from-primary to-secondary text-white py-1 xl:py-3 px-4 xl:px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                onClick={handleQuizQuestionSave}
              >
                <svg
                  className="h-4 xl:h-5 w-4 xl:w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Quiz
              </button>
            </div> */}
            <div className="bg-gray50 px-6 py-4 flex justify-end">
              <button
                className={`flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-lg font-medium shadow-md transition-all duration-200
                  ${
                    isSaving
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg"
                  }`}
                onClick={handleQuizQuestionSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionMaker;

// import { useEffect, useState } from "react";
// import { FaExclamationCircle } from "react-icons/fa";
// import { GiStarFormation } from "react-icons/gi";
// import { Link, useLocation, useParams } from "react-router-dom";
// import API from "../api/API";
// import Happyicon from "../assets/icons/happy-face.svg";
// import Stars from "../assets/icons/stars.svg";

// const QuestionMaker = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [link, setLink] = useState("");
//   const [linkError, setLinkError] = useState("");
//   const [inputMode, setInputMode] = useState("file");

//   const [rounds, setRounds] = useState(null);
//   const [announcement, setAnnouncement] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [numberOfQuestions, setNumberOfQuestions] = useState(1);
//   const [language, setLanguage] = useState("english");
//   const [difficulty, setDifficulty] = useState("easy");
//   const [questionType, setQuestionType] = useState("multiple");
//   const [textInput, setTextInput] = useState("");
//   const [prompt, setPrompt] = useState("");
//   const [quizResponse, setQuizResponse] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const [successMessage, setSuccessMessage] = useState("");
//   const [saveError, setSaveError] = useState("");

//   const location = useLocation();
//   const { roundId, annId } = location.state || {};
//   const { announcementId } = useParams();
//   console.log("Received roundId:", roundId, "announcementId:", annId);

//   // Fetch announcement or round details
//   useEffect(() => {
//     const fetchDetails = async () => {
//       if (!roundId && !announcementId) return;

//       setLoading(true);
//       setError(null);

//       try {
//         let response;

//         if (roundId) {
//           response = await API.get(
//             `/anc/single-round-details-view/${roundId}/`
//           );
//         } else if (announcementId) {
//           response = await API.get(
//             `/anc/single-announcement-details/${announcementId}/`
//           );
//         }

//         console.log("Details:", response.data.data);
//         setRounds(response.data.data);
//         setAnnouncement(response.data.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDetails();
//   }, [roundId, announcementId]);

//   // handleQuizQuestionSave
//   async function handleQuizQuestionSave() {
//     try {
//       if (!roundId || !annId) {
//         setSaveError("Round ID or Announcement ID missing");
//         return;
//       }

//       const payload = {
//         quiz_prompt: prompt,
//         quiz_link: link,
//         quiz: questions.map((q, index) => ({
//           question_no: index + 1,
//           question: q.question,
//           options: q.options,
//           answer: q.answer,
//           explanation: q.explanation || "",
//           type: "mcq",
//         })),
//       };

//       const response = await API.post(
//         `/qzz/pre/anc/${annId}/round/${roundId}/save-quiz/`,
//         payload
//       );

//       console.log("Quiz saved successfully:", response.data);
//       setSuccessMessage("Quiz saved successfully!");
//       setShowModal(false);
//       setSaveError("");
//     } catch (err) {
//       console.error("Error saving quiz:", err);
//       setSaveError("Failed to save quiz. Please try again.");
//       setSuccessMessage("");
//     }
//   }

//   // Auto-hide effect
//   useEffect(() => {
//     let timer;
//     if (successMessage || saveError) {
//       timer = setTimeout(() => {
//         setSuccessMessage("");
//         setSaveError("");
//       }, 3000);
//     }
//     return () => clearTimeout(timer);
//   }, [successMessage, saveError]);

//   // Set default number of questions if announcement has tutor_share_qes_number
//   useEffect(() => {
//     if (announcement?.tutor_share_qes_number) {
//       setNumberOfQuestions(announcement.tutor_share_qes_number);
//     }
//   }, [announcement]);

//   // Handlers
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setSelectedFile(file);
//   };

//   const handleNumberChange = (e) => {
//     const value = e.target.value;

//     // allow empty string so user can backspace
//     if (value === "") {
//       setNumberOfQuestions("");
//       return;
//     }

//     const number = parseInt(value, 10);

//     // prevent 0 or negative
//     if (number >= 1) {
//       setNumberOfQuestions(number);
//     }
//   };

//   const validateLink = (value) => {
//     setLink(value);
//     const urlPattern = new RegExp(
//       "^(https?:\\/\\/)?([\\w\\-]+\\.)+[\\w]{2,}(\\/[\\w\\-._~:/?#[\\]@!$&'()*+,;=]*)?$",
//       "i"
//     );
//     setLinkError(
//       value && !urlPattern.test(value)
//         ? "Invalid link! Please enter a valid URL."
//         : ""
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const formData = new FormData();
//       formData.append("language", language === "bangla" ? "bn" : "en");
//       formData.append(
//         "type",
//         questionType === "multiple" ? "mcq" : questionType
//       );
//       formData.append("num_questions", numberOfQuestions);
//       formData.append("prompt", prompt);

//       if (inputMode === "text") formData.append("text", textInput);
//       if (inputMode === "file" && selectedFile)
//         formData.append("file", selectedFile);
//       if (inputMode === "link" && link) formData.append("link", link);

//       const response = await API.post(
//         "qzz/president-json-response/",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       console.log("Quiz Response:", response.data);
//       setQuizResponse(response.data);
//       setShowModal(true);

//       if (response.data?.quiz) {
//         setQuestions(response.data.quiz);
//       }

//       // setShowModal(true);
//     } catch (err) {
//       console.error("Submit Error:", err);
//       setError("Failed to generate quiz. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto lg:px-4 text-center">
//       {/* Header */}
//       <div>
//         <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold text-[var(--black-600)] flex items-center justify-center flex-wrap gap-2 mb-2">
//           Quiz Maker That's{" "}
//           <span className="text-[var(primary)]">Delightfully</span> Easy
//           <img src={Happyicon} alt="happy icon" />
//         </h2>
//         <h4 className="text-xl lg:text-2xl text-[var(--black-600)] font-semibold">
//           Create a quiz or assessment instantly with AI
//         </h4>
//         <div className="mt-8 lg:mt-10 relative">
//           <h4 className="text-xl lg:text-2xl font-semibold text-[var(--blue-slate-500)] flex items-center gap-1 justify-center">
//             <img src={Stars} alt="star icon" />
//             Let ProProfs AI Build a Quiz
//           </h4>
//           <p className="text-[var(--black-600-400)] text-sm font-medium">
//             Describe your quiz and we'll create it for you
//           </p>
//         </div>
//       </div>

//       {/* Error & Loading */}
//       {error && (
//         <div className="max-w-xl mx-auto mt-4 bg-red-100 text-red-600 p-2 rounded text-sm flex items-center gap-2">
//           <FaExclamationCircle className="h-4 w-4" />
//           {error}
//         </div>
//       )}
//       {loading && (
//         <div className="max-w-xl mx-auto mt-4 flex justify-center items-center">
//           <svg
//             className="animate-spin h-6 w-6 text-[var(--blue-slate-500)]"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             ></circle>
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//             ></path>
//           </svg>
//           <span className="ml-2 text-sm text-[var(--blue-slate-500)]">
//             Loading...
//           </span>
//         </div>
//       )}

//       {/* Input mode switcher */}
//       <div className="max-w-64 mx-auto mt-4 lg:mt-8">
//         <div className="flex items-center gap-2 justify-between border border-[var(gray-300)] rounded-full p-1">
//           {["file", "text", "link"].map((mode) => (
//             <button
//               key={mode}
//               type="button"
//               onClick={() => setInputMode(mode)}
//               className={`py-1 px-4 rounded-full transition text-sm font-medium ${
//                 inputMode === mode
//                   ? "bg-[var(--blue-slate-500)] text-[var(--white)]"
//                   : "text-[var(--blue-slate-500)] hover:bg-[var(--blue-slate-500)] hover:text-[var(--white)]"
//               }`}
//             >
//               {mode === "file"
//                 ? "By File"
//                 : mode === "text"
//                 ? "By Text"
//                 : "By Link"}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Form */}
//       <div className="mt-6 max-w-2xl mx-auto">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Quiz Options */}
//           <div className="input_wrapper md:max-w-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
//             <div className="input-group">
//               <label
//                 htmlFor="number"
//                 className="text-sm text-left font-medium text-[var(--black-600-400)] mb-1 block"
//               >
//                 Number of questions
//               </label>
//               <input
//                 type="number"
//                 id="number"
//                 value={numberOfQuestions}
//                 min={1}
//                 onChange={handleNumberChange}
//                 disabled={!!announcement?.tutor_share_qes_number}
//                 className="text-sm w-full h-8 border border-[var(gray-300)] p-2 rounded-md outline-none shadow-none focus:border focus:border-[var(primary)]"
//               />
//             </div>
//             <div className="input-group">
//               <label
//                 htmlFor="language"
//                 className="text-sm text-left font-medium text-[var(--black-600-400)] mb-1 block"
//               >
//                 Language
//               </label>
//               <select
//                 id="language"
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 className="text-sm w-full h-8 border border-[var(gray-300)] px-2 rounded-md outline-none shadow-none focus:border focus:border-[var(primary)]"
//               >
//                 <option value="english">English</option>
//                 <option value="bangla">Bangla</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label
//                 htmlFor="difficulty"
//                 className="text-sm text-left font-medium text-[var(--black-600-400)] mb-1 block"
//               >
//                 Difficulty
//               </label>
//               <select
//                 id="difficulty"
//                 value={difficulty}
//                 onChange={(e) => setDifficulty(e.target.value)}
//                 className="text-sm w-full h-8 border border-[var(gray-300)] px-2 rounded-md outline-none shadow-none focus:border focus:border-[var(primary)]"
//               >
//                 <option value="easy">Easy</option>
//                 <option value="medium">Medium</option>
//                 <option value="hard">Hard</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label
//                 htmlFor="questionType"
//                 className="text-sm text-left font-medium text-[var(--black-600-400)] mb-1 block"
//               >
//                 Type of question(s)
//               </label>
//               <select
//                 id="questionType"
//                 value={questionType}
//                 onChange={(e) => setQuestionType(e.target.value)}
//                 className="text-sm w-full h-8 border border-[var(gray-300)] px-2 rounded-md outline-none shadow-none focus:border focus:border-[var(primary)] leading-none"
//               >
//                 <option value="multiple">Multiple Choice</option>
//               </select>
//             </div>
//           </div>

//           {/* Announcement info */}
//           <div className="max-w-xl mx-auto flex flex-col items-start">
//             <div className="text-base font-medium mb-2">
//               {(rounds?.topic_subject || announcement?.subject) && (
//                 <div className="text-base font-medium text-[var(--black-600)]">
//                   Subject:{" "}
//                   <span className="text-[var(--blue-slate-500)]">
//                     {rounds?.topic_subject || announcement?.subject}
//                   </span>
//                 </div>
//               )}
//             </div>
//             <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center gap-2 text-[12px] border border-yellow-200 font-medium">
//               <FaExclamationCircle className="h-4 w-4" />
//               YOU ARE MAKING QUESTION FOR{" "}
//               {rounds?.announcement ? (
//                 <Link
//                   to={`/quiz-details/${rounds.announcement}`}
//                   className="text-[var(--blue-slate-500)] hover:underline"
//                   target="_blank"
//                 >
//                   “QUIZ COMPETITION”
//                 </Link>
//               ) : announcement?.id ? (
//                 <Link
//                   to={`/quiz-details/${announcement.id}`}
//                   className="text-[var(--blue-slate-500)] hover:underline"
//                   target="_blank"
//                 >
//                   “QUIZ COMPETITION”
//                 </Link>
//               ) : (
//                 <span>“QUIZ COMPETITION”</span>
//               )}
//             </div>
//           </div>

//           {/* Messages */}
//           {saveError && (
//             <div className="max-w-xl mx-auto mt-4 bg-red-100 text-red-600 p-2 rounded text-sm">
//               {saveError}
//             </div>
//           )}

//           {successMessage && (
//             <div className="max-w-xl mx-auto mt-4 bg-green-100 text-green-600 p-2 rounded text-sm">
//               {successMessage}
//             </div>
//           )}

//           {/* Input area */}
//           <div className="max-w-xl mx-auto space-y-4">
//             {inputMode === "text" && (
//               <textarea
//                 className="w-full h-48 border border-[var(gray-300)] p-2 rounded-md outline-none focus:border focus:border-[var(primary)]"
//                 placeholder="Paste your text here..."
//                 value={textInput}
//                 onChange={(e) => setTextInput(e.target.value)}
//               />
//             )}
//             {inputMode === "file" && (
//               <div className="file-upload">
//                 <label
//                   htmlFor="fileUpload"
//                   className="w-full h-[200px] border border-dashed border-[var(gray-300)] rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[var(primary)] transition"
//                 >
//                   <div className="flex flex-col items-center gap-2 text-[var(gray500)]">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-8 w-8 text-[var(primary)]"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-3 3m3-3l3 3"
//                       />
//                     </svg>
//                     <span className="text-sm font-medium text-[var(--black-600-400)]">
//                       Upload File
//                     </span>
//                     <span className="text-xs text-[var(--black-600)]">
//                       PDF, PPTX, DOC, DOCX, TXT, PNG, JPG
//                     </span>
//                   </div>
//                 </label>
//                 <input
//                   type="file"
//                   id="fileUpload"
//                   name="fileUpload"
//                   onChange={handleFileChange}
//                   accept=".pdf,.pptx,.doc,.docx,.txt,.png,.jpg,.jpeg"
//                   className="hidden"
//                 />
//                 {selectedFile && (
//                   <div className="mt-2 text-sm text-[var(--black-600-600)] bg-[var(gray100)] p-2 rounded-md">
//                     <p>
//                       <span className="font-medium">Uploaded:</span>{" "}
//                       {selectedFile.name}
//                     </p>
//                     <p className="text-xs text-[var(gray500)]">
//                       Size: {(selectedFile.size / 1024).toFixed(2)} KB
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}
//             {inputMode === "link" && (
//               <div className="link-field">
//                 <input
//                   type="text"
//                   id="link"
//                   placeholder="Enter a valid URL..."
//                   value={link}
//                   onChange={(e) => validateLink(e.target.value)}
//                   className={`w-full border p-2 rounded-md outline-none shadow-none ${
//                     linkError
//                       ? "border-red-500 focus:border-red-500"
//                       : "border-[var(gray-300)] focus:border-[var(primary)]"
//                   }`}
//                 />
//                 {linkError && (
//                   <p className="text-red-500 text-xs mt-1">{linkError}</p>
//                 )}
//               </div>
//             )}

//             {/* Prompt */}
//             <textarea
//               placeholder="Enter your prompt here..."
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               className="w-full h-28 border border-[var(gray-300)] p-2 rounded-md outline-none focus:border focus:border-[var(primary)]"
//             />

//             {/* Submit */}
//             <div className="flex items-center justify-end">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="text-[var(--white)] bg-[var(--blue-slate-500)] rounded-full py-1 px-4 flex items-center gap-1 disabled:opacity-60"
//               >
//                 {loading ? "Generating..." : "Generate Quiz"}{" "}
//                 <GiStarFormation />
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       {/* Quiz Question Response Modal */}
//       {/* {showModal && quizResponse && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-600/50">
//           <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] p-6 relative overflow-hidden shadow-lg">

//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold text-left"
//             >
//               &times;
//             </button>

//             <h3 className="text-2xl font-semibold mb-4">Generated Quiz</h3>

//             <div className="overflow-y-auto max-h-[calc(80vh-80px)] pr-2 scrollbar-hide space-y-4 text-left">
//               {quizResponse.quiz?.map((q, index) => (
//                 <div
//                   key={index}
//                   className="border p-4 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition"
//                 >
//                   <p className="font-medium text-gray-800">
//                     Q{index + 1}: {q.question || q.text}
//                   </p>

//                   {q.options && (
//                     <ul className="list-decimal list-inside mt-2 text-gray-700">
//                       {q.options.map((opt, i) => (
//                         <li
//                           key={i}
//                           className="hover:text-[var(--blue-slate-500)] transition"
//                         >
//                           {opt}
//                         </li>
//                       ))}
//                     </ul>
//                   )}

//                   {q.answer && (
//                     <p className="mt-2 text-green-600 font-medium">
//                       Answer: {q.answer}
//                     </p>
//                   )}

//                   {q.explanation && (
//                     <p className="mt-1 text-gray-500 text-sm">
//                       Explanation: {q.explanation}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )} */}

//       {/* Quiz Question save modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-600/50">
//           <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg">
//             {/* Close button */}
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
//             >
//               &times;
//             </button>

//             <h3 className="text-2xl font-semibold mb-4">
//               Quiz Question Created Successfully
//             </h3>

//             {/* User input values */}
//             <div className="space-y-3 text-left">
//               <p>
//                 <span className="font-medium">Number of Questions:</span>{" "}
//                 {numberOfQuestions}
//               </p>
//               <p>
//                 <span className="font-medium">Language:</span> {language}
//               </p>
//               <p>
//                 <span className="font-medium">Difficulty:</span> {difficulty}
//               </p>
//               <p>
//                 <span className="font-medium">Question Type:</span>{" "}
//                 {questionType}
//               </p>
//               {/* {inputMode === "text" && (
//                 <p>
//                   <span className="font-medium">Text Input:</span> {textInput}
//                 </p>
//               )} */}
//             </div>

//             {/* Save Quiz Button */}
//             <div className="flex justify-end mt-6">
//               <button
//                 className="bg-[var(--blue-slate-500)] text-white px-4 py-2 rounded-full transition"
//                 onClick={handleQuizQuestionSave}
//               >
//                 Save Quiz
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuestionMaker;
