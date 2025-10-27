import { useCallback, useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import API from "../../api/API";
import QuizQuestionInterface from "../../components/QuizQuestionInterface";

const TutorQuestionsListTable = ({ roundId, annId, setQuestionsIds }) => {
  const [tutorQuestions, setTutorQuestions] = useState([]);
  const [questionView, setQuestionView] = useState(false);
  const [selectedTutorData, setSelectedTutorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tutorSelections, setTutorSelections] = useState({});
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    perPage: 10,
  });

  const fetchTutorQuestions = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get(
          `/anc/shared-question-shared-info/${annId}?page=${page}`
        );

        const results = response?.data?.results?.tutor_details || [];
        const totalItems = response?.data?.count || results.length;
        setQuestionsIds(results[0]?.selected_ids);
        setTutorQuestions(results);
        setPagination((prev) => ({
          ...prev,
          total: totalItems,
          current: page,
        }));
      } catch (err) {
        console.error("Failed to fetch tutors:", err);
        setError("Failed to fetch tutors. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [annId]
  );

  useEffect(() => {
    fetchTutorQuestions();
  }, [fetchTutorQuestions]);

  const handleQuestionView = async (tutorId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(
        `/anc/tutor-shared-anc-quiz-set/${tutorId}`
      );
      setSelectedTutorData(response.data);
      setQuestionView(true);
    } catch (err) {
      console.error("Failed to fetch tutor quiz:", err);
      setError("Failed to fetch tutor quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setQuestionView(false);
    setSelectedTutorData(null);
    fetchTutorQuestions(pagination.current);
  };

  const handleQuestionSelectChange = (tutorId, selectedQuestions) => {
    setTutorSelections((prev) => ({
      ...prev,
      [tutorId]: selectedQuestions,
    }));

    setTutorQuestions((prev) =>
      prev.map((tutor) =>
        tutor.id === tutorId
          ? { ...tutor, selected_qs_number: selectedQuestions.length }
          : tutor
      )
    );
  };

  const totalPages = Math.ceil(pagination.total / pagination.perPage);

  const totalSelected = tutorQuestions.reduce(
    (sum, tutor) => sum + (tutor.selected_qs_number || 0),
    0
  );

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl xl:text-4xl font-semibold mb-6 sm:mb-8">
        Shared Tutor List
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Responsive Table Wrapper */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-300">
        <table className="min-w-full text-sm sm:text-base">
          <thead>
            <tr className="bg-[#E5F0FF] text-left text-gray-800">
              <th className="px-3 sm:px-4 py-2 border whitespace-nowrap">SL</th>
              <th className="px-3 sm:px-4 py-2 border whitespace-nowrap">
                Tutor Name
              </th>
              <th className="px-3 sm:px-4 py-2 border whitespace-nowrap hidden sm:table-cell">
                Institution
              </th>
              <th className="px-3 sm:px-4 py-2 border whitespace-nowrap hidden md:table-cell">
                Department
              </th>
              <th className="px-3 sm:px-4 py-2 border whitespace-nowrap text-center">
                Selected
              </th>
              <th className="px-3 sm:px-4 py-2 border whitespace-nowrap text-center">
                View
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </td>
              </tr>
            ) : tutorQuestions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No tutors found.
                </td>
              </tr>
            ) : (
              tutorQuestions.map((tutor, index) => (
                <tr
                  key={tutor.id}
                  className="hover:bg-[#E5F0FF] transition-colors duration-150"
                >
                  <td className="px-3 sm:px-4 py-2 border text-gray-700">
                    {(pagination.current - 1) * pagination.perPage + index + 1}
                  </td>
                  <td className="px-3 sm:px-4 py-2 border text-gray-800 font-medium whitespace-nowrap">
                    {tutor.tutor_name}
                  </td>
                  <td className="px-3 sm:px-4 py-2 border hidden sm:table-cell text-gray-600 truncate max-w-[150px]">
                    {tutor.tutor_institution}
                  </td>
                  <td className="px-3 sm:px-4 py-2 border hidden md:table-cell text-gray-600 truncate max-w-[150px]">
                    {tutor.tutor_department}
                  </td>
                  <td className="px-3 sm:px-4 py-2 border text-center">
                    <span className="text-primary text-lg font-semibold">
                      {tutor.selected_qs_number}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2 border text-center">
                    <button
                      onClick={() => handleQuestionView(tutor.id)}
                      className="flex items-center justify-center w-full sm:w-auto"
                    >
                      <FaRegEye className="text-gray-600 text-lg sm:text-xl" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td
                className="px-3 sm:px-4 py-2 border text-gray-800"
                colSpan={4}
              >
                Total
              </td>
              <td className="px-3 sm:px-4 py-2 border text-center">
                <span className="text-primary text-lg font-semibold">
                  {totalSelected}
                </span>
              </td>
              <td className="px-3 sm:px-4 py-2 border"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center sm:justify-end mt-4 gap-2 sm:gap-3">
        <button
          onClick={() => fetchTutorQuestions(pagination.current - 1)}
          disabled={pagination.current === 1}
          className="px-3 sm:px-4 py-1 bg-gray-200 rounded text-sm sm:text-base disabled:opacity-50"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => fetchTutorQuestions(page)}
              className={`px-3 sm:px-4 py-1 rounded text-sm sm:text-base ${
                pagination.current === page
                  ? "bg-primary text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => fetchTutorQuestions(pagination.current + 1)}
          disabled={pagination.current === totalPages}
          className="px-3 sm:px-4 py-1 bg-gray-200 rounded text-sm sm:text-base disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="p-6">
        {/* Modal Section */}
        {questionView && selectedTutorData && (
          <QuizQuestionInterface
            tutorData={selectedTutorData.tutor_details}
            questions={selectedTutorData.questions}
            onClose={closeModal}
            loading={loading}
            onSelectionChange={handleQuestionSelectChange}
            selectedQuestions={
              tutorSelections[selectedTutorData.tutor_details.id] || []
            }
            // setQuestions={setQuestions}
            roundId={roundId}
            annId={annId}
          />
        )}
      </div>
    </div>
  );
};

export default TutorQuestionsListTable;

// import { useCallback, useEffect, useState } from "react";
// import { FaRegEye } from "react-icons/fa";
// import API from "../api/API";
// import QuizQuestionInterface from "./QuizQuestionInterface";

// const TutorListTable = ({ roundId, annId }) => {
//   const [tutorQuestions, setTutorQuestions] = useState([]);
//   const [questionView, setQuestionView] = useState(false);
//   const [selectedTutorData, setSelectedTutorData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [tutorSelections, setTutorSelections] = useState({});
//   const [pagination, setPagination] = useState({
//     total: 0,
//     current: 1,
//     perPage: 10,
//   });

//   const fetchTutorQuestions = useCallback(
//     async (page = 1) => {
//       setLoading(true);
//       try {
//         const response = await API.get(
//           `/anc/shared-question-shared-info/${annId}?page=${page}`
//         );
//         const results = response?.data?.results?.tutor_details || [];
//         const totalItems = response?.data?.count || results.length;

//         setTutorQuestions(results);
//         setPagination((prev) => ({
//           ...prev,
//           total: totalItems,
//           current: page,
//         }));
//       } catch (err) {
//         console.error("Failed to fetch tutors:", err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [annId]
//   );

//   useEffect(() => {
//     fetchTutorQuestions();
//   }, [fetchTutorQuestions]);

//   const handleQuestionView = async (tutorId) => {
//     setLoading(true);
//     try {
//       const response = await API.get(
//         `/anc/tutor-shared-anc-quiz-set/${tutorId}`
//       );
//       setSelectedTutorData(response.data);
//       setQuestionView(true);
//     } catch (err) {
//       console.error("Failed to fetch tutor quiz:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setQuestionView(false);
//     setSelectedTutorData(null);
//     fetchTutorQuestions(pagination.current);
//   };

//   const handleQuestionSelectChange = (tutorId, selectedQuestions) => {
//     setTutorSelections((prev) => ({
//       ...prev,
//       [tutorId]: selectedQuestions,
//     }));

//     setTutorQuestions((prev) =>
//       prev.map((tutor) =>
//         tutor.id === tutorId
//           ? { ...tutor, selected_qs_number: selectedQuestions.length }
//           : tutor
//       )
//     );
//   };

//   const totalPages = Math.ceil(pagination.total / pagination.perPage);

//   // Calculate total selected questions for footer
//   const totalSelected = tutorQuestions.reduce(
//     (sum, tutor) => sum + (tutor.selected_qs_number || 0),
//     0
//   );

//   return (
//     <div>
//       <h2 className="text-2xl xl:text-4xl font-semibold mb-8">
//         Shared Tutor List
//       </h2>

//       <table className="w-full border border-gray300 text-sm sm:text-base">
//         <thead>
//           <tr className="bg-gray200 text-left">
//             <th className="px-4 py-2 border">SL</th>
//             <th className="px-4 py-2 border">Tutor Name</th>
//             <th className="px-4 py-2 border">Institution</th>
//             <th className="px-4 py-2 border">Department</th>
//             <th className="px-4 py-2 border">Selected</th>
//             <th className="px-4 py-2 border">View</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan={6} className="px-4 py-6 text-center">
//                 <div className="inline-block w-6 h-6 border-2 border-blue500 border-t-transparent rounded-full animate-spin"></div>
//               </td>
//             </tr>
//           ) : (
//             tutorQuestions.map((tutor, index) => (
//               <tr key={tutor.id} className="hover:bg-gray100">
//                 <td className="px-4 py-2 border">
//                   {(pagination.current - 1) * pagination.perPage + index + 1}
//                 </td>
//                 <td className="px-4 py-2 border">{tutor.tutor_name}</td>
//                 <td className="px-4 py-2 border">{tutor.tutor_institution}</td>
//                 <td className="px-4 py-2 border">{tutor.tutor_department}</td>
//                 <td className="px-4 py-2 border">
//                   <span className="text-blue500 text-lg">
//                     {tutor.selected_qs_number}
//                   </span>
//                 </td>
//                 <td className="px-4 py-2 border">
//                   <button
//                     onClick={() => handleQuestionView(tutor.id)}
//                     className="flex items-center"
//                   >
//                     <FaRegEye className="text-gray600 text-xl" />
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>

//         {/* Table Footer */}
//         <tfoot>
//           <tr className="bg-gray100 font-semibold">
//             <td className="px-4 py-2 border" colSpan={4}>
//               Total
//             </td>
//             <td className="px-4 py-2 border">
//               {" "}
//               <span className="text-blue500 text-lg">{totalSelected}</span>
//             </td>
//             <td className="px-4 py-2 border"></td>
//           </tr>
//         </tfoot>
//       </table>

//       {/* Pagination Buttons */}
//       <div className="flex justify-end mt-4 gap-2">
//         <button
//           onClick={() => fetchTutorQuestions(pagination.current - 1)}
//           disabled={pagination.current === 1}
//           className="px-4 py-1 bg-gray200 rounded disabled:opacity-50"
//         >
//           Previous
//         </button>

//         {[...Array(totalPages)].map((_, i) => {
//           const page = i + 1;
//           return (
//             <button
//               key={page}
//               onClick={() => fetchTutorQuestions(page)}
//               className={`px-4 py-1 rounded ${
//                 pagination.current === page
//                   ? "bg-blue500 text-white"
//                   : "bg-gray200"
//               }`}
//             >
//               {page}
//             </button>
//           );
//         })}

//         <button
//           onClick={() => fetchTutorQuestions(pagination.current + 1)}
//           disabled={pagination.current === totalPages}
//           className="px-4 py-1 bg-gray200 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       {questionView && selectedTutorData && (
//         <QuizQuestionInterface
//           tutorData={selectedTutorData.tutor_details}
//           questions={selectedTutorData.questions}
//           onClose={closeModal}
//           loading={loading}
//           onSelectionChange={handleQuestionSelectChange}
//           selectedQuestions={
//             tutorSelections[selectedTutorData.tutor_details.id] || []
//           }
//           roundId={roundId}
//           annId={annId}
//         />
//       )}
//     </div>
//   );
// };

// export default TutorListTable;
