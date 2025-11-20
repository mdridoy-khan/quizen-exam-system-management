import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import API from "../api/API";
import { formatDateTime } from "../utils/FormateDateTime";

const RoundQualifyList = ({
  roundId,
  nextRoundQualifier,
  topicSubject,
  confirmNextRound,
  roundName,
}) => {
  const [participate, setParticipate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  // confirm next round state
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState(null);
  const [confirmResult, setConfirmResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmStage, setConfirmStage] = useState(false);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // search state
  const [searchTerm, setSearchTerm] = useState("");

  // console.log("roundName", roundName);

  // fetch participate data (default load)
  useEffect(() => {
    const getParticipate = async () => {
      if (!roundId) return;
      setLoading(true);
      setError(null);

      try {
        const response = await API.get(
          `/qzz/round-participant-list/${roundId}/`
        );
        setParticipate(response.data.results || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load participants. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getParticipate();
  }, [roundId]);

  // fetch participate data with search
  useEffect(() => {
    const getSearchParticipate = async () => {
      if (!roundId) return;
      setSearchLoading(true);
      setError(null);
      try {
        const url =
          searchTerm.trim() !== ""
            ? `/qzz/round-participant-list/${roundId}/?keyword=${searchTerm}`
            : `/qzz/round-participant-list/${roundId}/`;
        const response = await API.get(url);
        setParticipate(response.data.results || []);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setError("Search failed. Please try again.");
      } finally {
        setSearchLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      getSearchParticipate();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [roundId, searchTerm]);

  // handle confirm next round API call
  const handleConfirmNextRound = async () => {
    setConfirmLoading(true);
    setConfirmError(null);
    try {
      const response = await API.post(
        `/qzz/select-next-round-participant/${roundId}/`
      );
      setConfirmResult(response.data);
      setConfirmStage(false);
    } catch (err) {
      setConfirmError(
        err?.response?.data?.error || "Something went wrong! Please try again."
      );
      setConfirmStage(false);
    } finally {
      setConfirmLoading(false);
    }
  };

  // handle click of main button (show confirmation modal)
  const handleShowConfirmModal = () => {
    setConfirmResult(null);
    setConfirmError(null);
    setConfirmStage(true);
    setShowModal(true);
  };

  // pagination handle
  const totalPages = Math.ceil(participate.length / pageSize);
  const paginatedData = participate.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-4 border-gray300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  // console.log("participate list", participate);
  return (
    <div className="space-y-4  bg-white shadow p-4 rounded-lg">
      {error && (
        <div className="bg-red100 text-red700 px-4 py-2 rounded">{error}</div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <button className="bg-yellow500 flex mb-4 md:mb-0 items-center gap-1 rounded-lg p-1 text-sm font-semibold text-black ">
            <HiOutlineExclamationCircle size={20} />
            NEXT ROUND QUALIFY {nextRoundQualifier} PARTICIPANT
          </button>
          <h3 className="text-base font-semibold text-secondary mt-2">
            Round Name: {roundName}
          </h3>
          <h3 className="text-base font-semibold text-secondary mt-2">
            Subject: {topicSubject}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <form action="#" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search by name, email, or number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-secondary rounded-lg py-1 px-2 shadow-none outline-none transition"
            />
          </form>
          <button
            onClick={
              !confirmNextRound && participate?.length > 0
                ? handleShowConfirmModal
                : undefined
            }
            disabled={
              confirmNextRound || participate?.length === 0 || confirmLoading
            }
            className="bg-green-500 p-2 rounded-md text-[12px] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirmNextRound
              ? "Already Confirm Next Round"
              : confirmLoading
              ? "Processing..."
              : "CONFIRM NEXT ROUND"}
          </button>

          {/* {participate.is_next_round_confirmed ? (
            <button
              disabled
              className="bg-green500 p-2 rounded-md text-[12px] text-white font-bold disabled:opacity-50"
            >
              Already Confirm Next Round
            </button>
          ) : (
            <button
              onClick={handleShowConfirmModal}
              disabled={confirmLoading}
              className="bg-green500 p-2 rounded-md text-[12px] text-white font-bold disabled:opacity-50"
            >
              {confirmLoading ? "Processing..." : "CONFIRM NEXT ROUND"}
            </button>
          )} */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-sm">
        <table className="min-w-[900px] w-full border border-gray300 text-sm">
          <thead>
            <tr className="bg-[#E5F0FF]">
              <th className="px-4 py-2 border">SL</th>
              <th className="px-4 py-2 border">Student Name</th>
              <th className="px-4 py-2 border">Student Gmail</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Time</th>
              <th className="px-4 py-2 border">Completed At</th>
              <th className="px-4 py-2 border">Mark</th>
              <th className="px-4 py-2 border">Correct</th>
              <th className="px-4 py-2 border">Wrong</th>
              <th className="px-4 py-2 border">Skipped</th>
            </tr>
          </thead>
          <tbody>
            {searchLoading ? (
              <tr>
                <td colSpan="10" className="text-center py-4 text-blue-500">
                  Searching...
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((data, idx) => (
                <tr key={data.id} className="hover:bg-[#E5F0FF] bg-opacity-50">
                  <td className="px-4 py-2 border">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-4 py-2 border">{data.student_name}</td>
                  <td className="px-4 py-2 border">{data.student_gmail}</td>
                  <td className="px-4 py-2 border">{data.student_phone}</td>
                  <td className="px-4 py-2 border">{data.completed_time}</td>
                  <td className="px-4 py-2 border">
                    {formatDateTime(data.completed_at)}
                  </td>
                  <td className="px-4 py-2 border">{data.marks_obtained}</td>
                  <td className="px-4 py-2 border">
                    {data.score_details?.correct}
                  </td>
                  <td className="px-4 py-2 border">
                    {data.score_details?.wrong}
                  </td>
                  <td className="px-4 py-2 border">
                    {data.score_details?.unanswered}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="text-center py-4 text-gray500 font-medium"
                >
                  No Participants Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && !searchLoading && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-6 text-center space-y-4">
            {/* Stage 1: Confirm modal */}
            {confirmStage && !confirmResult && !confirmError && (
              <>
                <h2 className="text-lg font-semibold text-gray800">
                  Are you sure?
                </h2>
                <p className="text-gray600 text-sm">
                  This will confirm and select the next round participants.
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray300 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmNextRound}
                    disabled={confirmLoading}
                    className="bg-green600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {confirmLoading ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </>
            )}

            {/* Stage 2: After confirm (success or error) */}
            {!confirmStage && (confirmError || confirmResult) && (
              <>
                {confirmError ? (
                  <>
                    <h2 className="text-red600 font-bold text-lg">Error</h2>
                    <p>{confirmError}</p>
                  </>
                ) : (
                  confirmResult && (
                    <>
                      <h2 className="text-green600 font-bold text-lg">
                        Success
                      </h2>
                      <p>{confirmResult.message}</p>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Qualified: {confirmResult.qualified_count}</span>
                        <span>
                          Disqualified: {confirmResult.disqualified_count}
                        </span>
                      </div>
                    </>
                  )
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-4 bg-gray700 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundQualifyList;

// import { useEffect, useState } from "react";
// import { HiOutlineExclamationCircle } from "react-icons/hi";
// import API from "../api/API";
// import { formatDateTime } from "../utils/FormateDateTime";

// const RoundQualifyList = ({ roundId, nextRoundQualifier }) => {
//   const [participate, setParticipate] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // confirm next round state
//   const [confirmLoading, setConfirmLoading] = useState(false);
//   const [confirmError, setConfirmError] = useState(null);
//   const [confirmResult, setConfirmResult] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   // pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   // search state
//   const [searchTerm, setSearchTerm] = useState("");

//   // fetch participate data (default load)
//   useEffect(() => {
//     const getParticipate = async () => {
//       if (!roundId) return;
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await API.get(
//           `/qzz/round-participant-list/${roundId}/`
//         );
//         // console.log("round participate", response);
//         setParticipate(response.data.results || []);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load participants. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     getParticipate();
//   }, [roundId]);

//   // fetch participate data with search
//   useEffect(() => {
//     const getSearchParticipate = async () => {
//       if (!roundId) return;
//       setSearchLoading(true);
//       setError(null);
//       try {
//         const url =
//           searchTerm.trim() !== ""
//             ? `/qzz/round-participant-list/${roundId}/?keyword=${searchTerm}`
//             : `/qzz/round-participant-list/${roundId}/`;
//         const response = await API.get(url);
//         setParticipate(response.data.results || []);
//         setCurrentPage(1);
//       } catch (err) {
//         console.error(err);
//         setError("Search failed. Please try again.");
//       } finally {
//         setSearchLoading(false);
//       }
//     };

//     const delayDebounce = setTimeout(() => {
//       getSearchParticipate();
//     }, 500);

//     return () => clearTimeout(delayDebounce);
//   }, [roundId, searchTerm]);

//   // handle confirm next round
//   const handleConfirmNextRound = async () => {
//     setConfirmLoading(true);
//     setConfirmError(null);
//     try {
//       const response = await API.post(
//         `/qzz/select-next-round-participant/${roundId}/`
//       );
//       setConfirmResult(response.data);
//       setShowModal(true);
//     } catch (err) {
//       setConfirmError("Something went wrong! Please try again.");
//       setShowModal(true);
//     } finally {
//       setConfirmLoading(false);
//     }
//   };

//   // pagination handle
//   const totalPages = Math.ceil(participate.length / pageSize);
//   const paginatedData = participate.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-8">
//         <div className="w-8 h-8 border-4 border-gray300 border-t-primary rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {error && (
//         <div className="bg-red100 text-red700 px-4 py-2 rounded">{error}</div>
//       )}

//       <div className="flex flex-col md:flex-row items-center justify-between">
//         <button className="bg-yellow500 flex mb-4 md:mb-0 items-center gap-1 rounded-lg p-1 text-sm font-semibold text-black ">
//           <HiOutlineExclamationCircle size={20} />
//           NEXT ROUND QUALIFY {nextRoundQualifier} PARTICIPANT
//         </button>

//         <div className="flex items-center gap-2">
//           <form action="#" onSubmit={(e) => e.preventDefault()}>
//             <input
//               type="text"
//               placeholder="Search by name, email, or number"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="border border-secondary rounded-lg py-1 px-2 shadow-none outline-none transition"
//             />
//           </form>
//           <button
//             onClick={handleConfirmNextRound}
//             disabled={confirmLoading}
//             className="bg-green500 p-2 rounded-md text-[12px] text-white font-bold disabled:opacity-50"
//           >
//             {confirmLoading ? "Processing..." : "CONFIRM NEXT ROUND"}
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto shadow-sm">
//         <table className="min-w-[900px] w-full border border-gray300 text-sm">
//           <thead>
//             <tr className="bg-[#E5F0FF]">
//               <th className="px-4 py-2 border">SL</th>
//               <th className="px-4 py-2 border">Student Name</th>
//               <th className="px-4 py-2 border">Student Gmail</th>
//               <th className="px-4 py-2 border">Phone</th>
//               <th className="px-4 py-2 border">Time</th>
//               <th className="px-4 py-2 border">Completed At</th>
//               <th className="px-4 py-2 border">Mark</th>
//               <th className="px-4 py-2 border">Correct</th>
//               <th className="px-4 py-2 border">Wrong</th>
//               <th className="px-4 py-2 border">Skipped</th>
//             </tr>
//           </thead>
//           <tbody>
//             {searchLoading ? (
//               <tr>
//                 <td colSpan="10" className="text-center py-4 text-blue-500">
//                   Searching...
//                 </td>
//               </tr>
//             ) : paginatedData.length > 0 ? (
//               paginatedData.map((data, idx) => (
//                 <tr key={data.id} className="hover:bg-[#E5F0FF] bg-opacity-50">
//                   <td className="px-4 py-2 border">
//                     {(currentPage - 1) * pageSize + idx + 1}
//                   </td>
//                   <td className="px-4 py-2 border">{data.student_name}</td>
//                   <td className="px-4 py-2 border">{data.student_gmail}</td>
//                   <td className="px-4 py-2 border">{data.student_phone}</td>
//                   <td className="px-4 py-2 border">{data.completed_time}</td>
//                   <td className="px-4 py-2 border">
//                     {formatDateTime(data.completed_at)}
//                   </td>
//                   <td className="px-4 py-2 border">{data.marks_obtained}</td>
//                   <td className="px-4 py-2 border">
//                     {data.score_details?.correct}
//                   </td>
//                   <td className="px-4 py-2 border">
//                     {data.score_details?.wrong}
//                   </td>
//                   <td className="px-4 py-2 border">
//                     {data.score_details?.unanswered}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="10"
//                   className="text-center py-4 text-gray500 font-medium"
//                 >
//                   No Participants Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && !searchLoading && (
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={handlePrev}
//             disabled={currentPage === 1}
//             className="px-3 py-1 bg-gray200 rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="text-sm font-medium">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={handleNext}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 bg-gray200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
//           <div className="bg-white rounded-lg shadow-lg w-[400px] p-6 text-center space-y-4">
//             {confirmError ? (
//               <>
//                 <h2 className="text-red600 font-bold text-lg">Error</h2>
//                 <p>{confirmError}</p>
//               </>
//             ) : (
//               confirmResult && (
//                 <>
//                   <h2 className="text-green600 font-bold text-lg">
//                     Success 🎉
//                   </h2>
//                   <p>{confirmResult.message}</p>
//                   <div className="flex justify-between text-sm font-medium">
//                     <span>Qualified: {confirmResult.qualified_count}</span>
//                     <span>
//                       Disqualified: {confirmResult.disqualified_count}
//                     </span>
//                   </div>
//                 </>
//               )
//             )}
//             <button
//               onClick={() => setShowModal(false)}
//               className="mt-4 bg-gray700 text-white px-4 py-2 rounded-lg"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RoundQualifyList;

// import { useEffect, useState } from "react";
// import { HiOutlineExclamationCircle } from "react-icons/hi";
// import API from "../api/API";
// import { formatDateTime } from "../utils/FormateDateTime";

// const RoundQualifyList = ({ roundId }) => {
//   const [participate, setParticipate] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false);

//   // confirm next round state
//   const [confirmLoading, setConfirmLoading] = useState(false);
//   const [confirmError, setConfirmError] = useState(null);
//   const [confirmResult, setConfirmResult] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   // pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   // search state
//   const [searchTerm, setSearchTerm] = useState("");

//   // fetch participate data (default load)
//   useEffect(() => {
//     const getParticipate = async () => {
//       if (!roundId) return;
//       setLoading(true);
//       try {
//         const response = await API.get(
//           `/qzz/round-participant-list/${roundId}/`
//         );
//         setParticipate(response.data.results || []);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getParticipate();
//   }, [roundId]);

//   // fetch participate data with search
//   useEffect(() => {
//     const getSearchParticipate = async () => {
//       if (!roundId) return;
//       setSearchLoading(true);
//       try {
//         const url =
//           searchTerm.trim() !== ""
//             ? `/qzz/round-participant-list/${roundId}/?keyword=${searchTerm}`
//             : `/qzz/round-participant-list/${roundId}/`;
//         const response = await API.get(url);
//         setParticipate(response.data.results || []);
//         setCurrentPage(1);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setSearchLoading(false);
//       }
//     };

//     const delayDebounce = setTimeout(() => {
//       getSearchParticipate();
//     }, 500);

//     return () => clearTimeout(delayDebounce);
//   }, [roundId, searchTerm]);

//   // handle confirm next round
//   const handleConfirmNextRound = async () => {
//     setConfirmLoading(true);
//     setConfirmError(null);
//     try {
//       const response = await API.post(
//         `/qzz/select-next-round-participant/${roundId}/`
//       );
//       setConfirmResult(response.data);
//       setShowModal(true);
//     } catch (err) {
//       setConfirmError("Something went wrong! Please try again.");
//       setShowModal(true);
//     } finally {
//       setConfirmLoading(false);
//     }
//   };

//   // pagination handle
//   const totalPages = Math.ceil(participate.length / pageSize);
//   const paginatedData = participate.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   if (loading) {
//     return <div className="text-center py-4">Loading...</div>;
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <button className="bg-yellow500 flex items-center gap-1 rounded-lg p-1 text-sm font-semibold text-black ">
//           <HiOutlineExclamationCircle size={20} />
//           NEXT ROUND QUALIFY {participate[0]?.next_round_qualifier} PARTICIPANT
//         </button>

//         <div className="flex items-center gap-2">
//           <form action="#" onSubmit={(e) => e.preventDefault()}>
//             <input
//               type="text"
//               placeholder="Search by name, email, or number"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="border border-gray300 rounded-lg py-1 px-2 shadow-none outline-none transition hover:border-cyan500"
//             />
//           </form>
//           <button
//             onClick={handleConfirmNextRound}
//             disabled={confirmLoading}
//             className="bg-green500 p-2 rounded-md text-[12px] text-white font-bold disabled:opacity-50"
//           >
//             {confirmLoading ? "Processing..." : "CONFIRM NEXT ROUND"}
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-[900px] w-full border border-gray300 text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="px-4 py-2 border">SL</th>
//               <th className="px-4 py-2 border">Student Name</th>
//               <th className="px-4 py-2 border">Student Gmail</th>
//               <th className="px-4 py-2 border">Phone</th>
//               <th className="px-4 py-2 border">Time</th>
//               <th className="px-4 py-2 border">Completed At</th>
//               <th className="px-4 py-2 border">Mark</th>
//               <th className="px-4 py-2 border">Correct</th>
//               <th className="px-4 py-2 border">Wrong</th>
//               <th className="px-4 py-2 border">Skipped</th>
//             </tr>
//           </thead>
//           <tbody>
//             {searchLoading ? (
//               <tr>
//                 <td colSpan="10" className="text-center py-4 text-blue-500">
//                   Searching...
//                 </td>
//               </tr>
//             ) : paginatedData.length > 0 ? (
//               paginatedData.map((data, idx) => (
//                 <tr key={data.id} className="hover:bg-gray50">
//                   <td className="px-4 py-2 border">
//                     {(currentPage - 1) * pageSize + idx + 1}
//                   </td>
//                   <td className="px-4 py-2 border">{data.student_name}</td>
//                   <td className="px-4 py-2 border">{data.student_gmail}</td>
//                   <td className="px-4 py-2 border">{data.student_phone}</td>
//                   <td className="px-4 py-2 border">{data.completed_time}</td>
//                   <td className="px-4 py-2 border">
//                     {formatDateTime(data.completed_at)}
//                   </td>
//                   <td className="px-4 py-2 border">{data.marks_obtained}</td>
//                   <td className="px-4 py-2 border">
//                     {data.score_details?.correct}
//                   </td>
//                   <td className="px-4 py-2 border">
//                     {data.score_details?.wrong}
//                   </td>
//                   <td className="px-4 py-2 border">
//                     {data.score_details?.unanswered}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="10"
//                   className="text-center py-4 text-gray500 font-medium"
//                 >
//                   No Participants Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && !searchLoading && (
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={handlePrev}
//             disabled={currentPage === 1}
//             className="px-3 py-1 bg-gray200 rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="text-sm font-medium">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={handleNext}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 bg-gray200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Modal (unchanged) */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
//           <div className="bg-white rounded-lg shadow-lg w-[400px] p-6 text-center space-y-4">
//             {confirmError ? (
//               <>
//                 <h2 className="text-red600 font-bold text-lg">Error</h2>
//                 <p>{confirmError}</p>
//               </>
//             ) : (
//               confirmResult && (
//                 <>
//                   <h2 className="text-green600 font-bold text-lg">
//                     Success 🎉
//                   </h2>
//                   <p>{confirmResult.message}</p>
//                   <div className="flex justify-between text-sm font-medium">
//                     <span>Qualified: {confirmResult.qualified_count}</span>
//                     <span>
//                       Disqualified: {confirmResult.disqualified_count}
//                     </span>
//                   </div>
//                 </>
//               )
//             )}
//             <button
//               onClick={() => setShowModal(false)}
//               className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RoundQualifyList;
