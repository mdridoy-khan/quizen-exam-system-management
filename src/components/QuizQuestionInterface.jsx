import { useCallback, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import API from "../api/API";

const QuizQuestionInterface = ({
  tutorData,
  questions,
  onClose,
  onSelectionChange,
  selectedQuestions,
  roundId,
  setQuestionsIds,
}) => {
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format incoming questions
  useEffect(() => {
    if (questions) {
      const formattedQuestions = questions.map((q) => ({
        id: q.id,
        question: q.question_text,
        options: q.options.map((opt, index) => ({
          id: String.fromCharCode(65 + index),
          content: opt,
        })),
        isChecked: selectedQuestions.includes(q.id) || q.is_selected,
      }));
      setQuestionList(formattedQuestions);
    }
  }, [questions, selectedQuestions]);

  const handleSelectionChange = useCallback(
    (tutorId, selectedIds) => {
      if (onSelectionChange && tutorId) {
        onSelectionChange(tutorId, selectedIds);
      }
    },
    [onSelectionChange]
  );

  // Just update local state, no API call
  const handleQuestionCheck = (questionId, checked) => {
    setQuestionList((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, isChecked: checked } : q))
    );
  };

  // Only called once when user clicks “Select”
  const submitSelectedQuestions = async (
    roundId,
    selectedIds,
    unselectedIds,
    tutorData
  ) => {
    if (!tutorData?.id) {
      console.error("Tutor ID is undefined");
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        selected_question_ids: selectedIds,
        unselected_question_ids: unselectedIds,
      };

      const response = await API.post(
        `/anc/select-quiz-question/round/${roundId}/quiz/${tutorData.id}/`,
        payload
      );

      console.log("Submit response:", response.data);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Failed to submit questions", err);
      setError("Failed to submit questions. Please try again.");
      setLoading(false);
      return false;
    }
  };

  // Loading Spinner
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black600 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-3xl text-primary" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center m-6">
      <div className="w-full max-w-2xl h-[450px] sm:h-[500] md:h-[550px] lg:h-[600px] xl:h-[600px] 2xl:h-[800px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-primary p-5 sm:p-6 text-white rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-semibold">
                Name: {tutorData.tutor_name}
              </h2>
              <p className="text-sm sm:text-base">
                Institute: {tutorData.tutor_institution}
              </p>
              <p className="text-sm sm:text-base">
                Department: {tutorData.tutor_department}
              </p>
              <p className="text-sm sm:text-base">
                City: {tutorData.tutor_upazila}
              </p>
              <p className="text-sm sm:text-base">
                Experience: {tutorData.tutor_experience || "N/A"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white text-2xl hover:text-gray-200 transition-colors"
            >
              <IoClose />
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm sm:text-base font-semibold">
              Subject: {tutorData.subject_name}
            </p>
            <p className="text-sm sm:text-base font-semibold">
              Total Question: {questions.length}
            </p>
          </div>
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-gray-50">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded mb-4">
              {error}
            </div>
          )}

          {questionList.map((question, idx) => (
            <div
              key={question.id}
              className="border border-gray-300 rounded-lg p-5 bg-white shadow-sm"
            >
              <div className="flex items-start gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={question.isChecked}
                  onChange={(e) =>
                    handleQuestionCheck(question.id, e.target.checked)
                  }
                  className="mt-1 w-5 h-5 accent-primary cursor-pointer"
                />
                <p className="flex-1 text-gray-800 font-medium leading-snug">
                  {idx + 1}. {question.question}
                </p>
              </div>

              <div className="space-y-2">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className="p-3 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-600">
                        {option.id}.
                      </span>
                      <span className="bg-white px-3 py-1 rounded text-sm font-mono border border-gray-200">
                        {option.content}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={async () => {
              const selectedIds = questionList
                .filter((q) => q.isChecked)
                .map((q) => q.id);

              const unselectedIds = questionList
                .filter((q) => !q.isChecked)
                .map((q) => q.id);

              const success = await submitSelectedQuestions(
                roundId,
                selectedIds,
                unselectedIds,
                tutorData
              );

              if (success) {
                handleSelectionChange(tutorData.id, selectedIds);
                onClose();
              }
            }}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestionInterface;

// import { useCallback, useEffect, useState } from "react";
// import { FaSpinner } from "react-icons/fa";
// import API from "../api/API";

// const QuizQuestionInterface = ({
//   tutorData,
//   questions,
//   onClose,
//   onSelectionChange,
//   selectedQuestions,
//   roundId,
// }) => {
//   const [questionList, setQuestionList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (questions) {
//       const formattedQuestions = questions.map((q) => ({
//         id: q.id,
//         question: q.question_text,
//         options: q.options.map((opt, index) => ({
//           id: String.fromCharCode(65 + index),
//           content: opt,
//         })),
//         isChecked: selectedQuestions.includes(q.id) || q.is_selected,
//       }));
//       setQuestionList(formattedQuestions);
//     }
//   }, [questions, selectedQuestions]);

//   const handleSelectionChange = useCallback(
//     (tutorId, selectedIds) => {
//       if (onSelectionChange && tutorId) {
//         onSelectionChange(tutorId, selectedIds);
//       }
//     },
//     [onSelectionChange]
//   );

//   const handleQuestionCheck = async (questionId, checked) => {
//     setQuestionList((prev) => {
//       const updatedList = prev.map((q) =>
//         q.id === questionId ? { ...q, isChecked: checked } : q
//       );

//       const selectedIds = updatedList
//         .filter((q) => q.isChecked)
//         .map((q) => q.id);

//       const unselectedIds = updatedList
//         .filter((q) => !q.isChecked)
//         .map((q) => q.id);

//       submitSelectedQuestions(roundId, selectedIds, unselectedIds, tutorData);

//       return updatedList;
//     });
//   };

//   const submitSelectedQuestions = async (
//     roundId,
//     selectedIds,
//     unselectedIds,
//     tutorData
//   ) => {
//     if (!tutorData?.id) {
//       console.error("Tutor ID is undefined");
//       return false;
//     }
//     setLoading(true);
//     setError(null);
//     try {
//       const payload = {
//         selected_question_ids: selectedIds,
//         unselected_question_ids: unselectedIds,
//       };

//       const response = await API.post(
//         `/anc/select-quiz-question/round/${roundId}/quiz/${tutorData.id}/`,
//         payload
//       );

//       console.log("Submit response:", response.data);
//       setLoading(false);
//       return true;
//     } catch (err) {
//       console.error("Failed to submit questions", err);
//       setError("Failed to submit questions. Please try again.");
//       setLoading(false);
//       return false;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black600 bg-opacity-50 z-50">
//         <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
//           <FaSpinner className="animate-spin text-3xl text-primary" />
//           <span>Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black600 bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="w-full max-w-2xl h-[550px] 2xl:h-[800px] bg-white rounded-lg shadow-2xl flex flex-col">
//         <div className="bg-primary p-6 rounded-t-lg text-white">
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-lg font-semibold">
//                 Name: {tutorData.tutor_name}
//               </h2>
//               <p className="text-base">
//                 Institute: {tutorData.tutor_institution}
//               </p>
//               <p className="text-base">
//                 Department: {tutorData.tutor_department}
//               </p>
//               <p className="text-base">City: {tutorData.tutor_upazila}</p>
//               <p className="text-base">
//                 Experience: {tutorData.tutor_experience || "N/A"}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-white text-xl hover:text-gray300"
//             >
//               ✕
//             </button>
//           </div>
//           <div className="flex items-center justify-between mt-4">
//             <p className="text-base font-semibold">
//               Subject: {tutorData.subject_name}
//             </p>
//             <p className="text-base font-semibold">
//               Total Question: {questions.length}
//             </p>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           {error && (
//             <div className="p-3 bg-red100 text-red700 border border-red300 rounded mb-4">
//               {error}
//             </div>
//           )}

//           {questionList.map((question, idx) => (
//             <div
//               key={question.id}
//               className="border border-gray300 rounded-lg p-6 bg-gray50"
//             >
//               <div className="flex items-start gap-3 mb-4">
//                 <input
//                   type="checkbox"
//                   checked={question.isChecked}
//                   onChange={(e) =>
//                     handleQuestionCheck(question.id, e.target.checked)
//                   }
//                   className="mt-1 flex-shrink-0"
//                 />
//                 <div className="flex-1">
//                   <p className="text-gray800 font-medium">
//                     {idx + 1}. {question.question}
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 {question.options.map((option) => (
//                   <div
//                     key={option.id}
//                     className="p-3 rounded-lg border border-gray300 bg-white"
//                   >
//                     <div className="flex items-center gap-3">
//                       <span className="font-semibold min-w-[20px]">
//                         {option.id}.
//                       </span>
//                       <span className="font-mono bg-gray100 px-2 py-1 rounded text-sm">
//                         {option.content}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="p-6 border-t border-gray300 flex-shrink-0">
//           <button
//             onClick={async () => {
//               const selectedIds = questionList
//                 .filter((q) => q.isChecked)
//                 .map((q) => q.id);

//               const unselectedIds = questionList
//                 .filter((q) => !q.isChecked)
//                 .map((q) => q.id);

//               const success = await submitSelectedQuestions(
//                 roundId,
//                 selectedIds,
//                 unselectedIds,
//                 tutorData
//               );

//               if (success) {
//                 handleSelectionChange(tutorData.id, selectedIds);
//                 onClose();
//               }
//             }}
//             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary transition-colors"
//           >
//             Select
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizQuestionInterface;

// import { useCallback, useEffect, useState } from "react";
// import API from "../api/API";

// const QuizQuestionInterface = ({
//   tutorData,
//   questions,
//   onClose,
//   loading,
//   onSelectionChange,
//   selectedQuestions,
//   roundId,
// }) => {
//   const [questionList, setQuestionList] = useState([]);

//   useEffect(() => {
//     if (questions) {
//       const formattedQuestions = questions.map((q) => ({
//         id: q.id,
//         question: q.question_text,
//         options: q.options.map((opt, index) => ({
//           id: String.fromCharCode(65 + index),
//           content: opt,
//         })),
//         isChecked: selectedQuestions.includes(q.id) || q.is_selected,
//       }));
//       setQuestionList(formattedQuestions);
//     }
//   }, [questions, selectedQuestions]);

//   const handleSelectionChange = useCallback(
//     (tutorId, selectedIds) => {
//       if (onSelectionChange && tutorId) {
//         onSelectionChange(tutorId, selectedIds);
//       }
//     },
//     [onSelectionChange]
//   );

//   const handleQuestionCheck = async (questionId, checked) => {
//     setQuestionList((prev) => {
//       const updatedList = prev.map((q) =>
//         q.id === questionId ? { ...q, isChecked: checked } : q
//       );

//       const selectedIds = updatedList
//         .filter((q) => q.isChecked)
//         .map((q) => q.id);

//       const unselectedIds = updatedList
//         .filter((q) => !q.isChecked)
//         .map((q) => q.id);

//       submitSelectedQuestions(roundId, selectedIds, unselectedIds, tutorData);

//       // -handleSelectionChange(tutorData.id, selectedIds)
//       return updatedList;
//     });
//   };

//   const submitSelectedQuestions = async (
//     roundId,
//     selectedIds,
//     unselectedIds,
//     tutorData
//   ) => {
//     if (!tutorData?.id) {
//       console.error("Tutor ID is undefined");
//       return false;
//     }
//     try {
//       const payload = {
//         selected_question_ids: selectedIds,
//         unselected_question_ids: unselectedIds,
//       };

//       const response = await API.post(
//         `/anc/select-quiz-question/round/${roundId}/quiz/${tutorData.id}/`,
//         payload
//       );

//       console.log("Submit response:", response.data);
//       return true; // Return true on successful API call
//     } catch (error) {
//       console.error("Failed to submit questions", error);
//       return false; // Return false on error
//     }
//   };

//   if (loading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black600 bg-opacity-50 z-50">
//         <div className="bg-white p-6 rounded-lg shadow-lg">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black600 bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="w-full max-w-2xl h-[800px] bg-white rounded-lg shadow-2xl flex flex-col">
//         <div className="bg-primary p-6 rounded-t-lg text-white">
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-lg font-semibold">
//                 Name: {tutorData.tutor_name}
//               </h2>
//               <p className="text-base">
//                 Institute: {tutorData.tutor_institution}
//               </p>
//               <p className="text-base">
//                 Department: {tutorData.tutor_department}
//               </p>
//               <p className="text-base">City: {tutorData.tutor_upazila}</p>
//               <p className="text-base">
//                 Experience: {tutorData.tutor_experience || "N/A"}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-white text-xl hover:text-gray300"
//             >
//               ✕
//             </button>
//           </div>
//           <div className="flex items-center justify-between mt-4">
//             <p className="text-base font-semibold">
//               Subject: {tutorData.subject_name}
//             </p>
//             <p className="text-base font-semibold">
//               Total Question: {questions.length}
//             </p>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           {questionList.map((question, idx) => (
//             <div
//               key={question.id}
//               className="border border-gray300 rounded-lg p-6 bg-gray-50"
//             >
//               <div className="flex items-start gap-3 mb-4">
//                 <input
//                   type="checkbox"
//                   checked={question.isChecked}
//                   onChange={(e) =>
//                     handleQuestionCheck(question.id, e.target.checked)
//                   }
//                   className="mt-1 flex-shrink-0"
//                 />
//                 <div className="flex-1">
//                   <p className="text-gray800 font-medium">
//                     {idx + 1}. {question.question}
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 {question.options.map((option) => (
//                   <div
//                     key={option.id}
//                     className="p-3 rounded-lg border border-gray300 bg-white"
//                   >
//                     <div className="flex items-center gap-3">
//                       <span className="font-semibold min-w-[20px]">
//                         {option.id}.
//                       </span>
//                       <span className="font-mono bg-gray100 px-2 py-1 rounded text-sm">
//                         {option.content}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="p-6 border-t border-gray300 flex-shrink-0">
//           <button
//             onClick={async () => {
//               const selectedIds = questionList
//                 .filter((q) => q.isChecked)
//                 .map((q) => q.id);

//               const unselectedIds = questionList
//                 .filter((q) => !q.isChecked)
//                 .map((q) => q.id);

//               const success = await submitSelectedQuestions(
//                 roundId,
//                 selectedIds,
//                 unselectedIds,
//                 tutorData
//               );

//               if (success) {
//                 handleSelectionChange(tutorData.id, selectedIds);
//                 onClose();
//               }
//             }}
//             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue600 transition-colors"
//           >
//             Select
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizQuestionInterface;
