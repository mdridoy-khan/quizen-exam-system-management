import { useEffect, useState } from "react";
import {
  FaEdit,
  FaExclamationCircle,
  FaMinus,
  FaPlus,
  FaQuestionCircle,
  FaSave,
  FaTrash,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../api/API";

const ManualQuestionMaker = () => {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const { announcementId } = useParams();
  const navigate = useNavigate();

  // auto clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!announcementId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await API.get(
          `/anc/single-announcement-details/${announcementId}/`
        );
        setAnnouncement(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [announcementId]);

  // Option handlers
  const addOption = () => {
    if (options.length < 4) setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Add or Update Question in Queue
  const handleAddToQueue = () => {
    // Validation
    if (!currentQuestion.trim()) {
      setMessage("Question field is required!");
      setMessageType("error");
      return;
    }

    if (options.length < 4 || options.some((opt) => !opt.trim())) {
      setMessage("Sorry, minimum 4 valid options required.");
      setMessageType("error");
      return;
    }

    if (!correctAnswer.trim()) {
      setMessage("Correct Answer field is required!");
      setMessageType("error");
      return;
    }

    // Unique options check
    const uniqueOptions = new Set(
      options.map((opt) => opt.trim().toLowerCase())
    );
    if (uniqueOptions.size !== options.length) {
      setMessage("All options must be unique!");
      setMessageType("error");
      return;
    }

    if (!options.includes(correctAnswer)) {
      setMessage("Correct Answer must match one of the options!");
      setMessageType("error");
      return;
    }

    // Queue limit check (but allow edit)
    if (
      !editingQuestionId &&
      questions.length >= announcement?.tutor_share_qes_number
    ) {
      setMessage(
        `You cannot add more than ${announcement?.tutor_share_qes_number} questions.`
      );
      setMessageType("error");
      return;
    }

    if (editingQuestionId) {
      // UPDATE
      const updatedQuestions = questions.map((q) =>
        q.id === editingQuestionId
          ? {
              ...q,
              question: currentQuestion,
              options: [...options],
              correctAnswer,
            }
          : q
      );
      setQuestions(updatedQuestions);
      setEditingQuestionId(null);
      setMessage("Question updated successfully!");
      setMessageType("success");
    } else {
      // ADD NEW
      const newQuestion = {
        id: Date.now().toString(),
        question: currentQuestion,
        options: [...options],
        correctAnswer,
      };
      setQuestions([...questions, newQuestion]);
      setMessage("Question added successfully!");
      setMessageType("success");
    }

    // reset input
    setCurrentQuestion("");
    setOptions([""]);
    setCorrectAnswer("");
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
    if (editingQuestionId === id) {
      setEditingQuestionId(null);
      setCurrentQuestion("");
      setOptions([""]);
      setCorrectAnswer("");
    }
  };

  const handleEdit = (question) => {
    setCurrentQuestion(question.question);
    setOptions([...question.options]);
    setCorrectAnswer(question.correctAnswer);
    setEditingQuestionId(question.id);
  };

  // Save & Share
  const handleSaveAndShare = async () => {
    if (!announcement) return;

    if (questions.length !== announcement.tutor_share_qes_number) {
      setMessage(
        `Please add all ${announcement.tutor_share_qes_number} questions before saving.`
      );
      setMessageType("error");
      return;
    }

    const payload = {
      quiz: questions.map((q, index) => ({
        question_no: index + 1,
        question: q.question,
        options: q.options,
        answer: q.correctAnswer,
        explanation: "",
        type: "mcq",
        subject_relevance: "",
      })),
    };

    try {
      const response = await API.post(
        `/qzz/tut/anc/${announcementId}/save-quiz/`,
        payload
      );

      setMessage(response.data.message || "Quiz saved successfully!");
      setMessageType("success");
      navigate("/tutor/share-questions");
    } catch (err) {
      console.error(err);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save quiz. Try again.";

      setMessage(backendMessage);
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header / Progress Section */}
        <div className="text-center bg-white rounded-xl p-4 sm:p-6 shadow border border-gray-100 space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {announcement?.announcement_name}
          </h2>
          <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-100 text-primary rounded-full font-medium text-sm sm:text-base">
            Subject: {announcement?.subject}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
            <span>Progress:</span>
            <div className="w-24 sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                style={{
                  width: `${
                    (questions.length / announcement?.tutor_share_qes_number) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <span>
              {questions.length} / {announcement?.tutor_share_qes_number}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Panel */}
          <div className="space-y-4">
            {/* Info Bar */}
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-3 sm:px-4 py-2 rounded-full flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm border border-amber-200 font-medium shadow-sm text-center sm:text-left">
              <FaExclamationCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>YOU ARE MAKING QUESTION FOR</span>
              <Link
                to={`/quiz-details/${announcement?.id}`}
                className="text-sm sm:text-base underline hover:text-amber-900 transition-colors"
              >
                {announcement?.announcement_name}
              </Link>
            </div>

            {/* Manual Question Box */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Manual Question Making
                </h2>
                <p className="text-purple-200 text-sm sm:text-base mt-1">
                  Create engaging questions for your quiz
                </p>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Unified Message */}
                {message && (
                  <div
                    className={`p-3 sm:p-4 rounded-lg text-xs sm:text-sm font-medium ${
                      messageType === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Question Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Question <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your question here"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
                  />
                </div>

                {/* Options Section */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Options <span className="text-red-500">*</span> (max 4
                    required)
                  </label>

                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap gap-2 items-center"
                    >
                      <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-purple-100 text-primary font-medium text-sm sm:text-base">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <input
                        type="text"
                        placeholder={`Enter option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 min-w-[150px] px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
                      />
                      {options.length > 1 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="p-2 sm:p-3 border-2 border-gray-200 rounded-lg hover:border-red-200 hover:text-red-500 transition-all flex items-center gap-1 text-xs sm:text-sm font-medium shadow-sm"
                        >
                          <FaMinus className="h-3 w-3 sm:h-4 sm:w-4" /> Remove
                        </button>
                      )}
                    </div>
                  ))}

                  {options.length < 4 && (
                    <button
                      onClick={addOption}
                      className="w-full py-2.5 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-gray-600"
                    >
                      <FaPlus className="h-4 w-4" /> Add Option
                    </button>
                  )}
                </div>

                {/* Correct Answer */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Correct Answer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the correct answer"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
                  />
                </div>

                <button
                  onClick={handleAddToQueue}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-sm sm:text-base"
                >
                  {editingQuestionId ? "Update Question" : "Add to Queue"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Question Queue List
                </h3>
                <p className="text-purple-200 text-sm sm:text-base mt-1">
                  Review and manage your questions
                </p>
              </div>

              <div className="p-4 sm:p-6 space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
                {questions.length === 0 ? (
                  <div className="text-center py-8 sm:py-10">
                    <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                      <FaQuestionCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">
                      No questions added yet.
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Start creating your first question!
                    </p>
                  </div>
                ) : (
                  questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border-2 border-gray-100 rounded-xl p-4 sm:p-5 space-y-3 relative group hover:border-purple-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 rounded-lg bg-purple-100 text-primary hover:bg-purple-200 transition-colors"
                          onClick={() => handleEdit(question)}
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center text-primary font-bold text-sm sm:text-base">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-gray-900 flex-1 pr-8 sm:pr-10 text-sm sm:text-base">
                          {question.question}
                        </h4>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2 ml-9 sm:ml-11">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center gap-2 text-xs sm:text-sm"
                          >
                            <div
                              className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center font-medium ${
                                option === question.correctAnswer
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}
                            </div>
                            <span
                              className={`${
                                option === question.correctAnswer
                                  ? "font-medium text-green-700"
                                  : "text-gray-600"
                              }`}
                            >
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="ml-9 sm:ml-11 text-xs sm:text-sm font-medium text-gray-900 flex items-center gap-2">
                        <span className="text-gray-500">Answer:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md">
                          {question.correctAnswer}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Save & Share */}
              <div className="p-4 sm:p-6 border-t border-gray-100">
                <button
                  onClick={handleSaveAndShare}
                  disabled={
                    questions.length !== announcement?.tutor_share_qes_number
                  }
                  className={`w-full text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                    questions.length === announcement?.tutor_share_qes_number
                      ? "bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  <FaSave className="h-5 w-5" />
                  Save & Share Quiz
                </button>
                {questions.length !== announcement?.tutor_share_qes_number && (
                  <p className="text-center text-gray-500 text-xs sm:text-sm mt-2">
                    Add{" "}
                    {announcement?.tutor_share_qes_number - questions.length}{" "}
                    more questions to enable saving
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualQuestionMaker;
