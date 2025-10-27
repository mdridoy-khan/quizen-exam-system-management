import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import API from "../api/API";
import { formatDateTime } from "../utils/FormateDateTime";

const QuizTable = () => {
  const [quizQuestionList, setQuizQuestionList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // pagination state
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 10;
  const totalPages = Math.ceil(count / limit);

  useEffect(() => {
    const fetchQuizList = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * limit;
        const response = await API.get(
          `/qzz/generated-quiz-list-info/?limit=${limit}&offset=${offset}`
        );
        setQuizQuestionList(response.data.results || []);
        setCount(response.data.count);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch quiz list. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizList();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewClick = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/qzz/generated-quiz-question/${id}/`);
      setSelectedQuiz(response.data.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch quiz details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-semibold mb-6 flex flex-col md:flex-row items-center gap-2 leading-none">
        Shared Question List & Status
        <span className=" bg-primary py-1 px-2 rounded text-sm lg:text-base text-white">
          Total Question {count}
        </span>
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}
      <div className="w-full">
        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm sm:text-base border-collapse">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-left text-gray-700">
              <tr>
                <th className="px-4 py-3 border">SL</th>
                <th className="px-4 py-3 border">Announcement Name</th>
                <th className="px-4 py-3 border">Quiz Subject</th>
                <th className="px-4 py-3 border">Department</th>
                <th className="px-4 py-3 border">Total Question</th>
                <th className="px-4 py-3 border">Created At</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border text-center">View</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : quizQuestionList.length > 0 ? (
                quizQuestionList.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-2 border text-center">
                      {(currentPage - 1) * limit + (index + 1)}
                    </td>
                    <td className="px-4 py-2 border font-medium text-gray-800">
                      {item.announcement_name}
                    </td>
                    <td className="px-4 py-2 border">{item.quiz_subject}</td>
                    <td className="px-4 py-2 border">{item.department_name}</td>
                    <td className="px-4 py-2 border text-center">
                      {item.total_question}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatDateTime(item.created_at)}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {item.is_selected_by_principle ? (
                        <span className="inline-block text-xs font-semibold text-white bg-green-500 px-3 py-1 rounded-full">
                          Accepted
                        </span>
                      ) : (
                        <span className="inline-block text-xs font-semibold text-white bg-yellow-500 px-3 py-1 rounded-full">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all">
                        <AiOutlineEye
                          size={20}
                          className="text-primary cursor-pointer"
                          onClick={() => handleViewClick(item.id)}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No Quiz Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="overflow-x-auto">
        <table className="border border-gray300 text-sm sm:text-base w-full">
          <thead className="bg-gray100 text-left">
            <tr>
              <th className="px-4 py-2 border">SL</th>
              <th className="px-4 py-2 border">Announcement Name</th>
              <th className="px-4 py-2 border">Quiz Subject</th>
              <th className="px-4 py-2 border">Department</th>
              <th className="px-4 py-2 border">Total Question</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">View</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  <div className="flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : quizQuestionList.length > 0 ? (
              quizQuestionList.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray50 transition-colors"
                >
                  <td className="px-4 py-2 border text-center">
                    {(currentPage - 1) * limit + (index + 1)}
                  </td>
                  <td className="px-4 py-2 border">{item.announcement_name}</td>
                  <td className="px-4 py-2 border">{item.quiz_subject}</td>
                  <td className="px-4 py-2 border">{item.department_name}</td>
                  <td className="px-4 py-2 border">{item.total_question}</td>
                  <td className="px-4 py-2 border">
                    {formatDateTime(item.created_at)}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.is_selected_by_principle ? (
                      <p className="font-medium text-sm text-white bg-green400 py-1 px-2 rounded-lg">
                        Accepted
                      </p>
                    ) : (
                      <p className="font-medium text-sm text-white text-center bg-yellow400 py-1 px-2 rounded-lg">
                        Pending
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <AiOutlineEye
                      size={20}
                      className="text-primary cursor-pointer"
                      onClick={() => handleViewClick(item.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-white">
                  No Quiz Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border ${
            currentPage === 1
              ? "bg-gray-100 text-black cursor-not-allowed"
              : "bg-primary hover:bg-primary text-white"
          }`}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded border ${
                currentPage === pageNum
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-100 hover:bg-primary text-black"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border ${
            currentPage === totalPages
              ? "bg-gray-100 text-black cursor-not-allowed"
              : "bg-primary hover:bg-primary text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && selectedQuiz && (
        <div className="fixed inset-0 flex items-center justify-center bg-black600 bg-opacity-50 z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray600 hover:text-red500 text-xl font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {selectedQuiz.announcement_name}
              </h2>
              <p className="text-gray600">
                Subject:{" "}
                <span className="font-bold text-primary">
                  {selectedQuiz.subject}
                </span>{" "}
                | Total Questions:{" "}
                <span className="font-bold text-primary">
                  {selectedQuiz.total_question}
                </span>
              </p>
            </div>

            <div className="space-y-6">
              {selectedQuiz.questions.map((q) => (
                <div
                  key={q.id}
                  className="border-b p-4 bg-white rounded-lg shadow"
                >
                  <h3 className="font-semibold mb-2">
                    {q.question_no}. {q.question_text}
                  </h3>
                  <ul className="list-decimal pl-6 space-y-1">
                    {q.options.map((opt, idx) => (
                      <li key={idx} className="text-gray700">
                        {opt}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-green-600">
                    Correct Answer:{" "}
                    <span className="font-medium">{q.correct_answer}</span>
                  </p>
                  <p className="mt-1 text-white text-sm">{q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTable;

// import { useEffect, useState } from "react";
// import { AiOutlineEye } from "react-icons/ai";
// import API from "../api/API";
// import { formatDateTime } from "../utils/FormateDateTime";

// const QuizTable = () => {
//   const [quizQuestionList, setQuizQuestionList] = useState([]);
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // pagination state
//   const [count, setCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const limit = 10;
//   const totalPages = Math.ceil(count / limit);

//   useEffect(() => {
//     const fetchQuizList = async () => {
//       try {
//         setLoading(true);
//         const offset = (currentPage - 1) * limit;
//         const response = await API.get(
//           `/qzz/generated-quiz-list-info/?limit=${limit}&offset=${offset}`
//         );
//         setQuizQuestionList(response.data.results || []);
//         setCount(response.data.count);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuizList();
//   }, [currentPage]);

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const handleViewClick = async (id) => {
//     try {
//       const response = await API.get(`/qzz/generated-quiz-question/${id}/`);
//       setSelectedQuiz(response.data.data);
//       setIsModalOpen(true);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedQuiz(null);
//   };

//   return (
//     <div className="w-full">
//       <h2 className="text-xl lg:text-2xl xl:text-4xl font-semibold mb-6 flex items-center gap-2 leading-none">
//         Shared Question List & Status
//         <span className=" bg-primary py-1 px-2 rounded-lg text-base mt-2 text-white">
//           Total Question {count}
//         </span>
//       </h2>
//       <div className="overflow-x-auto">
//         <table className="border border-gray300 text-sm sm:text-base w-full">
//           <thead className="bg-gray100 text-left">
//             <tr>
//               <th className="px-4 py-2 border">SL</th>
//               <th className="px-4 py-2 border">Announcement Name</th>
//               <th className="px-4 py-2 border">Quiz Subject</th>
//               <th className="px-4 py-2 border">Department</th>
//               <th className="px-4 py-2 border">Total Question</th>
//               <th className="px-4 py-2 border">Created At</th>
//               <th className="px-4 py-2 border">Status</th>
//               <th className="px-4 py-2 border">View</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="8" className="text-center py-6">
//                   {/* Spinner */}
//                   <div className="flex justify-center items-center">
//                     <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
//                   </div>
//                 </td>
//               </tr>
//             ) : quizQuestionList.length > 0 ? (
//               quizQuestionList.map((item, index) => (
//                 <tr
//                   key={item.id}
//                   className="border-t hover:bg-gray50 transition-colors"
//                 >
//                   <td className="px-4 py-2 border text-center">
//                     {(currentPage - 1) * limit + (index + 1)}
//                   </td>
//                   <td className="px-4 py-2 border">{item.announcement_name}</td>
//                   <td className="px-4 py-2 border">{item.quiz_subject}</td>
//                   <td className="px-4 py-2 border">{item.department_name}</td>
//                   <td className="px-4 py-2 border">{item.total_question}</td>
//                   <td className="px-4 py-2 border">
//                     {formatDateTime(item.created_at)}
//                   </td>
//                   <td className="px-4 py-2 border">
//                     {item.is_selected_by_principle ? (
//                       <p className="font-medium text-sm text-white bg-green400 py-1 px-2 rounded-lg">
//                         Accepted
//                       </p>
//                     ) : (
//                       <p className="font-medium text-sm text-white text-center bg-yellow400 py-1 px-2 rounded-lg">
//                         Pending
//                       </p>
//                     )}
//                   </td>
//                   <td className="px-4 py-2 border text-center">
//                     <AiOutlineEye
//                       size={20}
//                       className="text-primary cursor-pointer"
//                       onClick={() => handleViewClick(item.id)}
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center py-4 text-white">
//                   No Quiz Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
//         {/* Previous Button */}
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className={`px-3 py-1 rounded border ${
//             currentPage === 1
//               ? "bg-primary text-white cursor-not-allowed"
//               : "bg-gray100 hover:bg-primary"
//           }`}
//         >
//           Previous
//         </button>

//         {/* Number Buttons */}
//         {[...Array(totalPages)].map((_, index) => {
//           const pageNum = index + 1;
//           return (
//             <button
//               key={pageNum}
//               onClick={() => handlePageChange(pageNum)}
//               className={`px-3 py-1 rounded border ${
//                 currentPage === pageNum
//                   ? "bg-primary text-white border-primary"
//                   : "bg-gray100 hover:bg-primary"
//               }`}
//             >
//               {pageNum}
//             </button>
//           );
//         })}

//         {/* Next Button */}
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className={`px-3 py-1 rounded border ${
//             currentPage === totalPages
//               ? "bg-primary text-white cursor-not-allowed"
//               : "bg-gray100 hover:bg-primary"
//           }`}
//         >
//           Next
//         </button>
//       </div>

//       {/* Modal */}
//       {isModalOpen && selectedQuiz && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black600 bg-opacity-50 z-50">
//           <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
//             <button
//               onClick={closeModal}
//               className="absolute top-3 right-3 text-gray600 hover:text-red500 text-xl font-bold"
//             >
//               ✕
//             </button>

//             <div className="text-center mb-6">
//               <h2 className="text-2xl font-bold mb-2">
//                 {selectedQuiz.announcement_name}
//               </h2>
//               <p className="text-gray600">
//                 Subject:{" "}
//                 <span className="font-bold">{selectedQuiz.subject}</span> |
//                 Total Questions:{" "}
//                 <span className="font-bold">{selectedQuiz.total_question}</span>
//               </p>
//             </div>

//             <div className="space-y-6">
//               {selectedQuiz.questions.map((q) => (
//                 <div key={q.id} className="border-b p-4 bg-gray100 rounded-lg">
//                   <h3 className="font-semibold mb-2">
//                     {q.question_no}. {q.question_text}
//                   </h3>
//                   <ul className="list-decimal pl-6 space-y-1">
//                     {q.options.map((opt, idx) => (
//                       <li key={idx} className="text-gray700">
//                         {opt}
//                       </li>
//                     ))}
//                   </ul>
//                   <p className="mt-2 text-green-600">
//                     Correct Answer:{" "}
//                     <span className="font-medium">{q.correct_answer}</span>
//                   </p>
//                   <p className="mt-1 text-white text-sm">{q.explanation}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizTable;
