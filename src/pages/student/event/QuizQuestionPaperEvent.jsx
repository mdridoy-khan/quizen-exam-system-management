import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../../api/API";
import QuizResultCard from "../roundAnnouncement/QuizResultCard";

const QuizQuestionPaperEvent = () => {
  const [quizData, setQuizData] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [completedPages, setCompletedPages] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTimeLeft, setInitialTimeLeft] = useState(0); // Track initial remaining time
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [violation, setViolation] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { round, quizId, set } = useParams();
  const questionsPerPage = 2;

  /** ------------------ FETCH QUESTIONS ------------------ **/
  const fetchQuestions = async (pageIndex = 0) => {
    try {
      setLoading(true);
      setApiError("");
      const offset = pageIndex * questionsPerPage;
      const url = `/qzz/view-event-question-set/anc/${quizId}/round/${round}/quiz/${set}/?limit=${questionsPerPage}&offset=${offset}`;

      const res = await API.get(url);
      setQuizData(res?.data);
      setCurrentPageIndex(pageIndex);
      setAllQuestions((prev) => {
        const newQs = res?.data?.results?.questions || [];
        const merged = [...prev];
        newQs.forEach((q) => {
          if (!merged.find((item) => item.question_no === q.question_no))
            merged.push(q);
        });
        return merged;
      });

      if (pageIndex === 0) {
        const fullDurationSec = (res?.data?.results?.duration || 0) * 60;
        setTotalDurationSeconds(fullDurationSec);

        let remainingSec = fullDurationSec;
        const quizStartDateStr = res?.data?.results?.quiz_start_date;
        const quizEndDateStr = res?.data?.results?.quiz_end_date;
        const serverTimeStr = res?.data?.server_time;

        if (quizEndDateStr) {
          const quizEndDate = new Date(quizEndDateStr);
          const currentTime = serverTimeStr
            ? new Date(serverTimeStr)
            : new Date();
          remainingSec = Math.max(
            0,
            Math.floor((quizEndDate - currentTime) / 1000)
          );

          console.log(
            "Quiz Start:",
            quizStartDateStr,
            "End:",
            quizEndDateStr,
            "Current:",
            currentTime,
            "Remaining (sec):",
            remainingSec
          );
        } else {
          console.warn(
            "No quiz_end_date in API response, using full duration:",
            fullDurationSec
          );
        }

        if (remainingSec <= 0) {
          setApiError("Quiz has expired. You cannot start now.");
          setHasStarted(false);
          return;
        }

        setTimeLeft(remainingSec);
        setInitialTimeLeft(remainingSec);
      }
      setHasStarted(true);
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load questions."
      );
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(0);
  }, [quizId, round]);

  /** ------------------ BROWSER PROTECTIONS ------------------ **/
  useEffect(() => {
    if (!hasStarted) return;

    window.history.pushState(null, "", window.location.href);

    const showViolation = (msg) => {
      setViolation(msg);
      setShowModal(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden")
        showViolation("switching tabs or minimizing browser");
    };
    const handlePopState = () => showViolation("using browser back button");

    const handleBeforeUnload = (e) => {
      if (!showModal) {
        e.preventDefault();
        showViolation("reload or close the page");
        return (e.returnValue = "");
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "PrintScreen" || e.keyCode === 44)
        showViolation("taking screenshot");
    };

    const handlePaste = (e) => {
      for (let item of e.clipboardData.items) {
        if (item.type.includes("image")) showViolation("pasting screenshot");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("paste", handlePaste);
    };
  }, [hasStarted, showModal]);

  /** ------------------ TIMER ------------------ **/
  // useEffect(() => {
  //   if (!hasStarted || timeLeft <= 0) return;
  //   const interval = setInterval(() => {
  //     setTimeLeft((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(interval);
  //         setViolation("time expiration");
  //         setShowModal(true);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [timeLeft, hasStarted]);

  /** ------------------ TIMER ------------------ **/
  useEffect(() => {
    if (!hasStarted || timeLeft <= 0) return;
    let hasAutoSubmitted = false;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 15 && !hasAutoSubmitted) {
          hasAutoSubmitted = true;
          console.log("Auto submitting at 20 seconds to avoid server timeout");
          handleSubmit(false);
          return 0;
        }

        if (prev <= 1) {
          clearInterval(interval);
          if (!hasAutoSubmitted) {
            setViolation("time expiration");
            setShowModal(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, hasStarted]);

  /** ------------------ ANSWER HANDLING ------------------ **/
  const handleAnswerChange = (question_no, answerIndex) => {
    setSelectedAnswers((prev) => {
      const updated = { ...prev, [question_no]: answerIndex };
      if (
        quizData?.results?.questions.every(
          (q) => updated[q.question_no] !== undefined
        )
      ) {
        setCompletedPages((pages) => ({ ...pages, [currentPageIndex]: true }));
      }
      return updated;
    });
  };

  /** ------------------ PAGE STATUS ------------------ **/
  const getPageStatus = (pageIndex) => {
    const offset = pageIndex * questionsPerPage;
    const pageQuestions = allQuestions.slice(offset, offset + questionsPerPage);
    if (pageQuestions.length === 0) return "default";
    const answered = pageQuestions.filter(
      (q) => selectedAnswers[q.question_no] !== undefined
    ).length;
    if (answered === pageQuestions.length) return "completed";
    if (answered > 0) return "partial";
    return "default";
  };

  /** ------------------ PAGINATION ------------------ **/
  const totalPages = quizData
    ? Math.ceil(quizData.count / questionsPerPage)
    : 0;
  const handleNext = () => {
    const nextPageIndex = currentPageIndex + 1;
    if (
      quizData &&
      nextPageIndex < Math.ceil(quizData.count / questionsPerPage)
    ) {
      fetchQuestions(nextPageIndex);
    } else {
      handleSubmit();
    }
  };
  const handlePrevious = () => {
    const prevPageIndex = currentPageIndex - 1;
    if (prevPageIndex >= 0) fetchQuestions(prevPageIndex);
  };

  /** ------------------ SUBMISSION ------------------ **/
  // const handleSubmit = async (isViolation = false) => {
  //   if (window.isSubmitting) return;
  //   window.isSubmitting = true;

  //   try {
  //     setLoading(true);

  //     const spentTime = Math.max(1, initialTimeLeft - timeLeft);
  //     const completed_time = formatTimeHHMMSS(spentTime);

  //     const answers = {};
  //     allQuestions.forEach((q) => {
  //       const idx = selectedAnswers[q.question_no];
  //       if (idx !== undefined) answers[q.question_no] = q.options[idx];
  //     });

  //     const payload = { answers, completed_time };
  //     console.log("Submitting payload:", payload);

  //     const res = await API.post(
  //       `/qzz/quiz/${quizData?.results?.quiz_id}/round/${round}/participate/`,
  //       payload
  //     );
  //     setResultData(res.data);
  //     setShowResults(true);
  //   } catch (err) {
  //     console.error("Submit error:", err.response?.data);

  //     const errorMsg =
  //       err.response?.data?.error || err.response?.data?.message || "";
  //     if (
  //       errorMsg.includes("Quiz ended") ||
  //       errorMsg.includes("expired") ||
  //       errorMsg.includes("time")
  //     ) {
  //       alert("Quiz time ended. Your answers have been saved automatically.");
  //       navigate("/student/participation-list");
  //       return;
  //     }
  //     if (isViolation) {
  //       navigate("/student/participation-list");
  //     } else {
  //       setApiError("Submission failed. Redirecting to list...");
  //       setTimeout(() => navigate("/student/participation-list"), 2000);
  //     }
  //   } finally {
  //     setLoading(false);
  //     window.isSubmitting = false;
  //   }
  // };

  const handleSubmit = async (isViolation = false) => {
    try {
      setLoading(true);
      const spentTime = initialTimeLeft - timeLeft;
      const completed_time = formatTimeHHMMSS(spentTime);
      const answers = {};
      allQuestions.forEach((q) => {
        const idx = selectedAnswers[q.question_no];
        if (idx !== undefined) answers[q.question_no] = q.options[idx];
      });
      const payload = { answers, completed_time };
      console.log("Submitting:", payload);
      const res = await API.post(
        `/qzz/quiz/${quizData?.results?.quiz_id}/round/${round}/participate/`,
        payload
      );
      if (isViolation) navigate("/student/participation-list");
      else {
        setResultData(res.data);
        setShowResults(true);
      }
    } catch (err) {
      if (isViolation) navigate("/student/participation-list");
      else setApiError(err?.response?.data?.message || "Submit failed.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  /** ------------------ TIME FORMATS ------------------ **/
  const formatTimeHHMMSS = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatTimeLabel = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + " hr " : ""}${m > 0 ? m + " min " : ""}${s} sec`;
  };

  /** ------------------ RENDER RESULT ------------------ **/
  if (showResults && resultData) {
    return (
      <QuizResultCard
        examDate={resultData?.server_time}
        quizId={quizId}
        totalQuestions={resultData?.round_details?.total_questions}
        correct={resultData?.score_details?.correct}
        wrong={resultData?.score_details?.wrong}
        skipped={resultData?.score_details?.unanswered}
        totalMarks={resultData?.round_details?.total_marks}
        positiveMarks={resultData?.score_details?.positive_marks}
        negativeMarks={resultData?.score_details?.negative_marks}
        yourMarks={resultData?.marks_obtained}
        totalTime={resultData?.completed_time}
        onClose={() => navigate("/student/participation-list")}
        onDashboard={() => navigate("/student/dashboard")}
      />
    );
  }

  return (
    <div className="px-4">
      <div className="bg-white shadow max-w-4xl w-full mx-auto my-6 sm:my-10 rounded-xl h-[95vh] flex flex-col">
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-primary border-dashed rounded-full animate-spin"></div>
          </div>
        )}
        {apiError && (
          <div className="text-center text-red-600 py-4">{apiError}</div>
        )}
        {!loading && quizData ? (
          <>
            {/* Header */}
            <div className="bg-gray-100 px-4 sm:px-8 py-3 text-center space-y-.5 rounded-t-xl sticky top-0 z-10 flex-shrink-0">
              <h2 className="text-xl font-semibold break-words">
                {quizData?.results?.announcement_name}
              </h2>
              <h3 className="text-base font-semibold">
                {quizData?.results?.round_name} -{" "}
                {quizData?.results?.department}
              </h3>
              <h4 className="text-sm sm:text-base">
                Subject: {quizData?.results?.topic_subject}
              </h4>
              <h4 className="text-sm sm:text-base">
                Marks/Q: {quizData?.results?.marks_per_question}, Negative:{" "}
                {quizData?.results?.negative_marks_per_question}
              </h4>
              <div className="mt-2 text-sm sm:text-base">
                Time Left:{" "}
                <span
                  className={`px-4 py-1 rounded font-medium text-sm transition-all ${
                    timeLeft <= 30
                      ? "bg-red-600 text-white animate-pulse shadow-lg"
                      : "bg-black text-white"
                  }`}
                >
                  {formatTimeLabel(timeLeft)}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm mt-3 sm:mt-4 px-2 sm:px-6">
                <div>Total Questions: {quizData?.results?.total_questions}</div>
                <div>Total Marks: {quizData?.results?.total_marks}</div>
              </div>
            </div>
            {/* Questions */}
            <div className="flex-1 overflow-y-auto space-y-4 px-4 sm:px-8 py-6">
              {quizData.results.questions.map((q) => (
                <div key={q.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-sm sm:text-base">
                    {q.question_no}. {q.question_text}
                  </h3>
                  <div className="space-y-2">
                    {q.options.map((opt, idx) => (
                      <label
                        key={idx}
                        className={`flex items-start sm:items-center gap-2 px-2 py-1 rounded-md cursor-pointer border transition-all duration-150 ${
                          selectedAnswers[q.question_no] === idx
                            ? "bg-green-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <span className="mt-1.5 flex-shrink-0">
                          <input
                            type="radio"
                            checked={selectedAnswers[q.question_no] === idx}
                            onChange={() =>
                              handleAnswerChange(q.question_no, idx)
                            }
                            className="appearance-none w-4 h-4 min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px] rounded-full border border-gray-400 checked:border-green-500 checked:bg-green-500 transition-colors duration-150"
                          />
                        </span>
                        <span className="text-sm break-words leading-snug">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="px-4 sm:px-8 py-4 border-t border-gray-100 flex-shrink-0">
              <div className="flex justify-between items-center gap-2 sm:gap-4 flex-wrap">
                <button
                  disabled={currentPageIndex === 0}
                  onClick={handlePrevious}
                  className={`py-1.5 px-3 rounded text-sm font-medium transition ${
                    currentPageIndex === 0
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-gray-400 hover:bg-primary hover:text-white"
                  }`}
                >
                  Previous
                </button>
                <div className="flex justify-center gap-2 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => fetchQuestions(i)}
                      className={`py-1 px-2 text-sm rounded transition-all duration-150 ${
                        currentPageIndex === i
                          ? "ring-2 ring-primary"
                          : getPageStatus(i) === "completed"
                          ? "bg-green-500 text-white"
                          : getPageStatus(i) === "partial"
                          ? "bg-red-500 text-white"
                          : "bg-gray-400 hover:bg-primary hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className={`py-1.5 px-3 rounded text-sm font-medium transition ${
                    currentPageIndex < totalPages - 1
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {currentPageIndex < totalPages - 1 ? "Next" : "Submit"}
                </button>
              </div>
            </div>
          </>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center py-10">
              <h2 className="text-xl sm:text-2xl font-semibold text-red-600 mb-6">
                Sorry, you do not qualify for the next round!
              </h2>
              <Link
                to="/student/dashboard"
                className="py-2 px-6 rounded bg-primary text-white"
              >
                Go To Dashboard
              </Link>
            </div>
          )
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold text-red-600 mb-2 text-center">
                Warning: Violation Detected
              </h3>
              <p className="text-sm text-center mb-4">
                You are attempting to {violation}. This is against exam rules.
              </p>
              <div className="flex justify-center space-x-3">
                {!["switching tabs or minimizing browser"].includes(
                  violation
                ) && (
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setViolation("");
                    }}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => handleSubmit(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  {["switching tabs or minimizing browser"].includes(violation)
                    ? "I Understand"
                    : "Leave"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestionPaperEvent;

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import API from "../../../api/API";
// import QuizResultCard from "./QuizResultCard";

// const QuizQuestionPaper = () => {
//   const [quizData, setQuizData] = useState(null);
//   const [allQuestions, setAllQuestions] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [completedPages, setCompletedPages] = useState({});
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);
//   const [currentPageIndex, setCurrentPageIndex] = useState(0);
//   const [showResults, setShowResults] = useState(false);
//   const [resultData, setResultData] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [violation, setViolation] = useState("");
//   const [hasStarted, setHasStarted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   const navigate = useNavigate();
//   const { round, quizId, set } = useParams();
//   const questionsPerPage = 2;

//   console.log("set", set);

//   /** ------------------ FETCH QUESTIONS ------------------ **/
//   const fetchQuestions = async (pageIndex = 0) => {
//     try {
//       setLoading(true);
//       setApiError("");

//       const offset = pageIndex * questionsPerPage;
//       const url = `/qzz/view-event-question-set/anc/${quizId}/round/${round}/quiz/${set}/?limit=${questionsPerPage}&offset=${offset}`;

//       const res = await API.get(url);

//       setQuizData(res?.data);
//       setCurrentPageIndex(pageIndex);

//       setAllQuestions((prev) => {
//         const newQs = res?.data?.results?.questions || [];
//         const merged = [...prev];
//         newQs.forEach((q) => {
//           if (!merged.find((item) => item.question_no === q.question_no))
//             merged.push(q);
//         });
//         return merged;
//       });

//       if (pageIndex === 0) {
//         const durationSec = (res?.data?.results?.duration || 0) * 60;
//         setTotalDurationSeconds(durationSec);
//         setTimeLeft(durationSec);
//       }

//       setHasStarted(true);
//     } catch (err) {
//       setApiError(err?.response?.data?.message || "Failed to load questions.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions(0);
//   }, [quizId, round]);

//   /** ------------------ TIMER ------------------ **/
//   useEffect(() => {
//     if (!hasStarted || timeLeft <= 0) return;

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           setViolation("time expiration");
//           setShowModal(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timeLeft, hasStarted]);

//   /** ------------------ BROWSER PROTECTIONS ------------------ **/
//   useEffect(() => {
//     if (!hasStarted) return;

//     window.history.pushState(null, "", window.location.href);

//     const showViolation = (msg) => {
//       setViolation(msg);
//       setShowModal(true);
//     };

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "hidden")
//         showViolation("switching tabs or minimizing browser");
//     };
//     const handlePopState = () => showViolation("using browser back button");

//     const handleBeforeUnload = (e) => {
//       if (!showModal) {
//         e.preventDefault();
//         showViolation("reload or close the page");
//         return (e.returnValue = "");
//       }
//     };

//     const handleKeyDown = (e) => {
//       if (e.key === "PrintScreen" || e.keyCode === 44)
//         showViolation("taking screenshot");
//     };

//     const handlePaste = (e) => {
//       for (let item of e.clipboardData.items) {
//         if (item.type.includes("image")) showViolation("pasting screenshot");
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     window.addEventListener("popstate", handlePopState);
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     window.addEventListener("keydown", handleKeyDown);
//     document.addEventListener("paste", handlePaste);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       window.removeEventListener("popstate", handlePopState);
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       window.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("paste", handlePaste);
//     };
//   }, [hasStarted, showModal]);

//   /** ------------------ ANSWER HANDLING ------------------ **/
//   const handleAnswerChange = (question_no, answerIndex) => {
//     setSelectedAnswers((prev) => {
//       const updated = { ...prev, [question_no]: answerIndex };

//       if (
//         quizData?.results?.questions.every(
//           (q) => updated[q.question_no] !== undefined
//         )
//       ) {
//         setCompletedPages((pages) => ({ ...pages, [currentPageIndex]: true }));
//       }
//       return updated;
//     });
//   };

//   /** ------------------ PAGE STATUS (COLOR LOGIC) ------------------ **/
//   const getPageStatus = (pageIndex) => {
//     const offset = pageIndex * questionsPerPage;
//     const pageQuestions = allQuestions.slice(offset, offset + questionsPerPage);

//     if (pageQuestions.length === 0) return "default";

//     const answered = pageQuestions.filter(
//       (q) => selectedAnswers[q.question_no] !== undefined
//     ).length;

//     if (answered === pageQuestions.length) return "completed";
//     if (answered > 0) return "partial";
//     return "default";
//   };

//   /** ------------------ PAGINATION ------------------ **/
//   const totalPages = quizData
//     ? Math.ceil(quizData.count / questionsPerPage)
//     : 0;

//   const handleNext = () => {
//     const nextPageIndex = currentPageIndex + 1;
//     if (
//       quizData &&
//       nextPageIndex < Math.ceil(quizData.count / questionsPerPage)
//     ) {
//       fetchQuestions(nextPageIndex);
//     } else {
//       handleSubmit();
//     }
//   };

//   const handlePrevious = () => {
//     const prevPageIndex = currentPageIndex - 1;
//     if (prevPageIndex >= 0) fetchQuestions(prevPageIndex);
//   };

//   /** ------------------ SUBMISSION ------------------ **/
//   const handleSubmit = async (isViolation = false) => {
//     try {
//       setLoading(true);
//       const spentTime = totalDurationSeconds - timeLeft;
//       const completed_time = formatTimeHHMMSS(spentTime);

//       const answers = {};
//       allQuestions.forEach((q) => {
//         const idx = selectedAnswers[q.question_no];
//         if (idx !== undefined) answers[q.question_no] = q.options[idx];
//       });

//       const payload = { answers, completed_time };

//       const res = await API.post(
//         `/qzz/quiz/${quizData?.results?.quiz_id}/round/${round}/participate/`,
//         payload
//       );

//       if (isViolation) navigate("/student/participation-list");
//       else {
//         setResultData(res.data);
//         setShowResults(true);
//       }
//     } catch (err) {
//       if (isViolation) navigate("/student/participation-list");
//       else setApiError(err?.response?.data?.message || "Submit failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /** ------------------ TIME FORMATS ------------------ **/
//   const formatTimeHHMMSS = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${h.toString().padStart(2, "0")}:${m
//       .toString()
//       .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };
//   const formatTimeLabel = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${h > 0 ? h + " hr " : ""}${m > 0 ? m + " min " : ""}${s} sec`;
//   };

//   /** ------------------ RENDER RESULT ------------------ **/
//   if (showResults && resultData) {
//     return (
//       <QuizResultCard
//         examDate={resultData?.server_time}
//         quizId={quizId}
//         totalQuestions={resultData?.round_details?.total_questions}
//         correct={resultData?.score_details?.correct}
//         wrong={resultData?.score_details?.wrong}
//         skipped={resultData?.score_details?.unanswered}
//         totalMarks={resultData?.round_details?.total_marks}
//         positiveMarks={resultData?.score_details?.positive_marks}
//         negativeMarks={resultData?.score_details?.negative_marks}
//         yourMarks={resultData?.marks_obtained}
//         totalTime={resultData?.completed_time}
//         onClose={() => navigate("/student/participation-list")}
//         onDashboard={() => navigate("/student/dashboard")}
//       />
//     );
//   }

//   return (
//     <div className="px-4">
//       <div className="bg-white shadow max-w-4xl w-full mx-auto my-6 sm:my-10 rounded-xl h-[95vh] flex flex-col">
//         {loading && (
//           <div className="flex justify-center items-center py-10">
//             <div className="w-10 h-10 border-4 border-primary border-dashed rounded-full animate-spin"></div>
//           </div>
//         )}
//         {apiError && (
//           <div className="text-center text-red-600 py-4">{apiError}</div>
//         )}

//         {!loading && quizData ? (
//           <>
//             {/* Header */}
//             <div className="bg-gray-100 px-4 sm:px-8 py-6 text-center space-y-2 rounded-t-xl sticky top-0 z-10 flex-shrink-0">
//               <h2 className="text-xl sm:text-2xl font-semibold break-words">
//                 {quizData?.results?.announcement_name}
//               </h2>
//               <h3 className="text-base sm:text-lg font-semibold">
//                 {quizData?.results?.round_name} -{" "}
//                 {quizData?.results?.department}
//               </h3>
//               <h4 className="text-sm sm:text-base">
//                 Subject: {quizData?.results?.topic_subject}
//               </h4>
//               <h4 className="text-sm sm:text-base">
//                 Marks/Q: {quizData?.results?.marks_per_question}, Negative:{" "}
//                 {quizData?.results?.negative_marks_per_question}
//               </h4>

//               <div className="mt-2 text-sm sm:text-base">
//                 Time Left:{" "}
//                 <span className="bg-black600 text-white px-2 py-1 rounded">
//                   {formatTimeLabel(timeLeft)}
//                 </span>
//               </div>

//               <div className="flex justify-between text-xs sm:text-sm mt-3 sm:mt-4 px-2 sm:px-6">
//                 <div>Total Questions: {quizData?.results?.total_questions}</div>
//                 <div>Total Marks: {quizData?.results?.total_marks}</div>
//               </div>
//             </div>

//             {/* Questions */}
//             <div className="flex-1 overflow-y-auto space-y-4 px-4 sm:px-8 py-6">
//               {quizData.results.questions.map((q) => (
//                 <div key={q.id} className="border rounded-lg p-4">
//                   <h3 className="font-semibold mb-3 text-sm sm:text-base">
//                     {q.question_no}. {q.question_text}
//                   </h3>

//                   <div className="space-y-2">
//                     {q.options.map((opt, idx) => (
//                       <label
//                         key={idx}
//                         className={`flex items-start sm:items-center gap-2 p-2 rounded-md cursor-pointer border transition-all duration-150 ${
//                           selectedAnswers[q.question_no] === idx
//                             ? "bg-green-50"
//                             : "border-gray-200 hover:bg-gray-50"
//                         }`}
//                       >
//                         <span className="mt-1.5 flex-shrink-0">
//                           <input
//                             type="radio"
//                             checked={selectedAnswers[q.question_no] === idx}
//                             onChange={() =>
//                               handleAnswerChange(q.question_no, idx)
//                             }
//                             className="appearance-none w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] rounded-full border border-gray-400 checked:border-green-500 checked:bg-green-500 transition-colors duration-150"
//                           />
//                         </span>
//                         <span className="text-sm sm:text-base break-words leading-snug">
//                           {opt}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination */}
//             <div className="px-4 sm:px-8 py-6 border-t border-gray-100 flex-shrink-0">
//               <div className="flex justify-between gap-2 sm:gap-4 flex-wrap">
//                 <button
//                   disabled={currentPageIndex === 0}
//                   onClick={handlePrevious}
//                   className={`py-2 px-4 rounded text-sm sm:text-base font-medium transition ${
//                     currentPageIndex === 0
//                       ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                       : "bg-gray-400 hover:bg-primary hover:text-white"
//                   }`}
//                 >
//                   Previous
//                 </button>

//                 <button
//                   onClick={handleNext}
//                   className={`py-2 px-4 rounded text-sm sm:text-base font-medium transition ${
//                     currentPageIndex < totalPages - 1
//                       ? "bg-primary text-white hover:bg-primary/90"
//                       : "bg-green-500 text-white hover:bg-green-600"
//                   }`}
//                 >
//                   {currentPageIndex < totalPages - 1 ? "Next" : "Submit"}
//                 </button>
//               </div>

//               {/* Page Numbers */}
//               <div className="flex justify-center gap-2 mt-5 flex-wrap">
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => fetchQuestions(i)}
//                     className={`py-2 px-3 text-sm rounded transition-all duration-150 ${
//                       currentPageIndex === i
//                         ? "ring-2 ring-primary"
//                         : getPageStatus(i) === "completed"
//                         ? "bg-green-500 text-white"
//                         : getPageStatus(i) === "partial"
//                         ? "bg-red-500 text-white"
//                         : "bg-gray-400 hover:bg-primary hover:text-white"
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </>
//         ) : (
//           !loading && (
//             <div className="flex flex-col items-center justify-center py-10">
//               <h2 className="text-xl sm:text-2xl font-semibold text-red-600">
//                 Sorry, you do not qualify for the next round!
//               </h2>
//             </div>
//           )
//         )}

//         {/* Violation Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black600 bg-opacity-50 flex items-center justify-center z-50 px-4">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
//               <h3 className="text-lg font-semibold text-red-600 mb-2 text-center">
//                 Warning: Violation Detected
//               </h3>
//               <p className="text-sm text-center mb-4">
//                 You are attempting to {violation}. This is against exam rules.
//               </p>
//               <div className="flex justify-center space-x-3">
//                 {!["switching tabs or minimizing browser"].includes(
//                   violation
//                 ) && (
//                   <button
//                     onClick={() => {
//                       setShowModal(false);
//                       setViolation("");
//                     }}
//                     className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button
//                   onClick={() => handleSubmit(true)}
//                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
//                 >
//                   {["switching tabs or minimizing browser"].includes(violation)
//                     ? "I Understand"
//                     : "Leave"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuizQuestionPaper;

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import API from "../../../api/API";
// import QuizResultCard from "./QuizResultCard";

// const QuizQuestionPaper = () => {
//   const [quizData, setQuizData] = useState(null);
//   const [allQuestions, setAllQuestions] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [completedPages, setCompletedPages] = useState({});
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);
//   const [currentPageIndex, setCurrentPageIndex] = useState(0);
//   const [showResults, setShowResults] = useState(false);
//   const [resultData, setResultData] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [violation, setViolation] = useState("");
//   const [hasStarted, setHasStarted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   const navigate = useNavigate();
//   const { round, quizId } = useParams();
//   const questionsPerPage = 2;

//   /** ------------------ FETCH QUESTIONS ------------------ **/
//   const fetchQuestions = async (pageIndex = 0) => {
//     try {
//       setLoading(true);
//       setApiError("");

//       const offset = pageIndex * questionsPerPage;
//       const url = `/qzz/view-question-set/anc/${quizId}/round/${round}/?limit=${questionsPerPage}&offset=${offset}`;
//       const res = await API.get(url);

//       setQuizData(res?.data);
//       setCurrentPageIndex(pageIndex);

//       setAllQuestions((prev) => {
//         const newQs = res?.data?.results?.questions || [];
//         const merged = [...prev];
//         newQs.forEach((q) => {
//           if (!merged.find((item) => item.question_no === q.question_no))
//             merged.push(q);
//         });
//         return merged;
//       });

//       if (pageIndex === 0) {
//         const durationSec = (res?.data?.results?.duration || 0) * 60;
//         setTotalDurationSeconds(durationSec);
//         setTimeLeft(durationSec);
//       }

//       setHasStarted(true);
//     } catch (err) {
//       setApiError(err?.response?.data?.message || "Failed to load questions.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions(0);
//   }, [quizId, round]);

//   /** ------------------ TIMER ------------------ **/
//   useEffect(() => {
//     if (!hasStarted || timeLeft <= 0) return;

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           setViolation("time expiration");
//           setShowModal(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timeLeft, hasStarted]);

//   /** ------------------ BROWSER PROTECTIONS ------------------ **/
//   useEffect(() => {
//     if (!hasStarted) return;

//     window.history.pushState(null, "", window.location.href);

//     const showViolation = (msg) => {
//       setViolation(msg);
//       setShowModal(true);
//     };

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "hidden")
//         showViolation("switching tabs or minimizing browser");
//     };
//     const handlePopState = () => showViolation("using browser back button");

//     const handleBeforeUnload = (e) => {
//       if (!showModal) {
//         e.preventDefault();
//         showViolation("reload or close the page");
//         return (e.returnValue = "");
//       }
//     };

//     const handleKeyDown = (e) => {
//       if (e.key === "PrintScreen" || e.keyCode === 44)
//         showViolation("taking screenshot");
//     };

//     const handlePaste = (e) => {
//       for (let item of e.clipboardData.items) {
//         if (item.type.includes("image")) showViolation("pasting screenshot");
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     window.addEventListener("popstate", handlePopState);
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     window.addEventListener("keydown", handleKeyDown);
//     document.addEventListener("paste", handlePaste);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       window.removeEventListener("popstate", handlePopState);
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       window.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("paste", handlePaste);
//     };
//   }, [hasStarted, showModal]);

//   /** ------------------ ANSWER HANDLING ------------------ **/
//   const handleAnswerChange = (question_no, answerIndex) => {
//     setSelectedAnswers((prev) => {
//       const updated = { ...prev, [question_no]: answerIndex };

//       if (
//         quizData?.results?.questions.every(
//           (q) => updated[q.question_no] !== undefined
//         )
//       ) {
//         setCompletedPages((pages) => ({ ...pages, [currentPageIndex]: true }));
//       }
//       return updated;
//     });
//   };

//   /** ------------------ PAGE STATUS (COLOR LOGIC) ------------------ **/
//   const getPageStatus = (pageIndex) => {
//     const offset = pageIndex * questionsPerPage;
//     const pageQuestions = allQuestions.slice(offset, offset + questionsPerPage);

//     if (pageQuestions.length === 0) return "default";

//     const answered = pageQuestions.filter(
//       (q) => selectedAnswers[q.question_no] !== undefined
//     ).length;

//     if (answered === pageQuestions.length) return "completed";
//     if (answered > 0) return "partial";
//     return "default";
//   };

//   /** ------------------ PAGINATION ------------------ **/
//   const totalPages = quizData
//     ? Math.ceil(quizData.count / questionsPerPage)
//     : 0;

//   const handleNext = () => {
//     const nextPageIndex = currentPageIndex + 1;
//     if (
//       quizData &&
//       nextPageIndex < Math.ceil(quizData.count / questionsPerPage)
//     ) {
//       fetchQuestions(nextPageIndex);
//     } else {
//       handleSubmit();
//     }
//   };

//   const handlePrevious = () => {
//     const prevPageIndex = currentPageIndex - 1;
//     if (prevPageIndex >= 0) fetchQuestions(prevPageIndex);
//   };

//   /** ------------------ SUBMISSION ------------------ **/
//   const handleSubmit = async (isViolation = false) => {
//     try {
//       setLoading(true);
//       const spentTime = totalDurationSeconds - timeLeft;
//       const completed_time = formatTimeHHMMSS(spentTime);

//       const answers = {};
//       allQuestions.forEach((q) => {
//         const idx = selectedAnswers[q.question_no];
//         if (idx !== undefined) answers[q.question_no] = q.options[idx];
//       });

//       const payload = { answers, completed_time };

//       const res = await API.post(
//         `/qzz/quiz/${quizData?.results?.quiz_id}/round/${round}/participate/`,
//         payload
//       );

//       if (isViolation) navigate("/student/participation-list");
//       else {
//         setResultData(res.data);
//         setShowResults(true);
//       }
//     } catch (err) {
//       if (isViolation) navigate("/student/participation-list");
//       else setApiError(err?.response?.data?.message || "Submit failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /** ------------------ TIME FORMATS ------------------ **/
//   const formatTimeHHMMSS = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${h.toString().padStart(2, "0")}:${m
//       .toString()
//       .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };
//   const formatTimeLabel = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${h > 0 ? h + " hr " : ""}${m > 0 ? m + " min " : ""}${s} sec`;
//   };

//   /** ------------------ RENDER RESULT ------------------ **/
//   if (showResults && resultData) {
//     return (
//       <QuizResultCard
//         examDate={resultData?.server_time}
//         quizId={quizId}
//         totalQuestions={resultData?.round_details?.total_questions}
//         correct={resultData?.score_details?.correct}
//         wrong={resultData?.score_details?.wrong}
//         skipped={resultData?.score_details?.unanswered}
//         totalMarks={resultData?.round_details?.total_marks}
//         positiveMarks={resultData?.score_details?.positive_marks}
//         negativeMarks={resultData?.score_details?.negative_marks}
//         yourMarks={resultData?.marks_obtained}
//         totalTime={resultData?.completed_time}
//         onClose={() => navigate("/student/participation-list")}
//         onDashboard={() => navigate("/student/dashboard")}
//       />
//     );
//   }

//   return (
//     <div className="bg-white shadow max-w-4xl mx-auto my-10  rounded-xl h-[95vh] flex flex-col">
//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="w-10 h-10 border-4 border-primary border-dashed rounded-full animate-spin"></div>
//         </div>
//       )}
//       {apiError && (
//         <div className="text-center text-red-600 py-4">{apiError}</div>
//       )}

//       {!loading && quizData && (
//         <>
//           {/* Header */}
//           <div className="bg-gray-100 p-8 text-center space-y-2 rounded-tl-xl rounded-tr-xl z-10 sticky top-0 flex-shrink-0">
//             <h2 className="text-2xl font-semibold">
//               {quizData?.results?.announcement_name}
//             </h2>
//             <h3 className="text-lg font-semibold">
//               {quizData?.results?.round_name} - {quizData?.results?.department}
//             </h3>
//             <h4>Subject: {quizData?.results?.topic_subject}</h4>
//             <h4>
//               Marks/Q: {quizData?.results?.marks_per_question}, Negative:{" "}
//               {quizData?.results?.negative_marks_per_question}
//             </h4>
//             <div className="mt-2">
//               Time Left:{" "}
//               <span className="bg-black600 text-white px-2 py-1 rounded">
//                 {formatTimeLabel(timeLeft)}
//               </span>
//             </div>
//             <div className="flex justify-between mt-4">
//               <div>Total Questions: {quizData?.results?.total_questions}</div>
//               <div>Total Marks: {quizData?.results?.total_marks}</div>
//             </div>
//           </div>

//           {/* Questions */}
//           <div className="flex-1 overflow-y-auto space-y-4 p-8">
//             {quizData.results.questions.map((q) => (
//               <div key={q.id} className="border rounded-lg p-4">
//                 <h3 className="font-semibold mb-2">
//                   {q.question_no}. {q.question_text}
//                 </h3>
//                 <div className="space-y-1">
//                   {q.options.map((opt, idx) => (
//                     <label
//                       key={idx}
//                       className={`flex items-center space-x-2 p-1 rounded cursor-pointer ${
//                         selectedAnswers[q.question_no] === idx
//                           ? "bg-green-100"
//                           : ""
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         checked={selectedAnswers[q.question_no] === idx}
//                         onChange={() => handleAnswerChange(q.question_no, idx)}
//                         className="form-checkbox h-5 w-5 text-green-500"
//                       />
//                       <span>{opt}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="p-8 border-t border-gray-50 flex-shrink-0">
//             <div className="flex justify-between">
//               <button
//                 disabled={currentPageIndex === 0}
//                 onClick={handlePrevious}
//                 className={`py-2 px-3 rounded ${
//                   currentPageIndex === 0
//                     ? "bg-gray-300 text-gray-600"
//                     : "bg-gray-400 hover:bg-primary hover:text-white"
//                 }`}
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={handleNext}
//                 className={`py-2 px-3 rounded ${
//                   currentPageIndex < totalPages - 1
//                     ? "bg-primary text-white"
//                     : "bg-green-500 text-white"
//                 }`}
//               >
//                 {currentPageIndex < totalPages - 1 ? "Next" : "Submit"}
//               </button>
//             </div>

//             {/* Page Numbers */}
//             <div className="flex justify-center gap-2 mt-4 flex-wrap">
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => fetchQuestions(i)}
//                   className={`py-2 px-3 rounded transition-all ${
//                     currentPageIndex === i
//                       ? "ring-2 ring-primary"
//                       : getPageStatus(i) === "completed"
//                       ? "bg-green-500 text-white"
//                       : getPageStatus(i) === "partial"
//                       ? "bg-red-500 text-white"
//                       : "bg-gray-400 hover:bg-primary hover:text-white"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </>
//       )}

//       {/* Violation Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//             <h3 className="text-lg font-semibold text-red-600 mb-2">
//               Warning: Violation Detected
//             </h3>
//             <p className="mb-4">
//               You are attempting to {violation}. This is against exam rules.
//             </p>
//             <div className="flex justify-end space-x-3">
//               {!["switching tabs or minimizing browser"].includes(
//                 violation
//               ) && (
//                 <button
//                   onClick={() => {
//                     setShowModal(false);
//                     setViolation("");
//                   }}
//                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//               )}
//               <button
//                 onClick={() => handleSubmit(true)}
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 {["switching tabs or minimizing browser"].includes(violation)
//                   ? "I Understand"
//                   : "Leave"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizQuestionPaper;

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import API from "../../../api/API";
// import QuizResultCard from "./QuizResultCard";

// const QuizQuestionPaper = () => {
//   const [quizData, setQuizData] = useState(null);
//   const [allQuestions, setAllQuestions] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [completedPages, setCompletedPages] = useState({});
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);
//   const [currentPageIndex, setCurrentPageIndex] = useState(0);
//   const [showResults, setShowResults] = useState(false);
//   const [resultData, setResultData] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [violation, setViolation] = useState("");
//   const [hasStarted, setHasStarted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   const navigate = useNavigate();
//   const { round, quizId } = useParams();
//   const questionsPerPage = 2;

//   /** ------------------ FETCH QUESTIONS ------------------ **/
//   const fetchQuestions = async (pageIndex = 0) => {
//     try {
//       setLoading(true);
//       setApiError("");

//       const offset = pageIndex * questionsPerPage;
//       const url = `/qzz/view-question-set/anc/${quizId}/round/${round}/?limit=${questionsPerPage}&offset=${offset}`;
//       const res = await API.get(url);

//       setQuizData(res?.data);
//       setCurrentPageIndex(pageIndex);

//       // Merge questions into allQuestions
//       setAllQuestions((prev) => {
//         const newQs = res?.data?.results?.questions || [];
//         const merged = [...prev];
//         newQs.forEach((q) => {
//           if (!merged.find((item) => item.question_no === q.question_no))
//             merged.push(q);
//         });
//         return merged;
//       });

//       // Initialize timer only on first page
//       if (pageIndex === 0) {
//         const durationSec = (res?.data?.results?.duration || 0) * 60;
//         setTotalDurationSeconds(durationSec);
//         setTimeLeft(durationSec);
//       }

//       setHasStarted(true);
//     } catch (err) {
//       setApiError(err?.response?.data?.message || "Failed to load questions.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions(0);
//   }, [quizId, round]);

//   /** ------------------ TIMER ------------------ **/
//   useEffect(() => {
//     if (!hasStarted || timeLeft <= 0) return;

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           setViolation("time expiration");
//           setShowModal(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timeLeft, hasStarted]);

//   /** ------------------ BROWSER PROTECTIONS ------------------ **/
//   useEffect(() => {
//     if (!hasStarted) return;

//     window.history.pushState(null, "", window.location.href);

//     const showViolation = (msg) => {
//       setViolation(msg);
//       setShowModal(true);
//     };

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "hidden")
//         showViolation("switching tabs or minimizing browser");
//     };
//     const handlePopState = () => showViolation("using browser back button");

//     const handleBeforeUnload = (e) => {
//       if (!showModal) {
//         e.preventDefault();
//         showViolation("reload or close the page");
//         return (e.returnValue = "");
//       }
//     };

//     const handleKeyDown = (e) => {
//       if (e.key === "PrintScreen" || e.keyCode === 44)
//         showViolation("taking screenshot");
//     };

//     const handlePaste = (e) => {
//       for (let item of e.clipboardData.items) {
//         if (item.type.includes("image")) showViolation("pasting screenshot");
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     window.addEventListener("popstate", handlePopState);
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     window.addEventListener("keydown", handleKeyDown);
//     document.addEventListener("paste", handlePaste);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       window.removeEventListener("popstate", handlePopState);
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       window.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("paste", handlePaste);
//     };
//   }, [hasStarted, showModal]);

//   /** ------------------ ANSWER HANDLING ------------------ **/
//   const handleAnswerChange = (question_no, answerIndex) => {
//     setSelectedAnswers((prev) => {
//       const updated = { ...prev, [question_no]: answerIndex };

//       // mark page as completed if all questions answered
//       if (
//         quizData?.results?.questions.every(
//           (q) => updated[q.question_no] !== undefined
//         )
//       ) {
//         setCompletedPages((pages) => ({ ...pages, [currentPageIndex]: true }));
//       }
//       return updated;
//     });
//   };

//   /** ------------------ PAGINATION ------------------ **/
//   const totalPages = quizData
//     ? Math.ceil(quizData.count / questionsPerPage)
//     : 0;

//   const handleNext = () => {
//     const nextPageIndex = currentPageIndex + 1;
//     if (
//       quizData &&
//       nextPageIndex < Math.ceil(quizData.count / questionsPerPage)
//     ) {
//       fetchQuestions(nextPageIndex);
//     } else {
//       handleSubmit();
//     }
//   };

//   const handlePrevious = () => {
//     const prevPageIndex = currentPageIndex - 1;
//     if (prevPageIndex >= 0) fetchQuestions(prevPageIndex);
//   };

//   /** ------------------ SUBMISSION ------------------ **/
//   const handleSubmit = async (isViolation = false) => {
//     try {
//       setLoading(true);
//       const spentTime = totalDurationSeconds - timeLeft;
//       const completed_time = formatTimeHHMMSS(spentTime);

//       const answers = {};
//       allQuestions.forEach((q) => {
//         const idx = selectedAnswers[q.question_no];
//         if (idx !== undefined) answers[q.question_no] = q.options[idx];
//       });

//       const payload = { answers, completed_time };

//       const res = await API.post(
//         `/qzz/quiz/${quizData?.results?.quiz_id}/round/${round}/participate/`,
//         payload
//       );

//       if (isViolation) navigate("/student/participation-list");
//       else {
//         setResultData(res.data);
//         setShowResults(true);
//       }
//     } catch (err) {
//       if (isViolation) navigate("/student/participation-list");
//       else setApiError(err?.response?.data?.message || "Submit failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /** ------------------ TIME FORMATS ------------------ **/
//   const formatTimeHHMMSS = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${h.toString().padStart(2, "0")}:${m
//       .toString()
//       .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };
//   const formatTimeLabel = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${h > 0 ? h + " hr " : ""}${m > 0 ? m + " min " : ""}${s} sec`;
//   };

//   /** ------------------ RENDER RESULT ------------------ **/
//   if (showResults && resultData) {
//     return (
//       <QuizResultCard
//         examDate={resultData?.server_time}
//         quizId={quizId}
//         totalQuestions={resultData?.round_details?.total_questions}
//         correct={resultData?.score_details?.correct}
//         wrong={resultData?.score_details?.wrong}
//         skipped={resultData?.score_details?.unanswered}
//         totalMarks={resultData?.round_details?.total_marks}
//         positiveMarks={resultData?.score_details?.positive_marks}
//         negativeMarks={resultData?.score_details?.negative_marks}
//         yourMarks={resultData?.marks_obtained}
//         totalTime={resultData?.completed_time}
//         onClose={() => navigate("/student/participation-list")}
//         onDashboard={() => navigate("/student/dashboard")}
//       />
//     );
//   }

//   return (
//     <div className="bg-white shadow max-w-4xl mx-auto my-10  rounded-xl h-[95vh] flex flex-col">
//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="w-10 h-10 border-4 border-primary border-dashed rounded-full animate-spin"></div>
//         </div>
//       )}
//       {apiError && (
//         <div className="text-center text-red-600 py-4">{apiError}</div>
//       )}

//       {!loading && quizData && (
//         <>
//           {/* Header */}
//           <div className="bg-gray-100 p-8 text-center space-y-2 rounded-tl-xl rounded-tr-xl z-10 sticky top-0 flex-shrink-0">
//             <h2 className="text-2xl font-semibold">
//               {quizData?.results?.announcement_name}
//             </h2>
//             <h3 className="text-lg font-semibold">
//               {quizData?.results?.round_name} - {quizData?.results?.department}
//             </h3>
//             <h4>Subject: {quizData?.results?.topic_subject}</h4>
//             <h4>
//               Marks/Q: {quizData?.results?.marks_per_question}, Negative:{" "}
//               {quizData?.results?.negative_marks_per_question}
//             </h4>
//             <div className="mt-2">
//               Time Left:{" "}
//               <span className="bg-black600 text-white px-2 py-1 rounded">
//                 {formatTimeLabel(timeLeft)}
//               </span>
//             </div>
//             <div className="flex justify-between mt-4">
//               <div>Total Questions: {quizData?.results?.total_questions}</div>
//               <div>Total Marks: {quizData?.results?.total_marks}</div>
//             </div>
//           </div>

//           {/* Questions (scrollable) */}
//           <div className="flex-1 overflow-y-auto space-y-4 p-8">
//             {quizData.results.questions.map((q) => (
//               <div key={q.id} className="border rounded-lg p-4">
//                 <h3 className="font-semibold mb-2">
//                   {q.question_no}. {q.question_text}
//                 </h3>
//                 <div className="space-y-1">
//                   {q.options.map((opt, idx) => (
//                     <label
//                       key={idx}
//                       className={`flex items-center space-x-2 p-1 rounded cursor-pointer ${
//                         selectedAnswers[q.question_no] === idx
//                           ? "bg-green-100"
//                           : ""
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         checked={selectedAnswers[q.question_no] === idx}
//                         onChange={() => handleAnswerChange(q.question_no, idx)}
//                         className="form-checkbox h-5 w-5 text-green-500"
//                       />
//                       <span>{opt}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination Buttons */}
//           <div className="p-8 border-t border-gray-50 flex-shrink-0">
//             <div className="flex justify-between">
//               <button
//                 disabled={currentPageIndex === 0}
//                 onClick={handlePrevious}
//                 className={`py-2 px-3 rounded ${
//                   currentPageIndex === 0
//                     ? "bg-gray-300 text-gray-600"
//                     : "bg-gray-400 hover:bg-primary hover:text-white"
//                 }`}
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={handleNext}
//                 className={`py-2 px-3 rounded ${
//                   currentPageIndex < totalPages - 1
//                     ? "bg-primary text-white"
//                     : "bg-green-500 text-white"
//                 }`}
//               >
//                 {currentPageIndex < totalPages - 1 ? "Next" : "Submit"}
//               </button>
//             </div>

//             {/* Page Numbers */}
//             <div className="flex justify-center gap-2 mt-4 flex-wrap">
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => fetchQuestions(i)}
//                   className={`py-2 px-3 rounded ${
//                     currentPageIndex === i
//                       ? "bg-primary text-white"
//                       : "bg-gray-400 hover:bg-primary hover:text-white"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </>
//       )}

//       {/* Violation Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//             <h3 className="text-lg font-semibold text-red-600 mb-2">
//               Warning: Violation Detected
//             </h3>
//             <p className="mb-4">
//               You are attempting to {violation}. This is against exam rules.
//             </p>
//             <div className="flex justify-end space-x-3">
//               {!["switching tabs or minimizing browser"].includes(
//                 violation
//               ) && (
//                 <button
//                   onClick={() => {
//                     setShowModal(false);
//                     setViolation("");
//                   }}
//                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//               )}
//               <button
//                 onClick={() => handleSubmit(true)}
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 {["switching tabs or minimizing browser"].includes(violation)
//                   ? "I Understand"
//                   : "Leave"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizQuestionPaper;
