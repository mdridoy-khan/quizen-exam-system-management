import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuCirclePlus } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";
import { Link, useLocation, useParams } from "react-router-dom";
import API from "../../../api/API";
import RoundQualifyList from "../../../components/RoundQualifyList";
import formatTime from "../../../utils/FormateTime";

const RoundList = () => {
  const { id } = useParams();
  const location = useLocation();
  const annId = location.state;

  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSet, setQuizSet] = useState([]);
  const [quizError, setQuizError] = useState(null);

  // Participant List Toggle
  const [showParticipants, setShowParticipants] = useState(false);

  // Create Quiz Modal
  const [isOpen, setIsOpen] = useState(false);
  const [quizCreationData, setQuizCreationData] = useState(null);

  // Fetch Round Details
  useEffect(() => {
    const fetchRoundDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await API.get(`/anc/single-round-details-view/${id}/`);
        setAnnouncement(response?.data?.data || response?.data);
      } catch (err) {
        console.error("Error fetching round details:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoundDetails();
  }, [id]);

  // Fetch Quiz Sets
  useEffect(() => {
    const fetchQuizSet = async () => {
      if (!id || !annId) return;

      setQuizLoading(true);
      try {
        const response = await API.get(
          `/qzz/view-president-event-quiz-set/anc/${annId}/round/${id}/`
        );

        let data = response?.data;

        if (data?.data && Array.isArray(data.data)) {
          data = data.data;
        } else if (data?.quiz_sets && Array.isArray(data.quiz_sets)) {
          data = data.quiz_sets;
        } else if (Array.isArray(data)) {
          data = data;
        } else {
          console.warn("Unexpected quiz set response format:", data);
          data = [];
        }

        setQuizSet(data);
      } catch (err) {
        console.error("Error fetching quiz sets:", err);
        setQuizError(err);
        setQuizSet([]);
      } finally {
        setQuizLoading(false);
      }
    };

    fetchQuizSet();
  }, [annId, id]);

  // Toggle Participant List
  const toggleParticipants = () => setShowParticipants((prev) => !prev);

  // Create Quiz Modal
  const openModal = () => {
    setQuizCreationData({
      roundId: id,
      annId: announcement?.announcement,
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setQuizCreationData(null);
  };

  // Loading UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-base font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  // Error UI
  if (error || !announcement) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 font-bold">
        Error loading round details!
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Round Header Card */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {announcement.round_name}
        </h2>

        {/* 3 COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT — STUDY MATERIAL (SMALLER WIDTH) */}
          <div className="lg:col-span-3 flex flex-col">
            {announcement.study_material ? (
              <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* File Type Detection */}
                {(() => {
                  const url = announcement.study_material;
                  const extension = url.split(".").pop()?.toLowerCase();

                  // Image Files
                  if (
                    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
                      extension
                    )
                  ) {
                    return (
                      <img
                        src={url}
                        alt="Study Material"
                        className="w-full h-64 object-cover"
                      />
                    );
                  }

                  // PDF
                  if (extension === "pdf") {
                    return (
                      <div className="h-64 bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center p-6 text-center">
                        <div className="bg-red-500 text-white p-5 rounded-full mb-4">
                          <svg
                            className="w-12 h-12"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 12h6v-2H9v2zM7 8h10v2H7V8zm2 6h8v2H9v-2zm-2 4h10v2H7v-2zM4 4h12v2H4V4zm0 12h12v2H4v-2z" />
                          </svg>
                        </div>
                        <p className="font-bold text-gray-800 text-lg">
                          Study Material
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          PDF Document
                        </p>
                      </div>
                    );
                  }

                  // Word / Docx
                  if (["doc", "docx"].includes(extension)) {
                    return (
                      <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6 text-center">
                        <div className="bg-blue-600 text-white p-5 rounded-full mb-4">
                          <svg
                            className="w-12 h-12"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M3 4h14v12H3V4zm2 2v8h10V6H5z" />
                          </svg>
                        </div>
                        <p className="font-bold text-gray-800 text-lg">
                          Study Material Porn
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Word Document
                        </p>
                      </div>
                    );
                  }

                  // Text File or Others
                  return (
                    <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6 text-center">
                      <div className="bg-gray-600 text-white p-5 rounded-full mb-4">
                        <svg
                          className="w-12 h-12"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 4h12v2H4V4zm0 4h12v2H4V8zm0 4h12v2H4v-2zm0 4h8v2H4v-2z" />
                        </svg>
                      </div>
                      <p className="font-bold text-gray-800 text-lg">
                        Study Material
                      </p>
                      <p className="text-sm text-gray-600 mt-1 capitalize">
                        {extension || "File"}
                      </p>
                    </div>
                  );
                })()}

                {/* Download Button - Always Visible */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <a
                    href={announcement.study_material}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-secondary text-white font-medium text-sm rounded-lg transition shadow-sm hover:shadow"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Material
                  </a>
                </div>
              </div>
            ) : (
              // No Study Material
              <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500">
                <svg
                  className="w-16 h-16 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm font-medium">
                  No study material provided
                </p>
                <p className="text-xs mt-1">Contact admin if needed</p>
              </div>
            )}
          </div>
          {/* <div className="lg:col-span-3 flex flex-col">
            {announcement.study_material && (
              <img
                src={announcement.study_material}
                alt="Study Material"
                className="w-full h-60 object-cover rounded-xl shadow-md"
              />
            )}
          </div> */}

          {/* MIDDLE — DETAILS GRID (BIG WIDTH) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Announcement", value: announcement.announcement_name },
              { label: "Department", value: announcement.department },
              { label: "Topic / Subject", value: announcement.topic_subject },
              {
                label: "Question Type",
                value: announcement.question_type?.toUpperCase(),
              },
              {
                label: "Start Date & Time",
                value: new Date(announcement.quiz_start_date).toLocaleString(),
              },
              {
                label: "End Date & Time",
                value: new Date(announcement.quiz_end_date).toLocaleString(),
              },
              { label: "Total Questions", value: announcement.total_questions },
              {
                label: "Duration (min)",
                value: formatTime(announcement.duration),
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT — BUTTONS (SMALLER WIDTH) */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-stretch gap-4">
            <button
              onClick={toggleParticipants}
              className={`flex items-center justify-center gap-2 py-3 px-4 text-white text-sm font-semibold rounded-lg transition w-full ${
                showParticipants
                  ? "bg-primary"
                  : "bg-secondary hover:bg-primary"
              }`}
            >
              VIEW PARTICIPANTS <TbListDetails className="text-lg" />
            </button>

            <div className="relative group w-full">
              <button
                onClick={openModal}
                // disabled={announcement.is_created_quiz}
                className="flex items-center justify-center gap-2 py-3 bg-secondary hover:bg-primary px-4 text-white text-sm font-semibold rounded-lg transition w-full"
                // className={`flex items-center justify-center gap-2 py-3 bg-secondary hover:bg-primary px-4 text-white text-sm font-semibold rounded-lg transition w-full ${
                //   announcement.is_created_quiz
                //     ? "bg-gray-400 cursor-not-allowed"
                //     : "bg-secondary hover:bg-primary"
                // }`}
              >
                CREATE QUIZ <LuCirclePlus className="text-lg" />
              </button>

              {/* {announcement.is_created_quiz && (
                <span className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 text-[10px] font-medium bg-black text-white rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  1 Question set already submitted
                </span>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== QUIZ SET LIST ==================== */}
      {quizLoading ? (
        <div className="mt-10 text-center text-gray-600">
          Loading quiz sets...
        </div>
      ) : quizSet.length > 0 ? (
        <div className="mt-10 bg-white shadow-md border border-gray-200 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Quiz Sets for {announcement.round_name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizSet.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border rounded-xl p-5 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {item.subject || "Untitled Quiz Set"}
                  </h4>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Total Questions</span>
                    <span className="font-bold">{item.total_questions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Marks</span>
                    <span className="font-bold">{item.total_marks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marks per Question</span>
                    <span className="font-bold">{item.marks_per_question}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Negative Mark</span>
                    <span className="font-bold">
                      {item.negative_marks_per_question || 0}
                    </span>
                  </div>
                </div>

                {/* <div className="mt-5">
                  <Link
                    to={`/president/quiz-set/details/${item.id}`}
                    className="block text-center py-2.5 bg-secondary hover:bg-primary text-white font-semibold rounded-lg transition"
                  >
                    View Details
                  </Link>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      ) : quizError ? (
        <div className="mt-10 text-center text-red-600">
          Failed to load quiz sets.
        </div>
      ) : (
        <div className="mt-10 text-center text-gray-500 italic">
          No quiz set created yet for this round.
        </div>
      )}

      {/* Participant List */}
      {showParticipants && (
        <div className="mt-10 bg-gray-50 rounded-2xl border">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Participants & Qualifiers – {announcement.round_name}
            </h3>
            <RoundQualifyList
              roundId={id}
              nextRoundQualifier={announcement.next_round_qualifier}
              topicSubject={announcement.topic_subject}
              confirmNextRound={announcement.is_next_round_confirmed}
              roundName={announcement.round_name}
            />
          </div>
        </div>
      )}

      {/* Create Quiz Modal */}
      {isOpen && quizCreationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
              <IoClose size={28} />
            </button>

            <h2 className="text-2xl font-bold text-center my-8">
              Choose a method to create your quiz
            </h2>

            <div className="space-y-4">
              <Link
                to={`/president/create-quiz/ai/${quizCreationData.roundId}/${quizCreationData.annId}`}
                onClick={closeModal}
                className="block w-full text-center py-3 bg-secondary hover:bg-primary text-white font-semibold rounded-lg transition"
              >
                AI Generated
              </Link>
              <Link
                to={`/president/create-quiz/shared/${quizCreationData.roundId}/${quizCreationData.annId}`}
                onClick={closeModal}
                เขา
                className="block w-full text-center py-3 bg-secondary hover:bg-primary text-white font-semibold rounded-lg transition"
              >
                Shared Questions
              </Link>
              <Link
                to={`/president/create-quiz/mix/${quizCreationData.roundId}/${quizCreationData.annId}`}
                onClick={closeModal}
                className="block w-full text-center py-3 bg-secondary hover:bg-primary text-white font-semibold rounded-lg transition"
              >
                Mix
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundList;

// import { useEffect, useState } from "react";
// import { IoClose } from "react-icons/io5";
// import { LuCirclePlus } from "react-icons/lu";
// import { TbListDetails } from "react-icons/tb";
// import { Link, useLocation, useParams } from "react-router-dom";
// import API from "../../../api/API";
// import RoundQualifyList from "../../../components/RoundQualifyList";
// import formatTime from "../../../utils/FormateTime";

// const RoundList = () => {
//   const { id } = useParams();
//   const [announcement, setAnnouncement] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [quizLoading, setQuizLoading] = useState(false);
//   const [quizSet, setQuizSet] = useState(null);
//   const [quizError, setQuizError] = useState(null);

//   // Participant List
//   const [showParticipants, setShowParticipants] = useState(false);

//   // Create Quiz Modal
//   const [isOpen, setIsOpen] = useState(false);
//   const [quizCreationData, setQuizCreationData] = useState(null);

//   const location = useLocation();
//   const annId = location.state;
//   console.log("annId", annId);

//   // fetch round details
//   useEffect(() => {
//     const fetchRoundDetails = async () => {
//       if (!id) return;
//       setLoading(true);
//       try {
//         const response = await API.get(`/anc/single-round-details-view/${id}/`);
//         setAnnouncement(response?.data?.data);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRoundDetails();
//   }, [id]);

//   // fetch quiz set
//   useEffect(() => {
//     const fetchQuizSet = async () => {
//       if (!id) return;
//       setQuizLoading(true);
//       try {
//         const response = await API.get(
//           `/qzz/view-president-event-quiz-set/anc/${annId}/round/${id}/`
//         );
//         console.log("Quiz Set", response?.data);
//         setQuizSet(response?.data);
//       } catch (err) {
//         setQuizError(err);
//       } finally {
//         setQuizLoading(false);
//       }
//     };
//     fetchQuizSet();
//   }, [annId, id]);

//   // Toggle Participant List
//   const toggleParticipants = () => {
//     setShowParticipants((prev) => !prev);
//   };

//   // Create Quiz Modal
//   const openModal = () => {
//     setQuizCreationData({
//       roundId: id,
//       annId: announcement?.announcement,
//     });
//     setIsOpen(true);
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//     setQuizCreationData(null);
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64 space-y-3">
//         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//         <p className="text-base font-semibold text-gray-700">Loading...</p>
//       </div>
//     );
//   }

//   if (error || !announcement) {
//     return (
//       <div className="flex items-center justify-center h-64 text-red-500 font-bold">
//         Error loading round details!
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
//         {/* Round Header */}
//         <div className="p-6">
//           <h2 className="text-3xl font-bold text-gray-800 mb-6">
//             {announcement.round_name}
//           </h2>

//           {/* Study Material */}
//           {announcement.study_material && (
//             <div className="mb-6">
//               <img
//                 src={announcement.study_material}
//                 alt="Study Material"
//                 className="w-full h-72 object-cover rounded-xl shadow-md"
//               />
//             </div>
//           )}

//           {/* Details Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <p className="text-sm text-gray-500">Announcement</p>
//               <p className="font-semibold text-gray-800">
//                 {announcement.announcement_name}
//               </p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <p className="text-sm text-gray-500">Department</p>
//               <p className="font-semibold text-gray-800">
//                 {announcement.department}
//               </p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <p className="text-sm text-gray-500">Topic / Subject</p>
//               <p className="font-semibold text-gray-800">
//                 {announcement.topic_subject}
//               </p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <p className="text-sm text-gray-500">Question Type</p>
//               <p className="font-semibold uppercase">
//                 {announcement.question_type}
//               </p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <p className="text-sm text-gray-500">Start Date & Time</p>
//               <p className="font-semibold">
//                 {new Date(announcement.quiz_start_date).toLocaleString()}
//               </p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <p className="text-sm text-gray-500">End Date & Time</p>
//               <p className="font-semibold">
//                 {new Date(announcement.quiz_end_date).toLocaleString()}
//               </p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <p className="text-sm text-gray-500">Total Questions</p>
//               <p className="font-semibold">{announcement.total_questions}</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <p className="text-sm text-gray-500">Duration (min)</p>
//               <p className="font-semibold text-sm">
//                 {formatTime(announcement.duration)}
//               </p>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex items-center justify-between gap-4">
//             {/* VIEW PARTICIPANT Button - Toggle */}
//             <button
//               onClick={toggleParticipants}
//               className={`w-full max-w-xs flex items-center justify-center gap-3 py-3 px-6 text-white font-semibold rounded-lg transition
//                 ${
//                   showParticipants
//                     ? "bg-primary"
//                     : "bg-secondary hover:bg-primary"
//                 }`}
//             >
//               VIEW PARTICIPANT <TbListDetails className="text-xl" />
//             </button>

//             {/* CREATE QUIZ Button */}
//             <div className="relative group">
//               <button
//                 onClick={openModal}
//                 disabled={announcement.is_created_quiz}
//                 className={`flex items-center justify-center gap-3 py-3 px-6 text-white font-semibold rounded-lg transition
//                   ${
//                     announcement.is_created_quiz
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-secondary hover:bg-primary"
//                   }`}
//               >
//                 CREATE QUIZ <LuCirclePlus className="text-xl" />
//               </button>

//               {announcement.is_created_quiz && (
//                 <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium bg-black text-white rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
//                   1 Question set already submitted
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* QUIZ SET LIST */}
//       {quizSet?.length > 0 && (
//         <div className="mt-10 bg-white shadow-md border border-gray-200 rounded-2xl p-6">
//           <h3 className="text-xl font-bold text-gray-800 mb-6">
//             Quiz Sets for {announcement.round_name}
//           </h3>

//           {quizLoading ? (
//             <p className="text-gray-600 text-center">Loading quiz sets...</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {quizSet.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-gray-50 border rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
//                 >
//                   <div className="flex justify-between items-center mb-3">
//                     <h4 className="text-lg font-semibold text-gray-800">
//                       {item.subject || "No Subject"}
//                     </h4>
//                     <span className="text-sm px-2 py-1 bg-primary text-white rounded-md">
//                       ID: {item.id}
//                     </span>
//                   </div>

//                   <div className="space-y-2 text-sm">
//                     <p className="flex justify-between">
//                       <span className="text-gray-600">Total Questions:</span>
//                       <span className="font-semibold">
//                         {item.total_questions}
//                       </span>
//                     </p>

//                     <p className="flex justify-between">
//                       <span className="text-gray-600">Total Marks:</span>
//                       <span className="font-semibold">{item.total_marks}</span>
//                     </p>

//                     <p className="flex justify-between">
//                       <span className="text-gray-600">Marks per Question:</span>
//                       <span className="font-semibold">
//                         {item.marks_per_question}
//                       </span>
//                     </p>

//                     <p className="flex justify-between">
//                       <span className="text-gray-600">Negative Mark:</span>
//                       <span className="font-semibold">
//                         {item.negative_marks_per_question}
//                       </span>
//                     </p>
//                   </div>

//                   {/* Button */}
//                   <div className="mt-4">
//                     <Link
//                       to={`/president/quiz-set/details/${item.id}`}
//                       className="block text-center py-2 bg-secondary hover:bg-primary text-white font-semibold rounded-lg transition"
//                     >
//                       View Details
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Participant List - Conditional Render */}
//       {showParticipants && (
//         <div className="border-t border-gray-200 bg-gray-50 mt-10">
//           <div className="p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-6">
//               Participants & Qualifiers for {announcement.round_name}
//             </h3>
//             <RoundQualifyList
//               roundId={id}
//               nextRoundQualifier={announcement.next_round_qualifier}
//               topicSubject={announcement.topic_subject}
//               confirmNextRound={announcement.is_next_round_confirmed}
//               roundName={announcement.round_name}
//             />
//           </div>
//         </div>
//       )}

//       {/* Create Quiz Modal - Same as AllRoundList */}
//       {isOpen && quizCreationData && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-8 relative">
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//             >
//               <IoClose size={28} />
//             </button>

//             <h2 className="text-2xl font-bold text-center mb-8">
//               Choose a method to create your quiz
//             </h2>

//             <div className="space-y-4">
//               <Link
//                 to={`/president/create-quiz/ai/${quizCreationData.roundId}/${quizCreationData.annId}`}
//                 onClick={closeModal}
//                 className="block w-full text-center py-4 bg-secondary hover:bg-primary text-white font-semibold rounded-lg transition"
//               >
//                 AI Generated
//               </Link>
//               <Link
//                 to={`/president/create-quiz/shared/${quizCreationData.roundId}/${quizCreationData.annId}`}
//                 onClick={closeModal}
//                 className="block w-full text-center py-4 bg-secondary hover:bg-primary text-white font-semibold rounded-lg transition"
//               >
//                 Shared Questions
//               </Link>
//               <Link
//                 to={`/president/create-quiz/mix/${quizCreationData.roundId}/${quizCreationData.annId}`}
//                 onClick={closeModal}
//                 className="block w-full text-center py-4 bg-secondary hover:bg-primary text-white font-semibold rounded-lg transition"
//               >
//                 Mix (AI + Manual)
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RoundList;
