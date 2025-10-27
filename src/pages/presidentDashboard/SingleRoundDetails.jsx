import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../api/API";
import { formatDateTime } from "../../utils/FormateDateTime";
import formatTime from "../../utils/FormateTime";

const SingleRoundDetails = ({ onClose, roundID }) => {
  const [rounds, setRounds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();

  // Fetch single round details
  useEffect(() => {
    const fetchRounds = async () => {
      if (!roundID) return;
      setLoading(true);
      setError(null);
      try {
        const response = await API.get(
          `/anc/single-round-details-view/${roundID}/`
        );
        setRounds(response.data.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to fetch round details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRounds();
  }, [roundID]);

  // File download handler

  const handleDownload = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl, { mode: "cors" });

      // Check if response is OK
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      // Convert response to blob
      const blob = await response.blob();

      // Extract filename from URL
      const fileName = fileUrl.split("/").pop();

      // Trigger download
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    // <div className="w-full">
    //   <div className="bg-white shadow p-4 rounded-lg">
    //     {/* Close button */}
    //     <div className="flex justify-between items-center gap-2 mb-4">
    //       <h3 className="text-lg lg:text-xl xl:text-2xl font-semibold">
    //         Quiz Round Details
    //       </h3>
    //       <button
    //         onClick={onClose}
    //         className="transition w-8 h-8 rounded hover:bg-gray700 hover:text-white flex items-center justify-center"
    //       >
    //         <RxCross2 size={24} />
    //       </button>
    //     </div>

    //     {/* Loading State */}
    //     {loading && (
    //       <div className="flex justify-center items-center py-10">
    //         <FaSpinner className="animate-spin text-2xl text-gray-600" />
    //         <span className="ml-2 text-gray-600 font-medium">
    //           Loading round details...
    //         </span>
    //       </div>
    //     )}

    //     {/* Error State */}
    //     {error && (
    //       <div className="flex justify-center items-center py-10">
    //         <p className="text-red-600 font-medium">{error}</p>
    //       </div>
    //     )}

    //     {/* Data Render */}
    //     {!loading && !error && rounds && (
    //       <div className="bg-gray200 rounded">
    //         {/* Banner image */}
    //         <div>
    //           <img
    //             src={rounds.study_material}
    //             alt="Banner image"
    //             className="w-full h-[320px] object-cover bg-no-repeat bg-cover rounded"
    //           />
    //         </div>

    //         {/* Round details */}
    //         <div>
    //           <div className="flex items-center justify-between mt-6">
    //             <h3 className="text-2xl font-bold ml-7">
    //               Round name : {rounds.round_name}
    //             </h3>
    //             <Link
    //               to={`/president/round-creation-form/${id}?round_id=${roundID}`}
    //               className="flex items-center gap-3 mr-7 text-xl font-semibold"
    //             >
    //               Edit <FiEdit />
    //             </Link>
    //           </div>

    //           <div className="w-full max-w-3xl mx-auto mt-6 pb-6">
    //             <table className="w-full border-collapse">
    //               <tbody className="pl-5">
    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2 w-48">
    //                     Subject
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">{rounds.topic_subject}</td>
    //                 </tr>

    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     Exam Type
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">{rounds.exam_type}</td>
    //                 </tr>

    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     From
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">
    //                     {formatDateTime(rounds.quiz_start_date)} To{" "}
    //                     {formatDateTime(rounds.quiz_end_date)}
    //                   </td>
    //                 </tr>

    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     Next Round Qualifier
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">
    //                     {rounds.next_round_qualifier}
    //                   </td>
    //                 </tr>

    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     Total Questions
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">
    //                     {rounds.total_questions}
    //                   </td>
    //                 </tr>

    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     Question Type
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">{rounds.question_type}</td>
    //                 </tr>

    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     Duration
    //                   </td>
    //                   <td className="px-2">:</td>

    //                   <td className="flex items-center mt-2 gap-1 text-gray-800">
    //                     {formatTime(rounds.duration)}
    //                   </td>
    //                 </tr>

    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     Marks/Question
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">
    //                     {rounds.marks_per_question}
    //                   </td>
    //                 </tr>

    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     Neg. marks/Question
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">
    //                     {rounds.negative_marks_per_question}
    //                   </td>
    //                 </tr>

    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     Total marks
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">{rounds.total_marks}</td>
    //                 </tr>

    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     Address
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">{rounds.address}</td>
    //                 </tr>

    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     Status
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">{rounds.round_status}</td>
    //                 </tr>

    //                 <tr className="border-b">
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     Creation Date
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">
    //                     {formatDateTime(rounds.created_at)}
    //                   </td>
    //                 </tr>

    //                 <tr>
    //                   <td className="font-semibold pl-8 text-gray-700 py-2">
    //                     Last Update Date
    //                   </td>
    //                   <td className="px-2">:</td>
    //                   <td className="text-gray-800">
    //                     {formatDateTime(rounds.updated_at)}
    //                   </td>
    //                 </tr>
    //               </tbody>
    //             </table>
    //           </div>
    //         </div>
    //       </div>
    //     )}

    //     {/* No Data Fallback */}
    //     {!loading && !error && !rounds && (
    //       <div className="flex justify-center items-center py-10">
    //         <p className="text-gray-600 font-medium">No round details found.</p>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            Quiz Round Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <RxCross2 size={24} />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <FaSpinner className="animate-spin text-2xl text-gray-600" />
            <span className="ml-2 text-gray-600 font-medium">
              Loading round details...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center py-10">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Data Section */}
        {!loading && !error && rounds && (
          <div>
            {/* Banner Section */}
            <div className="relative w-full h-56 md:h-64 lg:h-72 overflow-hidden rounded-t-xl">
              <img
                src={rounds.study_material}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end px-6 py-4 text-white">
                <h2 className="text-2xl md:text-3xl font-bold">
                  {rounds.round_name}
                </h2>
              </div>
            </div>

            {/* Body Section */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Topic Subject */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">
                    Topic Subject
                  </h4>
                  <p className="text-gray-600 leading-relaxed font-semibold">
                    {rounds.topic_subject}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-500">Schedule</span>
                    <span className="font-medium text-gray-900">
                      {formatDateTime(rounds.quiz_start_date)} -{" "}
                      {formatDateTime(rounds.quiz_end_date)}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-500">Duration</span>
                    <span className="font-medium text-gray-900">
                      {formatTime(rounds.duration)}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-500">Questions</span>
                    <span className="font-medium text-gray-900">
                      {rounds.total_questions}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-500">
                      Marks / Question
                    </span>
                    <span className="font-medium text-gray-900">
                      {rounds.marks_per_question} (+),{" "}
                      {rounds.negative_marks_per_question} (-)
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-500">Qualifier</span>
                    <span className="font-medium text-gray-900">
                      {rounds.next_round_qualifier}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-500">Exam Type</span>
                    <span className="font-medium text-gray-900">
                      {rounds.exam_type}
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">
                        Question Type:
                      </p>
                      <p className="font-medium text-gray-800">
                        {rounds.question_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">
                        Address:
                      </p>
                      <p className="font-medium text-gray-800">
                        {rounds.address || "Not Applicable"}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mt-3">
                    <p>
                      <span className="font-semibold text-gray-700">
                        Timeframe:
                      </span>{" "}
                      Starts: {formatDateTime(rounds.quiz_start_date)} | Ends:{" "}
                      {formatDateTime(rounds.quiz_end_date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side: Study Material */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  Resources & Study Material
                </h4>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center bg-white border rounded-lg px-3 py-2 shadow-sm">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      Study Material
                    </p>

                    {rounds.study_material ? (
                      <button
                        onClick={() => handleDownload(rounds.study_material)}
                        className="text-primary font-semibold text-sm hover:underline"
                      >
                        Download
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No file available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <Link
                to={`/president/round-creation-form/${id}?round_id=${roundID}`}
                className="px-5 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary/90 flex items-center gap-2"
              >
                Edit Details <FiEdit />
              </Link>
            </div>
          </div>
        )}

        {/* No Data */}
        {!loading && !error && !rounds && (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-600 font-medium">No round details found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleRoundDetails;

// import { useEffect, useState } from "react";
// import { FiEdit } from "react-icons/fi";
// import { RxCross2 } from "react-icons/rx";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import API from "../../api/API";
// import { formatDateTime } from "../../utils/FormateDateTime";

// const SingleRoundDetails = ({ onClose, roundID }) => {
//   const [rounds, setRounds] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const { id } = useParams();

//   // Fetch single round details
//   useEffect(() => {
//     const fetchRounds = async () => {
//       if (!roundID) return;
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await API.get(
//           `/anc/single-round-details-view/${roundID}/`
//         );
//         setRounds(response.data.data);
//       } catch (err) {
//         console.log(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRounds();
//   }, [roundID]);

//   return (
//     <div>
//       <div className="bg-white max-w-2xl shadow p-4 rounded-lg">
//         {/* Close button */}
//         <div className="flex justify-end mb-4">
//           <button
//             onClick={onClose}
//             className="transition w-8 h-8 rounded hover:bg-gray700 hover:text-white flex items-center justify-center"
//           >
//             <RxCross2 size={24} />
//           </button>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center items-center py-10">
//             <p className="text-gray-600 font-medium">
//               Loading round details...
//             </p>
//           </div>
//         )}

//         {/* Error State */}
//         {error && (
//           <div className="flex justify-center items-center py-10">
//             <p className="text-red-600 font-medium">{error}</p>
//           </div>
//         )}

//         {/* Data Render */}
//         {!loading && !error && rounds && (
//           <div className="bg-gray200 rounded">
//             {/* Banner image */}
//             <div>
//               <img
//                 src={rounds.study_material}
//                 alt="Banner image"
//                 className="w-full h-[320px] object-cover bg-no-repeat bg-cover rounded"
//               />
//             </div>

//             {/* Round details */}
//             <div>
//               <div className="flex items-center justify-between mt-6">
//                 <h3 className="text-2xl font-bold ml-7">
//                   Round name : {rounds.round_name}
//                 </h3>
//                 <Link
//                   to={`/president/round-creation-form/${id}?round_id=${roundID}`}
//                   className="flex items-center gap-3 mr-7 text-xl font-semibold"
//                 >
//                   Edit <FiEdit />
//                 </Link>
//               </div>

//               <div className="w-full max-w-3xl mx-auto mt-6 pb-6">
//                 <table className="w-full border-collapse">
//                   <tbody className="pl-5">
//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2 w-48">
//                         Subject
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">{rounds.topic_subject}</td>
//                     </tr>

//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         Exam Type
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">{rounds.exam_type}</td>
//                     </tr>

//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         From
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">
//                         {formatDateTime(rounds.quiz_start_date)} To{" "}
//                         {formatDateTime(rounds.quiz_end_date)}
//                       </td>
//                     </tr>

//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         Next Round Qualifier
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">
//                         {rounds.next_round_qualifier}
//                       </td>
//                     </tr>

//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         Total Questions
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">
//                         {rounds.total_questions}
//                       </td>
//                     </tr>

//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         Question Type
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">{rounds.question_type}</td>
//                     </tr>

//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         Duration
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">{rounds.duration}</td>
//                     </tr>

//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         Marks/Question
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">
//                         {rounds.marks_per_question}
//                       </td>
//                     </tr>

//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         Neg. marks/Question
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">
//                         {rounds.negative_marks_per_question}
//                       </td>
//                     </tr>

//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         Total marks
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">{rounds.total_marks}</td>
//                     </tr>

//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         Address
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">{rounds.address}</td>
//                     </tr>

//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         Status
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">{rounds.round_status}</td>
//                     </tr>

//                     <tr className="border-b">
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         Creation Date
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">
//                         {formatDateTime(rounds.created_at)}
//                       </td>
//                     </tr>

//                     <tr>
//                       <td className="font-semibold pl-8 text-gray-700 py-2">
//                         Last Update Date
//                       </td>
//                       <td className="px-2">:</td>
//                       <td className="text-gray-800">
//                         {formatDateTime(rounds.updated_at)}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* No Data Fallback */}
//         {!loading && !error && !rounds && (
//           <div className="flex justify-center items-center py-10">
//             <p className="text-gray-600 font-medium">No round details found.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SingleRoundDetails;
