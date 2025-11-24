import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import API from "../api/API";
import { formatDateTime } from "../utils/FormateDateTime";

const QuestionsAnswerShit = () => {
  const { roundId } = useParams();
  const location = useLocation();
  const { Id } = location.state || {};
  const quizId = Id || roundId;

  const [quizAnswer, setQuizAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const [limit] = useState(3);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");

  // filter answer
  const fetchAnswerPaper = async (offsetValue = 0, selectedFilter = filter) => {
    try {
      setLoading(true);
      setError("");

      let apiUrl = `/qzz/single-quiz-result/${quizId}/?limit=${limit}&offset=${offsetValue}`;

      if (selectedFilter !== "all") {
        apiUrl += `&keyword=${selectedFilter}`;
      }

      const response = await API.get(apiUrl);
      const data = response?.data;

      setQuizAnswer(data?.results);
      setCount(data?.count);
      setOffset(offsetValue);
      setCurrentPage(Math.floor(offsetValue / limit) + 1);
    } catch (err) {
      // console.error("Error fetching:", err);
      const errorMessage = err?.response?.data?.error;
      setError(errorMessage || "Failed to load data. Please try again.");
      setQuizAnswer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnswerPaper(0, filter);
  }, [roundId, filter]);

  const totalPages = Math.ceil(count / limit);

  return (
    <div className="px-4">
      <div className="bg-white shadow max-w-4xl mx-auto rounded-xl my-10 h-[95vh] flex flex-col relative">
        {/* Loading Spinner Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green500"></div>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <p className="text-center text-red500 mt-10">{error}</p>
        )}

        {/* Main Content */}
        {!loading && !error && quizAnswer && (
          <>
            {/* Header */}
            <div className="bg-gray-100 p-6 rounded-tl-xl rounded-tr-xl flex-shrink-0 sticky top-0 z-10 shadow-sm">
              <div className="flex justify-start mb-2">
                <Link
                  className="py-1.5 px-3 rounded bg-gray200 text-black600 font-semibold text-sm transition hover:bg-primary hover:text-white"
                  to="/student/dashboard"
                >
                  Back to Quiz Table
                </Link>
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-xl font-semibold text-black600">
                  {quizAnswer?.quiz_details?.announcement_name}
                </h2>
                <h3 className="text-md font-semibold text-black600">
                  Round: {quizAnswer?.quiz_details?.round_name}
                </h3>
                <h4 className="text-sm font-medium text-black600">
                  Subject: {quizAnswer?.quiz_details?.topic_subject}
                </h4>
                <h4 className="text-sm font-medium text-black600">
                  EXAM DATE:{" "}
                  {formatDateTime(quizAnswer?.quiz_details?.completed_at)}
                </h4>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm font-medium text-black600">
                <span>Subject: {quizAnswer?.quiz_details?.topic_subject}</span>
                <span>
                  Total Questions: {quizAnswer?.quiz_details?.total_question}
                </span>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center justify-center gap-2 mt-3">
                {["all", "correct", "wrong", "skipped"].map((btn) => (
                  <button
                    key={btn}
                    className={`py-1 px-2 rounded text-sm font-semibold transition ${
                      filter === btn
                        ? "bg-green400 text-white"
                        : "bg-gray400 hover:bg-green400 hover:text-white"
                    }`}
                    onClick={() => {
                      setFilter(btn);
                      setCurrentPage(1);
                      setOffset(0);
                    }}
                  >
                    {btn.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto space-y-4 p-8">
              {quizAnswer?.questions?.length > 0 ? (
                quizAnswer.questions.map((item) => (
                  <div key={item.question_no} className="border rounded-lg p-4">
                    <h3 className="text-md font-semibold text-black600 mb-2">
                      {item.question_no}. {item.question_text}
                    </h3>
                    <div className="space-y-1">
                      {item.options.map((answer, aIndex) => {
                        const isSelected = item.student_answer === answer;
                        const isCorrect = item.correct_answer === answer;

                        return (
                          <label
                            key={aIndex}
                            className={`flex items-start lg:items-center space-x-2 p-1 rounded cursor-pointer ${
                              isCorrect
                                ? "bg-green100"
                                : isSelected && !isCorrect
                                ? "bg-red100"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              checked={isSelected}
                              readOnly
                              className="form-radio h-5 w-5 min-w-5 min-h-5 text-green500"
                              disabled
                            />
                            <span className="text-black600">{answer}</span>

                            {isSelected && (
                              <span
                                className={`ml-2 text-sm ${
                                  isCorrect ? "text-green600" : "text-red600"
                                }`}
                              >
                                {isCorrect ? "(Correct)" : "(Wrong)"}
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-red500">No questions found</p>
              )}
            </div>

            {/* Pagination */}
            <div className="p-8 border-t border-gray50">
              <div className="flex items-center justify-between">
                <button
                  className="py-2 px-3 leading-none rounded bg-gray400 inline-block transition hover:bg-primary hover:text-white disabled:opacity-50"
                  onClick={() => fetchAnswerPaper(offset - limit, filter)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className="py-2 px-3 leading-none rounded bg-gray400 inline-block transition hover:bg-primary hover:text-white disabled:opacity-50"
                  onClick={() => fetchAnswerPaper(offset + limit, filter)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>

              <div className="flex items-center justify-center flex-wrap gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`py-2 px-3 leading-none rounded inline-block transition ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "bg-gray400 hover:bg-primary hover:text-white"
                      }`}
                      onClick={() =>
                        fetchAnswerPaper((page - 1) * limit, filter)
                      }
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {!loading && !error && !quizAnswer && (
          <p className="text-center text-red500 mt-10">Data Not Found</p>
        )}
      </div>
    </div>
  );
};

export default QuestionsAnswerShit;

// import { useEffect, useState } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import API from "../api/API";
// import { formatDateTime } from "../utils/FormateDateTime";

// const QuestionsAnswerShit = () => {
//   const { roundId } = useParams();
//   const location = useLocation();
//   const { Id } = location.state || {};
//   const quizId = Id || roundId;

//   const [quizAnswer, setQuizAnswer] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [count, setCount] = useState(0);
//   const [limit] = useState(3);
//   const [offset, setOffset] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filter, setFilter] = useState("all");

//   const fetchAnswerPaper = async (offsetValue = 0) => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await API.get(
//         `/qzz/single-quiz-result/${quizId}/?limit=${limit}&offset=${offsetValue}`
//       );
//       const data = response?.data;

//       setQuizAnswer(data?.results);
//       setCount(data?.count);
//       setOffset(offsetValue);
//       setCurrentPage(Math.floor(offsetValue / limit) + 1);
//     } catch (err) {
//       console.error("Error fetching:", err);
//       setError("Failed to load data. Please try again.");
//       setQuizAnswer(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnswerPaper(0);
//   }, [roundId]);

//   const totalPages = Math.ceil(count / limit);

//   const getFilteredQuestions = () => {
//     if (!quizAnswer?.questions) return [];
//     return quizAnswer.questions.filter((item) => {
//       if (filter === "correct") {
//         return (
//           item.student_answer && item.student_answer === item.correct_answer
//         );
//       }
//       if (filter === "wrong") {
//         return (
//           item.student_answer && item.student_answer !== item.correct_answer
//         );
//       }
//       if (filter === "skipped") {
//         return !item.student_answer || item.student_answer === "";
//       }
//       return true;
//     });
//   };

//   const filteredQuestions = getFilteredQuestions();

//   return (
//     <div className="bg-white shadow max-w-4xl mx-auto rounded-xl my-10 h-[95vh] flex flex-col relative">
//       {/* Loading Spinner Overlay */}
//       {loading && (
//         <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green500"></div>
//         </div>
//       )}

//       {/* Error Message */}
//       {error && !loading && (
//         <p className="text-center text-red500 mt-10">{error}</p>
//       )}

//       {/* Main Content */}
//       {!loading && !error && quizAnswer && (
//         <>
//           {/* Header (fixed) */}
//           <div className="bg-gray-100 p-6 rounded-tl-xl rounded-tr-xl flex-shrink-0 sticky top-0 z-10 shadow-sm">
//             {/* Back Button */}
//             <div className="flex justify-start mb-2">
//               <Link
//                 className="py-1.5 px-3 rounded bg-gray200 text-black600 font-semibold text-sm transition hover:bg-primary hover:text-white"
//                 to="/student/dashboard"
//               >
//                 Back to Quiz Table
//               </Link>
//             </div>

//             {/* Quiz Info */}
//             <div className="text-center space-y-1">
//               <h2 className="text-xl font-semibold text-black600">
//                 {quizAnswer?.quiz_details?.announcement_name}
//               </h2>
//               <h3 className="text-md font-semibold text-black600">
//                 Round: {quizAnswer?.quiz_details?.round_name}
//               </h3>
//               <h4 className="text-sm font-medium text-black600">
//                 Subject: {quizAnswer?.quiz_details?.topic_subject}
//               </h4>
//               <h4 className="text-sm font-medium text-black600">
//                 EXAM DATE:{" "}
//                 {formatDateTime(quizAnswer?.quiz_details?.completed_at)}
//               </h4>
//             </div>

//             {/* Subject & Total Questions */}
//             <div className="flex items-center justify-between mt-4 text-sm font-medium text-black600">
//               <span>Subject: {quizAnswer?.quiz_details?.topic_subject}</span>
//               <span>
//                 Total Questions: {quizAnswer?.quiz_details?.total_question}
//               </span>
//             </div>

//             {/* Filter Buttons */}
//             <div className="flex items-center justify-center gap-2 mt-3">
//               {["all", "correct", "wrong", "skipped"].map((btn) => (
//                 <button
//                   key={btn}
//                   className={`py-1 px-2 rounded text-sm font-semibold transition ${
//                     filter === btn
//                       ? "bg-green400 text-white"
//                       : "bg-gray400 hover:bg-green400 hover:text-white"
//                   }`}
//                   onClick={() => setFilter(btn)}
//                 >
//                   {btn.toUpperCase()}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Quiz Questions (scrollable) */}
//           <div className="flex-1 overflow-y-auto space-y-4 p-8">
//             {filteredQuestions.length > 0 ? (
//               filteredQuestions.map((item) => (
//                 <div key={item.question_no} className="border rounded-lg p-4">
//                   <h3 className="text-md font-semibold text-black600 mb-2">
//                     {item.question_no}. {item.question_text}
//                   </h3>
//                   <div className="space-y-1">
//                     {item.options.map((answer, aIndex) => {
//                       const isSelected = item.student_answer === answer;
//                       const isCorrect = item.correct_answer === answer;

//                       return (
//                         <label
//                           key={aIndex}
//                           className={`flex items-center space-x-2 p-1 rounded cursor-pointer ${
//                             filter !== "skipped" && isCorrect
//                               ? "bg-green100"
//                               : isSelected && !isCorrect
//                               ? "bg-red100"
//                               : ""
//                           }`}
//                         >
//                           <input
//                             type="radio"
//                             checked={isSelected}
//                             readOnly
//                             className="form-radio h-5 w-5 text-green500"
//                             disabled
//                           />
//                           <span className="text-black600">{answer}</span>

//                           {isSelected && filter !== "skipped" && (
//                             <span
//                               className={`ml-2 text-sm ${
//                                 isCorrect ? "text-green600" : "text-red600"
//                               }`}
//                             >
//                               {isCorrect ? "(Correct)" : "(Wrong)"}
//                             </span>
//                           )}
//                         </label>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-red500">No questions found</p>
//             )}
//           </div>

//           {/* Pagination */}
//           <div className="p-8 border-t border-gray50">
//             <div className="flex items-center justify-between  flex-shrink-0">
//               <button
//                 className="py-2 px-3 leading-none rounded bg-gray400 inline-block transition hover:bg-primary hover:text-white disabled:opacity-50"
//                 onClick={() => fetchAnswerPaper(offset - limit)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//               <button
//                 className="py-2 px-3 leading-none rounded bg-gray400 inline-block transition hover:bg-primary hover:text-white disabled:opacity-50"
//                 onClick={() => fetchAnswerPaper(offset + limit)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>

//             <div className="flex items-center justify-center flex-wrap gap-1  flex-shrink-0">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     className={`py-2 px-3 leading-none rounded inline-block transition ${
//                       currentPage === page
//                         ? "bg-primary text-white"
//                         : "bg-gray400 hover:bg-primary hover:text-white"
//                     }`}
//                     onClick={() => fetchAnswerPaper((page - 1) * limit)}
//                   >
//                     {page}
//                   </button>
//                 )
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {/* Data Not Found */}
//       {!loading && !error && !quizAnswer && (
//         <p className="text-center text-red500 mt-10">Data Not Found</p>
//       )}
//     </div>
//   );
// };

// export default QuestionsAnswerShit;

// import { useEffect, useState } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import API from "../api/API";
// import { formatDateTime } from "../utils/FormateDateTime";

// const QuestionsAnswerShit = () => {
//   const { roundId } = useParams();
//   const location = useLocation();
//   const { Id } = location.state || {};
//   const quizId = Id || roundId;

//   const [quizAnswer, setQuizAnswer] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [count, setCount] = useState(0);
//   const [limit] = useState(3);
//   const [offset, setOffset] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filter, setFilter] = useState("all");

//   const fetchAnswerPaper = async (offsetValue = 0) => {
//     try {
//       setLoading(true);
//       const response = await API.get(
//         `/qzz/single-quiz-result/${quizId}/?limit=${limit}&offset=${offsetValue}`
//       );
//       const data = response?.data;

//       setQuizAnswer(data?.results);
//       setCount(data?.count);
//       setOffset(offsetValue);
//       setCurrentPage(Math.floor(offsetValue / limit) + 1);
//     } catch (err) {
//       console.log("Error fetching:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnswerPaper(0);
//   }, [roundId]);

//   const totalPages = Math.ceil(count / limit);

//   const getFilteredQuestions = () => {
//     if (!quizAnswer?.questions) return [];
//     return quizAnswer.questions.filter((item) => {
//       if (filter === "correct") {
//         return (
//           item.student_answer && item.student_answer === item.correct_answer
//         );
//       }
//       if (filter === "wrong") {
//         return (
//           item.student_answer && item.student_answer !== item.correct_answer
//         );
//       }
//       if (filter === "skipped") {
//         return !item.student_answer || item.student_answer === "";
//       }
//       return true;
//     });
//   };

//   const filteredQuestions = getFilteredQuestions();

//   return (
//     <div className="bg-white shadow max-w-4xl mx-auto rounded-xl my-10 h-[95vh] flex flex-col">
//       {loading && <p>Loading...</p>}

//       {quizAnswer ? (
//         <>
//           {/* Header (fixed) */}
//           <div className="bg-gray-100 p-6 rounded-tl-xl rounded-tr-xl flex-shrink-0 sticky top-0 z-10 shadow-sm">
//             {/* Back Button */}
//             <div className="flex justify-start mb-2">
//               <Link
//                 className="py-1.5 px-3 rounded bg-gray200 text-black600 font-semibold text-sm transition hover:bg-primary hover:text-white"
//                 to="/student/dashboard"
//               >
//                 Back to Quiz Table
//               </Link>
//             </div>

//             {/* Quiz Info */}
//             <div className="text-center space-y-1">
//               <h2 className="text-xl font-semibold text-black600">
//                 {quizAnswer?.quiz_details?.announcement_name}
//               </h2>
//               <h3 className="text-md font-semibold text-black600">
//                 Round: {quizAnswer?.quiz_details?.round_name}
//               </h3>
//               <h4 className="text-sm font-medium text-black600">
//                 Subject: {quizAnswer?.quiz_details?.topic_subject}
//               </h4>
//               <h4 className="text-sm font-medium text-black600">
//                 EXAM DATE:{" "}
//                 {formatDateTime(quizAnswer?.quiz_details?.completed_at)}
//               </h4>
//             </div>

//             {/* Subject & Total Questions */}
//             <div className="flex items-center justify-between mt-4 text-sm font-medium text-black600">
//               <span>Subject: {quizAnswer?.quiz_details?.topic_subject}</span>
//               <span>
//                 Total Questions: {quizAnswer?.quiz_details?.total_question}
//               </span>
//             </div>

//             {/* Filter Buttons */}
//             <div className="flex items-center justify-center gap-2 mt-3">
//               {["all", "correct", "wrong", "skipped"].map((btn) => (
//                 <button
//                   key={btn}
//                   className={`py-1 px-2 rounded text-sm font-semibold transition ${
//                     filter === btn
//                       ? "bg-green400 text-white"
//                       : "bg-gray400 hover:bg-green400 hover:text-white"
//                   }`}
//                   onClick={() => setFilter(btn)}
//                 >
//                   {btn.toUpperCase()}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Quiz Questions (scrollable) */}
//           <div className="flex-1 overflow-y-auto space-y-4 p-8">
//             {filteredQuestions.length > 0 ? (
//               filteredQuestions.map((item) => (
//                 <div key={item.question_no} className="border rounded-lg p-4">
//                   <h3 className="text-md font-semibold text-black600 mb-2">
//                     {item.question_no}. {item.question_text}
//                   </h3>
//                   <div className="space-y-1">
//                     {item.options.map((answer, aIndex) => {
//                       const isSelected = item.student_answer === answer;
//                       const isCorrect = item.correct_answer === answer;

//                       return (
//                         <label
//                           key={aIndex}
//                           className={`flex items-center space-x-2 p-1 rounded cursor-pointer ${
//                             filter !== "skipped" && isCorrect
//                               ? "bg-green100"
//                               : isSelected && !isCorrect
//                               ? "bg-red100"
//                               : ""
//                           }`}
//                         >
//                           <input
//                             type="radio"
//                             checked={isSelected}
//                             readOnly
//                             className="form-radio h-5 w-5 text-green500"
//                             disabled
//                           />
//                           <span className="text-black600">{answer}</span>

//                           {isSelected && filter !== "skipped" && (
//                             <span
//                               className={`ml-2 text-sm ${
//                                 isCorrect ? "text-green600" : "text-red600"
//                               }`}
//                             >
//                               {isCorrect ? "(Correct)" : "(Wrong)"}
//                             </span>
//                           )}
//                         </label>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-red500">No questions found</p>
//             )}
//           </div>

//           <div className="p-8 border-t border-gray50">
//             {/* Pagination buttons */}
//             <div className="flex items-center justify-between  flex-shrink-0">
//               <button
//                 className="py-2 px-3 leading-none rounded bg-gray400 inline-block transition hover:bg-primary hover:text-white disabled:opacity-50"
//                 onClick={() => fetchAnswerPaper(offset - limit)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//               <button
//                 className="py-2 px-3 leading-none rounded bg-gray400 inline-block transition hover:bg-primary hover:text-white disabled:opacity-50"
//                 onClick={() => fetchAnswerPaper(offset + limit)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>

//             {/* Pagination page number list */}
//             <div className="flex items-center justify-center flex-wrap gap-1  flex-shrink-0">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     className={`py-2 px-3 leading-none rounded inline-block transition ${
//                       currentPage === page
//                         ? "bg-primary text-white"
//                         : "bg-gray400 hover:bg-primary hover:text-white"
//                     }`}
//                     onClick={() => fetchAnswerPaper((page - 1) * limit)}
//                   >
//                     {page}
//                   </button>
//                 )
//               )}
//             </div>
//           </div>
//         </>
//       ) : (
//         !loading && <p>Data Not Found</p>
//       )}
//     </div>
//   );
// };

// export default QuestionsAnswerShit;
