import { useEffect, useRef, useState } from "react";
import { AiOutlineEdit, AiOutlineFile, AiOutlineLink } from "react-icons/ai";
import { FaExclamationCircle, FaSpinner } from "react-icons/fa";
import { GiStarFormation } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { TbCategoryPlus, TbExclamationCircle } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/API";
import { formatDateTime } from "../../utils/FormateDateTime";

const AiQuestionMaker = () => {
  // Params
  const { roundId, annId, announcementId } = useParams();
  const navigate = useNavigate();

  // Core States
  const [selectedFile, setSelectedFile] = useState(null);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [inputMode, setInputMode] = useState("file");
  const [details, setDetails] = useState(null); // round or announcement details
  const [isRoundMode, setIsRoundMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Quiz Options
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [language, setLanguage] = useState("english");
  const [difficulty, setDifficulty] = useState("easy");
  const [questionType, setQuestionType] = useState("multiple");
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);

  // Subject Multi-select
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const categoryRef = useRef(null);

  // Input & Prompt
  const [textInput, setTextInput] = useState("");
  const [prompt, setPrompt] = useState("");

  // Result & Modal
  const [quizResponse, setQuizResponse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Notice
  const [showNotice, setShowNotice] = useState(true);
  const [noticeData, setNoticeData] = useState([]);
  const [loadingNoticeMessage, setLoadingNoticeMessage] = useState(false);

  // Fetch Details (Round or Announcement)
  useEffect(() => {
    const fetchDetails = async () => {
      if (!roundId && !announcementId) return;

      setLoading(true);
      try {
        let response;
        if (roundId && annId) {
          response = await API.get(
            `/anc/single-round-details-view/${roundId}/`
          );
          setIsRoundMode(true);
        } else if (announcementId) {
          response = await API.get(
            `/anc/single-announcement-details/${announcementId}/`
          );
          setIsRoundMode(false);
        }
        setDetails(response.data.data);
        if (response.data.data?.total_questions) {
          setNumberOfQuestions(response.data.data.total_questions);
        }
      } catch (err) {
        setError("Failed to fetch details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [roundId, annId, announcementId]);

  // Fetch Categories (Subjects)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const res = await API.get("/auth/category/");
        if (res.status === 200 && Array.isArray(res.data)) {
          setCategories(res.data);
          setFilteredCategories(res.data);
        }
      } catch (err) {
        toast.error("Failed to load subjects");
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Notice
  useEffect(() => {
    const anncId = annId || announcementId;
    if (!anncId) return;

    const getNotice = async () => {
      setLoadingNoticeMessage(true);
      try {
        const res = await API.get(
          `/anc/view-announcement-notice-anc/${anncId}/`
        );
        if (res.data.status) setNoticeData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingNoticeMessage(false);
      }
    };
    getNotice();
  }, [annId, announcementId]);

  // Category Select & Outside Click
  const handleCategorySelect = (cat) => {
    const name = cat.category_name;
    if (!selectedCategories.includes(name)) {
      setSelectedCategories([...selectedCategories, name]);
    }
    setCategoryInput("");
    setShowCategorySuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setShowCategorySuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    if (value === "") return setNumberOfQuestions("");
    const num = parseInt(value, 10);
    if (num >= 1) setNumberOfQuestions(num);
  };

  const validateLink = (value) => {
    setLink(value);
    const urlPattern =
      /^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/[\w-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
    setLinkError(value && !urlPattern.test(value) ? "Invalid URL" : "");
  };

  // Submit Form - Generate Quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMode === "link" && linkError)
      return toast.error("Fix the link first");

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

      const res = await API.post("/qzz/president-ai-json-response/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setQuizResponse(res.data);
      setQuestions(res.data.quiz || []);
      setShowModal(true);
    } catch (err) {
      setError("Failed to generate quiz. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save Quiz
  const handleQuizQuestionSave = async () => {
    if (selectedCategories.length === 0)
      return toast.error("Select at least one subject");

    const targetAnnId = annId || announcementId;
    if (!targetAnnId) return toast.error("Announcement ID missing");

    setIsSaving(true);
    try {
      const payload = {
        quiz_prompt: prompt,
        quiz_link: link || "",
        subjects: selectedCategories,
        marks_per_question: marksPerQuestion,
        negative_marks_per_question: negativeMarks,
        quiz: questions.map((q, index) => ({
          question_no: index + 1,
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation || "",
          type: "mcq",
        })),
      };

      const url = isRoundMode
        ? `/qzz/pre/anc/${targetAnnId}/round/${roundId}/save-quiz/`
        : `/qzz/pre/announcement/${targetAnnId}/save-quiz/`;

      await API.post(url, payload);
      toast.success("Quiz saved successfully!");
      setShowModal(false);
      navigate("/president/events");
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to save quiz";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen mt-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <span>Quiz Maker That's</span>
            <span className="text-primary">Delightfully Easy</span>
            <GiStarFormation className="text-yellow-500 text-6xl animate-spin-slow" />
          </h2>

          {/* Notice */}
          {showNotice && noticeData.length > 0 && (
            <div className="bg-orange-50 p-5 rounded-xl mb-6 border border-orange-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {loadingNoticeMessage ? (
                    <p>Loading notices...</p>
                  ) : (
                    noticeData.map((item) => (
                      <div key={item.id} className="text-left">
                        <p className="font-semibold flex items-center gap-2">
                          <TbExclamationCircle className="text-orange-600" />
                          Notice:
                        </p>
                        <p className="text-gray-800 mt-1">{item.notice_text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateTime(item.updated_at)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <button onClick={() => setShowNotice(false)}>
                  <RxCross2 size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Announcement Info */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 text-left">
            <p className="bg-blue-50 text-primary px-4 py-3 rounded-full inline-flex items-center gap-2 text-sm font-medium">
              <FaExclamationCircle />
              YOU ARE MAKING QUESTIONS FOR:
              <span className="font-bold">
                {details ? (
                  <Link
                    to={`/announcement-details/${
                      details.announcement || details.id
                    }`}
                    className="underline hover:text-secondary"
                    target="_blank"
                  >
                    {details.announcement_name || details.title}
                  </Link>
                ) : (
                  "QUIZ COMPETITION"
                )}
              </span>
            </p>
            {(details?.topic_subject || details?.subject) && (
              <p className="mt-3">
                <strong>Subject:</strong>{" "}
                {details.topic_subject || details.subject}
              </p>
            )}
          </div>
        </div>

        {/* Error / Loading */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
            <FaExclamationCircle />
            {error}
          </div>
        )}
        {loading && (
          <div className="bg-blue-50 border border-blue-300 text-primary p-4 rounded-lg mb-6 flex items-center gap-3">
            <FaSpinner className="animate-spin" />
            Generating quiz...
          </div>
        )}

        {/* Input Mode Switcher */}
        <div className="bg-white rounded-xl shadow-md p-3 mb-8">
          <div className="grid grid-cols-3 gap-3">
            {["file", "text", "link"].map((mode) => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className={`py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  inputMode === mode
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {mode === "file" && <AiOutlineFile size={22} />}
                {mode === "text" && <AiOutlineEdit size={22} />}
                {mode === "link" && <AiOutlineLink size={22} />}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-8"
        >
          {/* Quiz Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                value={numberOfQuestions}
                onChange={handleNumberChange}
                min="1"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            {/* Subject Multi-select */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={categoryRef}>
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCategoryInput(val);
                    const filtered = val
                      ? categories.filter((c) =>
                          c.category_name
                            .toLowerCase()
                            .includes(val.toLowerCase())
                        )
                      : categories;
                    setFilteredCategories(filtered);
                    setShowCategorySuggestions(true);
                  }}
                  onFocus={() => setShowCategorySuggestions(true)}
                  placeholder="Search subjects..."
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />

                {showCategorySuggestions && filteredCategories.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                    {filteredCategories.map((cat) => (
                      <li
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat)}
                        className={`px-4 py-3 hover:bg-primary hover:text-white cursor-pointer flex items-center gap-2 ${
                          selectedCategories.includes(cat.category_name)
                            ? "bg-primary text-white"
                            : ""
                        }`}
                      >
                        <TbCategoryPlus />
                        {cat.category_name}
                      </li>
                    ))}
                  </ul>
                )}

                {selectedCategories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedCategories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== cat)
                            )
                          }
                          className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Marks */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Marks Per Question
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={marksPerQuestion}
                onChange={(e) => setMarksPerQuestion(Number(e.target.value))}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            {/* Negative Marks */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Negative Marks (Optional)
              </label>
              <input
                type="number"
                step="0.25"
                min="0"
                placeholder="e.g. 0.25"
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(Number(e.target.value))}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            {/* Other Selects */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="english">English</option>
                <option value="bangla">Bangla</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question Type
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="multiple">Multiple Choice</option>
              </select>
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-8">
            {/* Text / File / Link Inputs */}
            {inputMode === "text" && (
              <textarea
                placeholder="Paste your text content here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-64 p-5 border-2 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
            )}

            {inputMode === "file" && (
              <div className="border-2 border-dashed border-gray-400 rounded-xl p-12 text-center hover:border-primary cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <AiOutlineFile className="mx-auto text-6xl text-primary mb-4" />
                  <p className="text-lg font-medium">Click to upload file</p>
                  <p className="text-sm text-gray-500">PDF, DOC, TXT, Image</p>
                </label>
                {selectedFile && (
                  <div className="mt-4 bg-gray-100 p-3 rounded-lg inline-block">
                    <p className="font-medium">{selectedFile.name}</p>
                  </div>
                )}
              </div>
            )}

            {inputMode === "link" && (
              <div>
                <input
                  type="url"
                  placeholder="https://example.com/document"
                  value={link}
                  onChange={(e) => validateLink(e.target.value)}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary outline-none ${
                    linkError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {linkError && (
                  <p className="text-red-500 text-sm mt-2">{linkError}</p>
                )}
              </div>
            )}

            {/* Prompt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Prompt (Optional)
              </label>
              <textarea
                placeholder="e.g. Focus on advanced topics, include diagrams explanation..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 p-5 border-2 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            {/* Submit */}
            <div className="text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
              >
                {loading ? "Generating..." : "Generate Quiz"}
                <GiStarFormation className="text-2xl" />
              </button>
            </div>
          </div>
        </form>

        {/* Save Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-bold">Quiz Ready!</h3>
                  <button onClick={() => setShowModal(false)}>
                    <RxCross2 size={28} />
                  </button>
                </div>
                <p className="mt-2 text-lg opacity-90">
                  Review and save your AI-generated quiz
                </p>
              </div>

              <div className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-6 text-lg">
                  <div>
                    <strong>Questions:</strong> {numberOfQuestions}
                  </div>
                  <div>
                    <strong>Language:</strong> {language}
                  </div>
                  <div>
                    <strong>Subjects:</strong> {selectedCategories.join(", ")}
                  </div>
                  <div>
                    <strong>Marks/Q:</strong> {marksPerQuestion}
                  </div>
                  <div>
                    <strong>Negative:</strong> {negativeMarks || 0}
                  </div>
                  <div>
                    <strong>Type:</strong> MCQ
                  </div>
                </div>

                {prompt && (
                  <div>
                    <strong>Prompt:</strong>
                    <p className="bg-gray-100 p-4 rounded-lg mt-2">{prompt}</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-8 py-6 flex justify-end">
                <button
                  onClick={handleQuizQuestionSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:shadow-xl transition-shadow disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Quiz"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiQuestionMaker;

// import { useEffect, useState } from "react";
// import { AiOutlineEdit, AiOutlineFile, AiOutlineLink } from "react-icons/ai";
// import { FaExclamationCircle, FaSpinner } from "react-icons/fa";
// import { GiStarFormation } from "react-icons/gi";
// import { RxCross2 } from "react-icons/rx";
// import { TbExclamationCircle } from "react-icons/tb";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import API from "../../api/API";
// import { formatDateTime } from "../../utils/FormateDateTime";

// const AiQuestionMaker = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [link, setLink] = useState("");
//   const [linkError, setLinkError] = useState("");
//   const [inputMode, setInputMode] = useState("file");
//   const [rounds, setRounds] = useState(null);
//   const [announcement, setAnnouncement] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingNoticeMessage, setLoadingNoticeMessage] = useState(false);
//   const [error, setError] = useState(null);
//   const [numberOfQuestions, setNumberOfQuestions] = useState(1);
//   const [language, setLanguage] = useState("english");
//   const [difficulty, setDifficulty] = useState("easy");
//   const [questionType, setQuestionType] = useState("multiple");
//   const [textInput, setTextInput] = useState("");
//   const [prompt, setPrompt] = useState("");
//   const [quizResponse, setQuizResponse] = useState(null);
//   const [showNotice, setShowNotice] = useState(true);
//   const [noticeData, setNoticeData] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [saveError, setSaveError] = useState("");
//   const { roundId, annId } = useParams();
//   const { announcementId } = useParams();
//   const [isSaving, setIsSaving] = useState(false);
//   //   const [notice, setNotice] = useState(true);
//   // console.log("Received roundId:", roundId, "announcementId:", annId);

//   const navigate = useNavigate();

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
//         // console.log("Details:", response.data.data);
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

//       setIsSaving(true);

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

//       // console.log("Quiz saved successfully:", response.data);
//       setSuccessMessage("Quiz saved successfully!");
//       setShowModal(false);
//       setSaveError("");
//       toast.success("Quiz created and saved successfully!");
//     } catch (err) {
//       console.error("Error saving quiz:", err);
//       setSaveError("Failed to save quiz. Please try again.");
//       const errorMessage = err?.response?.data?.error;
//       setSuccessMessage("");
//       toast.error(errorMessage || "Failed to save quiz. Please try again.");
//     } finally {
//       setIsSaving(false);
//       navigate("/president/events");
//     }
//   }
//   // async function handleQuizQuestionSave() {
//   //   try {
//   //     if (!roundId || !annId) {
//   //       setSaveError("Round ID or Announcement ID missing");
//   //       return;
//   //     }
//   //     const payload = {
//   //       quiz_prompt: prompt,
//   //       quiz_link: link,
//   //       quiz: questions.map((q, index) => ({
//   //         question_no: index + 1,
//   //         question: q.question,
//   //         options: q.options,
//   //         answer: q.answer,
//   //         explanation: q.explanation || "",
//   //         type: "mcq",
//   //       })),
//   //     };
//   //     const response = await API.post(
//   //       `/qzz/pre/anc/${annId}/round/${roundId}/save-quiz/`,
//   //       payload
//   //     );
//   //     console.log("Quiz saved successfully:", response.data);
//   //     setSuccessMessage("Quiz saved successfully!");
//   //     setShowModal(false);
//   //     setSaveError("");
//   //     navigate("/president/dashboard");
//   //   } catch (err) {
//   //     console.error("Error saving quiz:", err);
//   //     setSaveError("Failed to save quiz. Please try again.");
//   //     setSuccessMessage("");
//   //   }
//   // }

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
//     if (announcement?.total_questions) {
//       setNumberOfQuestions(announcement.total_questions);
//     }
//   }, [announcement]);

//   // Handlers
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setSelectedFile(file);
//   };

//   const handleNumberChange = (e) => {
//     const value = e.target.value;
//     if (value === "") {
//       setNumberOfQuestions("");
//       return;
//     }
//     const number = parseInt(value, 10);
//     if (number >= 1) {
//       setNumberOfQuestions(number);
//     }
//   };

//   // valid link check
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

//   // handle form submit
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
//         "/qzz/president-ai-json-response/",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       // console.log("Quiz Response:", response.data);
//       setQuizResponse(response.data);
//       setShowModal(true);
//       if (response.data?.quiz) {
//         setQuestions(response.data.quiz);
//       }
//     } catch (err) {
//       console.error("Submit Error:", err);
//       setError("Failed to generate quiz. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // fetch notice data
//   useEffect(() => {
//     const getNotice = async () => {
//       setLoadingNoticeMessage(true);
//       try {
//         const response = await API.get(
//           `/anc/view-announcement-notice-anc/${annId}/`
//         );
//         // console.log("get notice response:", response.data);

//         if (response.data.status) {
//           setNoticeData(response.data.data);
//         }
//       } catch (err) {
//         console.error("Error fetching notice:", err);
//       } finally {
//         setLoadingNoticeMessage(false);
//       }
//     };

//     if (annId) getNotice();
//   }, [annId]);

//   // hanle notice popup
//   const handleNotice = () => {
//     setShowNotice(false);
//   };

//   return (
//     <div className="min-h-screen mt-10">
//       {/* bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4 sm:px-6 */}
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex flex-col sm:flex-row items-center justify-center flex-wrap gap-2 mb-4">
//             <span>Quiz Maker That's</span>
//             <span className="text-primary">Delightfully Easy</span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 128 128"
//               className="w-16 h-16 xl:w-[100px] xl:h-[100px] animate-softBounce"
//             >
//               <path
//                 fill="#a1887f"
//                 d="M64 47.54s7.72.19 18.71-3.94s15.6-9.79 23.1-12.25s14.55-2.31 18.07 5.69s.25 17.17-1.22 21.18s-9.2 11.73-18.4 15.82c0 0-20.98 5.42-40.25 6.22V47.54zm0 0s-7.72.19-18.71-3.94s-15.7-9.8-23.2-12.26s-14.45-2.3-17.97 5.7s-.25 17.16 1.22 21.17s9.2 11.73 18.4 15.82c0 0 20.98 5.42 40.25 6.22V47.54z"
//               />
//               <path
//                 fill="#8d6e63"
//                 d="M30.85 36.16s-11.19-5.3-14.94-1.34c-2.23 2.36-1.87 7.49 5.49 13.63zm66.47 0s11.19-5.3 14.94-1.34c2.23 2.36 1.87 7.49-5.49 13.63z"
//               />
//               <path
//                 fill="#fcc21b"
//                 d="M64 19.77c-60.16 0-61.59 67.44-61.59 80.79S29.99 124.73 64 124.73c34.02 0 61.59-10.82 61.59-24.17S124.17 19.77 64 19.77"
//               />
//               <path
//                 fill="#bcaaa4"
//                 d="M64 6.57c-4.11 0-4.52-3.3-8.94-3.3c-5.4 0-21.43 15.61-22.73 18.12c-1.04 2-3.89 8.94-4.25 10.59c-.38 1.74-2.85 1.47-4.01.68c0 0 9.5 7.6 19.41 11.14C53.39 47.33 64 47.68 64 47.68zm0 0c4.11 0 4.52-3.3 8.94-3.3c5.4 0 21.36 15.65 22.73 18.12c1.41 2.54 4.15 8.94 4.58 10.77c.41 1.74.51 2.29 1.68 1.49c0 0-7.5 6.6-17.41 10.14S64 47.68 64 47.68z"
//               />
//               <path
//                 fill="#ed6c30"
//                 d="M89.47 88.41c-1.06-2.07-3.7-3.88-7.25-3.79c-3.73.1-9.11 1.55-12.68 2.06c-1.82.25-3.7.37-5.5.42c-1.81-.05-3.69-.16-5.52-.42c-3.57-.51-8.95-1.96-12.68-2.06c-3.55-.09-6.19 1.72-7.25 3.79c-2.68 5.14 2.96 12.12 7.73 15.32c5.03 3.38 9.63 5.06 14.79 5.74c1.22.16 4.58.2 5.94-.02c5.52-.9 9.5-2.33 14.54-5.72c4.76-3.2 10.56-10.18 7.88-15.32"
//               />
//               <path
//                 fill="#bcaaa4"
//                 d="M33.16 29.53s12.05-2.55 30.86-3.44L64 47.68s-18.71.29-37.14-12.88c0 0 5.22 1.76 6.3-5.27"
//               />
//               <path
//                 fill="#bcaaa4"
//                 d="M94.84 29.53s-12.5-2.34-30.83-3.44L64 47.68s18.48.44 36.91-12.74c0 .01-4.97 1.49-6.07-5.41"
//               />
//               <path
//                 fill="#bcaaa4"
//                 d="M126.4 34.65c-2.12-6.58-8.79-10.91-16.96-8.79c-8.18 2.12-19.69 13.8-26.66 16.83S68.24 45.64 64 45.64v1.59s7.62.58 19.32-3.96s17.41-9.64 26.75-11.23c9.35-1.59 13.4 3.37 14.28 6.18c1.25 3.98 1.56 15.17-4.26 22.98c-.11.15-.21.28-.31.41l.49 1.78c.61-.72 1.18-1.51 1.92-2.57c6.96-10 5.35-22.65 4.21-26.17M8.22 61.6c-.1-.13-.21-.26-.32-.4c-6.06-7.62-5.51-19-4.26-22.98c.88-2.81 4.77-7.94 14.12-6.35s15.38 7.02 27.08 11.56S64 47.23 64 47.23v-1.59c-4.24 0-11.81.08-18.78-2.95s-18.48-14.7-26.66-16.83c-8.18-2.12-14.84 2.2-16.96 8.79c-1.14 3.52-2.74 16.17 4.2 26.18c.71 1.02 1.33 1.84 1.86 2.49z"
//               />
//               <path
//                 fill="#a1887f"
//                 d="M52.02 7.16c2.13-.93 5.51 1.1 5.69 3.96s-7.08 9.9-18.53 12.55S48.37 8.75 52.02 7.16m23.84 0c-2.13-.93-5.51 1.1-5.69 3.96s7.08 9.9 18.53 12.55S79.52 8.75 75.86 7.16"
//                 opacity="0.5"
//               />
//               <path
//                 fill="#bcaaa4"
//                 d="M41.6 40.81s10.71 6.14 22.4 6.14s20.62-5.15 20.62-5.15S64 48.22 41.6 40.81"
//               />
//               <path
//                 fill="#a1887f"
//                 d="M33.62 35.49s14.2-3.38 31.44-2.98s29.17 2.98 29.17 2.98l3.63-3.17S84.22 27.2 64.77 27.2s-34.63 5.14-34.63 5.14z"
//               />
//               <path
//                 fill="#8d6e63"
//                 d="M64.49 28.45c-.73 0-6.29 1.02-6.29 1.64s5.54 1.46 6.29 1.46s6.17-.77 6.17-1.3s-5.72-1.8-6.17-1.8m16.38.99c-.64-.06-5.58.37-5.63.91s4.72 1.74 5.37 1.8s5.45-.16 5.5-.62s-4.84-2.05-5.24-2.09m-33.59 0c.64-.06 5.58.37 5.63.91s-4.72 1.74-5.37 1.8s-5.45-.16-5.5-.62c-.04-.46 4.84-2.05 5.24-2.09"
//               />
//               <path
//                 fill="#2f2f2f"
//                 d="M42.21 72.65c-4.49.04-8.17-4.27-8.22-9.62c-.05-5.37 3.55-9.75 8.04-9.79c4.48-.04 8.17 4.27 8.22 9.64c.05 5.36-3.55 9.73-8.04 9.77m44.11 0c4.48-.01 8.11-4.36 8.1-9.71c-.01-5.37-3.66-9.7-8.14-9.69c-4.49.01-8.13 4.36-8.12 9.73c.01 5.36 3.67 9.69 8.16 9.67"
//               />
//             </svg>
//           </h2>

//           {/* Notice message */}
//           {showNotice && (
//             <div className="bg-orange-50 p-4 rounded-xl mb-4">
//               <div className="text-sm font-medium">
//                 <div className="space-y-3">
//                   {loadingNoticeMessage ? (
//                     // Loading state
//                     <div className="flex items-center justify-center py-6">
//                       <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
//                       <span className="ml-2 text-gray-600 font-medium">
//                         Loading notices...
//                       </span>
//                     </div>
//                   ) : noticeData.length > 0 ? (
//                     // Data found
//                     noticeData.map((item) => (
//                       <div key={item.id}>
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-base font-medium mb-1 flex items-center gap-2">
//                             <TbExclamationCircle
//                               size={24}
//                               style={{ color: "primary" }}
//                             />
//                             Notice:
//                           </span>
//                           <button onClick={handleNotice}>
//                             <RxCross2 size={20} />
//                           </button>
//                         </div>
//                         <div className="text-left">
//                           <p className="text-gray-800 font-medium">
//                             {item.notice_text}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             Last Update: {formatDateTime(item.updated_at)}
//                           </p>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     // No data
//                     <p className="text-gray-500 text-center py-4">
//                       No announcement notices found.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Announcement info */}
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8 text-left">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
//               <div className="text-sm">
//                 <div className="bg-blue50 text-primary px-3 py-3 md:py-1 rounded-full flex flex-col md:flex-row items-center gap-2 text-sm font-medium mb-2 sm:mb-0">
//                   <FaExclamationCircle className="h-4 w-4" />
//                   YOU ARE MAKING QUESTIONS FOR
//                   {rounds?.announcement ? (
//                     <Link
//                       to={`/announcement-details/${rounds.announcement}`}
//                       className="text-primary hover:text-primary font-medium underline"
//                       target="_blank"
//                     >
//                       {rounds.announcement_name}
//                     </Link>
//                   ) : announcement?.id ? (
//                     <Link
//                       to={`/announcement-details/${announcement.id}`}
//                       className="text-primary hover:text-primary font-medium underline"
//                       target="_blank"
//                     >
//                       {announcement.announcement_name}
//                     </Link>
//                   ) : (
//                     <span className="font-medium">“QUIZ COMPETITION”</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {(rounds?.topic_subject || announcement?.subject) && (
//               <div className="flex items-center">
//                 <span className="text-gray500 mr-2">Subject:</span>
//                 <span className="font-medium text-gray800">
//                   {rounds?.topic_subject || announcement?.subject}
//                 </span>
//               </div>
//             )}

//             {rounds?.total_questions && (
//               <div className="flex items-center">
//                 <span className="text-gray500 mr-2">Required Questions:</span>
//                 <span className="font-medium text-gray800">
//                   {rounds?.total_questions}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Error & Loading */}
//         {error && (
//           <div className="bg-red50 border-l-4 border-red500 text-red700 p-4 rounded-lg mb-6 flex items-center">
//             <FaExclamationCircle className="h-5 w-5 mr-2" />
//             <span>{error}</span>
//           </div>
//         )}

//         {loading && (
//           <div className="bg-blue50 border-l-4 border-primary text-primary p-4 rounded-lg mb-6 flex items-center">
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-3"></div>
//             <span>Loading...</span>
//           </div>
//         )}

//         {/* Input mode switcher */}
//         <div className="bg-white rounded-xl shadow-md p-2 mb-8">
//           <div className="flex flex-col sm:flex-row">
//             {[
//               {
//                 id: "file",
//                 label: "By File",
//                 icon: <AiOutlineFile size={20} />,
//               },
//               {
//                 id: "text",
//                 label: "By Text",
//                 icon: <AiOutlineEdit size={20} />,
//               },
//               {
//                 id: "link",
//                 label: "By Link",
//                 icon: <AiOutlineLink size={20} />,
//               },
//             ].map((mode) => (
//               <button
//                 key={mode.id}
//                 type="button"
//                 onClick={() => setInputMode(mode.id)}
//                 className={`flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-200 flex-1 m-1 ${
//                   inputMode === mode.id
//                     ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
//                     : "text-gray600 hover:bg-gray100"
//                 }`}
//               >
//                 <span className="mr-2">{mode.icon}</span>
//                 {mode.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Form */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Quiz Options */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray700 mb-1">
//                   Number of Questions
//                 </label>
//                 <input
//                   type="number"
//                   value={numberOfQuestions}
//                   min={1}
//                   onChange={handleNumberChange}
//                   disabled={!!announcement?.tutor_share_qes_number}
//                   className="w-full px-3 py-2 border border-gray300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition outline-none shadow-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray700 mb-1">
//                   Language
//                 </label>
//                 <select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition outline-none shadow-none"
//                 >
//                   <option value="english">English</option>
//                   <option value="bangla">Bangla</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray700 mb-1">
//                   Difficulty
//                 </label>
//                 <select
//                   value={difficulty}
//                   onChange={(e) => setDifficulty(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition outline-none shadow-none"
//                 >
//                   <option value="easy">Easy</option>
//                   <option value="medium">Medium</option>
//                   <option value="hard">Hard</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray700 mb-1">
//                   Question Type
//                 </label>
//                 <select
//                   value={questionType}
//                   onChange={(e) => setQuestionType(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition outline-none shadow-none"
//                 >
//                   <option value="multiple">Multiple Choice</option>
//                 </select>
//               </div>
//             </div>

//             {/* Messages */}
//             {saveError && (
//               <div className="bg-red50 border-l-4 border-red500 text-red700 p-4 rounded-lg flex items-center">
//                 <FaExclamationCircle className="h-5 w-5 mr-2" />
//                 <span>{saveError}</span>
//               </div>
//             )}

//             {successMessage && (
//               <div className="bg-green50 border-l-4 border-green500 text-green700 p-4 rounded-lg flex items-center">
//                 <svg
//                   className="h-5 w-5 mr-2"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//                 <span>{successMessage}</span>
//               </div>
//             )}

//             {/* Input area */}
//             <div className="space-y-6">
//               {inputMode === "text" && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray700 mb-1">
//                     Enter your text
//                   </label>
//                   <textarea
//                     className="w-full h-48 px-3 py-2 border border-gray300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition outline-none shadow-none"
//                     placeholder="Paste your text here..."
//                     value={textInput}
//                     onChange={(e) => setTextInput(e.target.value)}
//                   />
//                 </div>
//               )}

//               {inputMode === "file" && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray700 mb-1">
//                     Upload a file
//                   </label>
//                   <div className="border-2 border-dashed border-gray300 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer relative">
//                     <div className="flex flex-col items-center justify-center">
//                       <svg
//                         className="h-12 w-12 text-primary mb-3"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                         />
//                       </svg>
//                       <p className="text-sm font-medium text-gray700">
//                         Click to upload or drag and drop
//                       </p>
//                       <p className="text-xs text-gray500 mt-1">
//                         PDF, PPTX, DOC, DOCX, TXT, PNG, JPG
//                       </p>
//                     </div>
//                     <input
//                       type="file"
//                       onChange={handleFileChange}
//                       accept=".pdf,.pptx,.doc,.docx,.txt,.png,.jpg,.jpeg"
//                       className="hidden"
//                       id="file-upload"
//                     />
//                     <label
//                       htmlFor="file-upload"
//                       className="absolute inset-0 cursor-pointer"
//                     ></label>
//                   </div>

//                   {selectedFile && (
//                     <div className="mt-3 bg-gray50 p-3 rounded-lg flex items-center">
//                       <svg
//                         className="h-5 w-5 text-gray500 mr-2"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                         />
//                       </svg>
//                       <div>
//                         <p className="text-sm font-medium">
//                           {selectedFile.name}
//                         </p>
//                         <p className="text-xs text-gray500">
//                           Size: {(selectedFile.size / 1024).toFixed(2)} KB
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {inputMode === "link" && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray700 mb-1">
//                     Enter a URL
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="Enter a valid URL..."
//                       value={link}
//                       onChange={(e) => validateLink(e.target.value)}
//                       className={`w-full px-3 py-2 border rounded-lg outline-none shadow-none focus:ring-1 focus:ring-primary focus:border-primary transition pl-10 ${
//                         linkError ? "border-red500" : "border-gray300"
//                       }`}
//                     />
//                     <svg
//                       className="absolute left-3 top-3 h-4 w-4 text-gray400"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
//                       />
//                     </svg>
//                     {linkError && (
//                       <p className="text-red500 text-xs mt-1">{linkError}</p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Prompt */}
//               <div>
//                 <label className="block text-sm font-medium text-gray700 mb-1">
//                   Quiz Prompt (Optional)
//                 </label>
//                 <textarea
//                   placeholder="Enter your prompt here..."
//                   value={prompt}
//                   onChange={(e) => setPrompt(e.target.value)}
//                   className="w-full h-32 px-3 py-2 border border-gray300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition outline-none shadow-none"
//                 />
//               </div>

//               {/* Submit */}
//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70"
//                 >
//                   {loading ? "Generating..." : "Generate Quiz"}
//                   <GiStarFormation className="ml-2" />
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Quiz Question save modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-2xl font-bold">
//                   Quiz Created Successfully
//                 </h3>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-white hover:text-gray200 transition"
//                 >
//                   <RxCross2 size={24} />
//                 </button>
//               </div>
//               <p className="mt-2 opacity-90">
//                 Your AI-generated quiz is ready to be saved
//               </p>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center py-3 border-b border-gray100">
//                   <span className="text-gray600">Number of Questions</span>
//                   <span className="font-medium">{numberOfQuestions}</span>
//                 </div>

//                 <div className="flex justify-between items-center py-3 border-b border-gray100">
//                   <span className="text-gray600">Language</span>
//                   <span className="font-medium capitalize">{language}</span>
//                 </div>

//                 <div className="flex justify-between items-center py-3 border-b border-gray100">
//                   <span className="text-gray600">Difficulty</span>
//                   <span className="font-medium capitalize">{difficulty}</span>
//                 </div>

//                 <div className="flex justify-between items-center py-3 border-b border-gray100">
//                   <span className="text-gray600">Question Type</span>
//                   <span className="font-medium capitalize">{questionType}</span>
//                 </div>

//                 {prompt && (
//                   <div className="py-3">
//                     <p className="text-gray600 mb-2">Prompt</p>
//                     <div className="bg-gray50 p-4 rounded-lg">
//                       <p className="text-gray800">{prompt}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="bg-gray50 px-6 py-4 flex justify-end">
//               <button
//                 className={`flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-lg font-medium shadow-md transition-all duration-200
//       ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}`}
//                 onClick={handleQuizQuestionSave}
//                 disabled={isSaving}
//               >
//                 {isSaving ? (
//                   <>
//                     <FaSpinner className="animate-spin h-5 w-5 mr-2" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <svg
//                       className="h-5 w-5 mr-2"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                     Save Quiz
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AiQuestionMaker;
