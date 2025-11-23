import { BsFillQuestionCircleFill, BsFillTrophyFill } from "react-icons/bs";
import { MdWatchLater } from "react-icons/md";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../../utils/FormateDateTime";
import formatTime from "../../../utils/FormateTime";

const StudentParticipateEventRounds = ({
  layout = "vertical",
  round, // ← round.id (number)
  quizId,
  round_status,
  is_participated,
  image,
  title,
  subject,
  exam_type,
  start_date,
  end_Date,
  next_round_qualifier,
  total_question,
  duration,
  isParticipateEnabled = false, // ← এটা Countdown শেষ হলে true হবে
  onParticipate, // ← নতুন callback (roundId পাঠাবে)
}) => {
  const isHorizontal = layout === "horizontal";

  return (
    <>
      <div
        className={`bg-white overflow-hidden transform transition ease-in-out duration-300 shadow hover:shadow-md p-3 rounded-lg ${
          isHorizontal ? "flex gap-4 items-start" : ""
        }`}
      >
        <div className={`p-4 ${isHorizontal ? "flex-1" : ""}`}>
          <h3 className="text-2xl font-semibold text-black mt-2 mb-3">
            {title}
          </h3>

          <div className="flex items-center flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-1 border border-gray-300 py-1 px-2 rounded-full">
              <span className="text-[15px] font-semibold text-black min-w-20 inline-block">
                Subject: {subject}
              </span>
            </div>
            <div className="flex border border-gray-300 py-1 px-2 rounded-full bg-pink-50">
              <span className="text-[15px] font-semibold text-black min-w-20 inline-block">
                Type: {exam_type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-sm sm:text-[15px] font-semibold text-black">
                From
              </span>
              <div className="text-[10px] sm:text-sm lg:text-[10px] 2xl:text-sm font-semibold text-white bg-secondary bg-opacity-70 py-[2px] px-2 rounded-full">
                {formatDateTime(start_date)}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm sm:text-[15px] font-semibold text-black">
                To
              </span>
              <div className="text-[10px] sm:text-sm lg:text-[10px] 2xl:text-sm font-semibold text-white bg-secondary bg-opacity-70 py-[2px] px-2 rounded-full">
                {formatDateTime(end_Date)}
              </div>
            </div>
          </div>

          <div className="overflow-hidden shadow my-3">
            <img
              src={image}
              alt="Round"
              className="transition ease-linear duration-200 hover:scale-110 w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 items-stretch justify-center mx-auto my-6 max-w-6xl">
            {/* Trophy */}
            <div className="flex items-center justify-center flex-col">
              <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 w-full h-full min-h-[150px]">
                <BsFillTrophyFill className="text-[#540F6B] text-4xl" />
                <h3 className="font-semibold text-black mt-2 text-lg">
                  {next_round_qualifier}
                </h3>
                <h4 className="text-center text-sm text-gray-600">
                  Next Round Qualifier
                </h4>
              </div>
            </div>

            {/* Questions */}
            <div className="flex items-center justify-center flex-col">
              <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 w-full h-full min-h-[150px]">
                <BsFillQuestionCircleFill className="text-[#540F6B] text-4xl" />
                <h3 className="font-semibold text-black mt-2 text-lg">
                  {total_question}
                </h3>
                <h4 className="text-center text-sm text-gray-600">
                  Total Question
                </h4>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center justify-center flex-col">
              <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 w-full h-full min-h-[150px]">
                <MdWatchLater className="text-[#540F6B] text-4xl" />
                <h3 className="font-semibold text-black mt-2 text-lg">
                  {formatTime(duration)}
                </h3>
                <h4 className="text-center text-sm text-gray-600">
                  Time Duration
                </h4>
              </div>
            </div>
          </div>

          {/* Buttons Section - শুধু এখানে চেঞ্জ */}
          <div>
            {round_status === "upcoming" && !is_participated && (
              <button className="bg-yellow-400 w-full rounded-full text-base font-semibold text-white py-3 transition">
                UPCOMING
              </button>
            )}

            {round_status === "active" && !is_participated && (
              <button
                onClick={() => onParticipate(round)} // ← এখানে round.id পাঠাচ্ছে
                disabled={!isParticipateEnabled}
                className="bg-secondary w-full rounded-full text-base font-semibold text-white py-3 transition hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                PARTICIPATE
              </button>
            )}

            {round_status === "completed" && !is_participated && (
              <button
                disabled
                className="bg-gray-500 w-full rounded-full text-base font-semibold text-white py-3 opacity-60 cursor-not-allowed"
              >
                Quiz Ended
              </button>
            )}

            {is_participated && (
              <Link
                to={`/student/participation-details/${round}`}
                className="block w-full text-center bg-secondary hover:bg-secondary/90 text-white font-bold py-3 rounded-full transition"
              >
                VIEW RESULT
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentParticipateEventRounds;
// import { useState } from "react";
// import { BsFillQuestionCircleFill, BsFillTrophyFill } from "react-icons/bs";
// import { MdWatchLater } from "react-icons/md";
// import { Link, useNavigate } from "react-router-dom";
// import API from "../../../api/API";
// import { formatDateTime } from "../../../utils/FormateDateTime";
// import formatTime from "../../../utils/FormateTime";
// import ParticipateModal from "../roundAnnouncement/ParticipateModal";
// import QuizParticipateAlert from "../roundAnnouncement/QuizParticipateAlert";

// const StudentParticipateEventRounds = ({
//   layout = "vertical",
//   round, // ← এটা round.id (number) আসছে
//   quizId,
//   round_status,
//   is_participated,
//   image,
//   title,
//   subject,
//   exam_type,
//   start_date,
//   end_Date,
//   next_round_qualifier,
//   total_question,
//   duration,
//   isParticipateEnabled = true,
// }) => {
//   const isHorizontal = layout === "horizontal";
//   const navigate = useNavigate();

//   // States for Quiz Set Selection
//   const [showSetSelection, setShowSetSelection] = useState(false);
//   const [quizSets, setQuizSets] = useState([]);
//   const [loadingSets, setLoadingSets] = useState(false);
//   const [selectedSet, setSelectedSet] = useState(null);
//   const [showParticipateModal, setShowParticipateModal] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);

//   // handle participate
//   const handleParticipateClick = async (roundId) => {
//     if (!roundId) {
//       console.log("Round ID missing!");
//       return;
//     }

//     // if (!isParticipateEnabled) {
//     //   console.log("Quiz has not started yet!");
//     //   return;
//     // }

//     setLoadingSets(true);
//     try {
//       const response = await API.get(
//         `/qzz/view-event-quiz-set/anc/${quizId}/round/${roundId}/`
//       );

//       const sets = response.data || [];

//       if (sets.length === 0) {
//         console.log("No quiz sets available for this round.");
//         setLoadingSets(false);
//         return;
//       }

//       setQuizSets(sets);
//       setShowSetSelection(true);
//     } catch (err) {
//       console.error("API Error:", err);
//       console.log("Failed to load quiz sets. Please try again.");
//     } finally {
//       setLoadingSets(false);
//     }
//   };

//   const handleParticipateNow = (set) => {
//     setSelectedSet(set);
//     setShowSetSelection(false);
//     setShowParticipateModal(true);
//   };

//   const handleConfirmParticipate = () => {
//     setShowParticipateModal(false);
//     setShowAlert(true);
//   };

//   const handleStartQuiz = () => {
//     setShowAlert(false);
//     navigate(`/quiz/${quizId}/round/${round}/set/${selectedSet.id}`);
//   };

//   return (
//     <>
//       {/* Main Round Card - তোমার আগের UI অক্ষত */}
//       <div
//         className={`bg-white overflow-hidden transform transition ease-in-out duration-300 shadow hover:shadow-md p-3 rounded-lg ${
//           isHorizontal ? "flex gap-4 items-start" : ""
//         }`}
//       >
//         <div className={`p-4 ${isHorizontal ? "flex-1" : ""}`}>
//           <h3 className="text-2xl font-semibold text-black mt-2 mb-3">
//             {title}
//           </h3>

//           <div className="flex items-center flex-wrap gap-2 mb-3">
//             <div className="flex items-center gap-1 border border-gray-300 py-1 px-2 rounded-full">
//               <span className="text-[15px] font-semibold text-black min-w-20 inline-block">
//                 Subject: {subject}
//               </span>
//             </div>
//             <div className="flex border border-gray-300 py-1 px-2 rounded-full bg-pink-50">
//               <span className="text-[15px] font-semibold text-black min-w-20 inline-block">
//                 Type: {exam_type}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 lg:gap-2 xl:gap-4">
//             <div className="flex items-center gap-1">
//               <span className="text-sm sm:text-[15px] font-semibold text-black">
//                 From
//               </span>
//               <div className="text-[10px] sm:text-sm lg:text-[10px] 2xl:text-sm font-semibold text-white bg-secondary bg-opacity-70 py-[2px] px-2 rounded-full">
//                 {formatDateTime(start_date)}
//               </div>
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="text-sm sm:text-[15px] font-semibold text-black">
//                 To
//               </span>
//               <div className="text-[10px] sm:text-sm lg:text-[10px] 2xl:text-sm font-semibold text-white bg-secondary bg-opacity-70 py-[2px] px-2 rounded-full">
//                 {formatDateTime(end_Date)}
//               </div>
//             </div>
//           </div>

//           <div className="overflow-hidden shadow my-3">
//             <img
//               src={image}
//               alt="Round"
//               className="transition ease-linear duration-200 hover:scale-110 w-full"
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 items-stretch justify-center mx-auto my-6 max-w-6xl">
//             {/* Trophy */}
//             <div className="flex items-center justify-center flex-col">
//               <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 w-full h-full min-h-[150px]">
//                 <BsFillTrophyFill className="text-[#540F6B] text-4xl" />
//                 <h3 className="font-semibold text-black mt-2 text-lg">
//                   {next_round_qualifier}
//                 </h3>
//                 <h4 className="text-center text-sm text-gray-600">
//                   Next Round Qualifier
//                 </h4>
//               </div>
//             </div>

//             {/* Questions */}
//             <div className="flex items-center justify-center flex-col">
//               <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 w-full h-full min-h-[150px]">
//                 <BsFillQuestionCircleFill className="text-[#540F6B] text-4xl" />
//                 <h3 className="font-semibold text-black mt-2 text-lg">
//                   {total_question}
//                 </h3>
//                 <h4 className="text-center text-sm text-gray-600">
//                   Total Question
//                 </h4>
//               </div>
//             </div>

//             {/* Duration */}
//             <div className="flex items-center justify-center flex-col">
//               <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 w-full h-full min-h-[150px]">
//                 <MdWatchLater className="text-[#540F6B] text-4xl" />
//                 <h3 className="font-semibold text-black mt-2 text-lg">
//                   {formatTime(duration)}
//                 </h3>
//                 <h4 className="text-center text-sm text-gray-600">
//                   Time Duration
//                 </h4>
//               </div>
//             </div>
//           </div>

//           {/* Buttons Section */}
//           <div>
//             {round_status === "upcoming" && !is_participated && (
//               <button className="bg-yellow-400 w-full rounded-full text-base font-semibold text-white py-3 transition">
//                 UPCOMING
//               </button>
//             )}

//             {/* এই বাটনটাই মূল – এখন ১০০% কাজ করবে */}
//             {round_status === "active" && !is_participated && (
//               <button
//                 onClick={() => handleParticipateClick(round)} // round = round.id
//                 // disabled={loadingSets || !isParticipateEnabled}
//                 className="bg-secondary w-full rounded-full text-base font-semibold text-white py-3 transition hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loadingSets ? "Loading Sets..." : "PARTICIPATE"}
//               </button>
//             )}

//             {round_status === "completed" && !is_participated && (
//               <button
//                 disabled
//                 className="bg-gray-500 w-full rounded-full text-base font-semibold text-white py-3 opacity-60 cursor-not-allowed"
//               >
//                 Quiz Ended
//               </button>
//             )}

//             {is_participated && (
//               <Link
//                 to={`/student/participation-details/${round}`}
//                 className="block w-full text-center bg-secondary hover:bg-secondary/90 text-white font-bold py-3 rounded-full transition"
//               >
//                 VIEW RESULT
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Quiz Set Selection Modal */}
//       {showSetSelection && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold">Select Quiz Set</h2>
//               <button
//                 onClick={() => setShowSetSelection(false)}
//                 className="text-3xl"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {quizSets.map((set) => (
//                 <div
//                   key={set.id}
//                   className="border border-gray-300 rounded-xl p-6 bg-gray-50 hover:shadow-lg transition"
//                 >
//                   <h3 className="text-xl font-bold text-secondary mb-4">
//                     Quiz Set {set.id}
//                   </h3>
//                   <div className="space-y-2 text-sm">
//                     <p>
//                       <strong>Questions:</strong> {set.total_questions || "N/A"}
//                     </p>
//                     <p>
//                       <strong>Marks:</strong> {set.total_marks}
//                     </p>
//                     <p>
//                       <strong>Per Question:</strong> {set.marks_per_question}
//                     </p>
//                     {set.negative_marks_per_question !== "0.00" && (
//                       <p className="text-red-600">
//                         <strong>Negative:</strong> -
//                         {set.negative_marks_per_question}
//                       </p>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => handleParticipateNow(set)}
//                     className="mt-6 w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3 rounded-full transition"
//                   >
//                     Participate Now
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modals */}
//       {showParticipateModal && (
//         <ParticipateModal
//           onCancel={() => setShowParticipateModal(false)}
//           onConfirm={handleConfirmParticipate}
//         />
//       )}
//       {showAlert && (
//         <QuizParticipateAlert
//           onClose={() => setShowAlert(false)}
//           onContinue={handleStartQuiz}
//         />
//       )}
//     </>
//   );
// };

// export default StudentParticipateEventRounds;

// import { useState } from "react";
// import { BsFillQuestionCircleFill, BsFillTrophyFill } from "react-icons/bs";
// import { MdWatchLater } from "react-icons/md";
// import { Link, useNavigate } from "react-router-dom";
// import API from "../../../api/API"; // তোমার API instance
// import { formatDateTime } from "../../../utils/FormateDateTime";
// import formatTime from "../../../utils/FormateTime";
// import ParticipateModal from "../roundAnnouncement/ParticipateModal";
// import QuizParticipateAlert from "../roundAnnouncement/QuizParticipateAlert";

// const StudentParticipateEventRounds = ({
//   layout = "vertical",
//   round,
//   quizId,
//   round_status,
//   is_participated,
//   image,
//   title,
//   subject,
//   exam_type,
//   start_date,
//   end_Date,
//   next_round_qualifier,
//   total_question,
//   duration,
//   isParticipateEnabled = true, // Countdown থেকে আসবে
// }) => {
//   const isHorizontal = layout === "horizontal";
//   const navigate = useNavigate();

//   // নতুন ফিচারের জন্য স্টেট
//   const [showSetSelection, setShowSetSelection] = useState(false);
//   const [quizSets, setQuizSets] = useState([]);
//   const [loadingSets, setLoadingSets] = useState(false);
//   const [selectedSet, setSelectedSet] = useState(null);
//   const [showParticipateModal, setShowParticipateModal] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);

//   // PARTICIPATE বাটনে ক্লিক → কুইজ সেট লোড
//   const handleParticipateClick = async (roundId) => {
//     if (!roundId) {
//       console.error("Round ID is missing!");
//       return;
//     }

//     if (!isParticipateEnabled) {
//       alert("Quiz has not started yet!");
//       return;
//     }

//     setLoadingSets(true);
//     try {
//       const response = await API.get(
//         `/qzz/view-event-quiz-set/anc/${quizId}/round/${roundId}/`
//       );

//       const sets = response.data || [];

//       if (sets.length === 0) {
//         alert("No quiz sets available for this round.");
//         return;
//       }

//       setQuizSets(sets);
//       setShowSetSelection(true);
//     } catch (err) {
//       console.error("Error fetching quiz sets:", err);
//       alert("Failed to load quiz sets. Please try again later.");
//     } finally {
//       setLoadingSets(false);
//     }
//   };

//   const handleParticipateNow = (set) => {
//     setSelectedSet(set);
//     setShowSetSelection(false);
//     setShowParticipateModal(true);
//   };

//   const handleConfirmParticipate = () => {
//     setShowParticipateModal(false);
//     setShowAlert(true);
//   };

//   const handleStartQuiz = () => {
//     setShowAlert(false);
//     navigate(`/quiz/${quizId}/round/${round}/set/${selectedSet.id}`);
//   };

//   return (
//     <>
//       {/* তোমার আগের UI – একদম অপরিবর্তিত */}
//       <div
//         className={`bg-white overflow-hidden transform transition ease-in-out duration-300 shadow hover:shadow-md p-3 rounded-lg ${
//           isHorizontal ? "flex gap-4 items-start" : ""
//         }`}
//       >
//         <div className={`p-4 ${isHorizontal ? "flex-1" : ""}`}>
//           <h3 className="text-2xl font-semibold text-black mt-2 mb-3">
//             {title}
//           </h3>

//           <div className="flex items-center flex-wrap gap-2 mb-3">
//             <div className="flex items-center gap-1 border border-gray-300 py-1 px-2 rounded-full">
//               <span className="text-[15px] font-semibold text-black min-w-20 inline-block">
//                 Subject: {subject}
//               </span>
//             </div>
//             <div className="flex border border-gray-300 py-1 px-2 rounded-full bg-pink-50">
//               <span className="text-[15px] font-semibold text-black min-w-20 inline-block">
//                 Type: {exam_type}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 lg:gap-2 xl:gap-4">
//             <div className="flex items-center gap-1">
//               <span className="text-sm sm:text-[15px] font-semibold text-black">
//                 From
//               </span>
//               <div className="text-[10px] sm:text-sm lg:text-[10px] 2xl:text-sm font-semibold text-white bg-secondary bg-opacity-70 py-[2px] px-2 rounded-full">
//                 {formatDateTime(start_date)}
//               </div>
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="text-sm sm:text-[15px] font-semibold text-black">
//                 To
//               </span>
//               <div className="text-[10px] sm:text-sm lg:text-[10px] 2xl:text-sm font-semibold text-white bg-secondary bg-opacity-70 py-[2px] px-2 rounded-full">
//                 {formatDateTime(end_Date)}
//               </div>
//             </div>
//           </div>

//           <div className="overflow-hidden shadow my-3">
//             <img
//               src={image}
//               alt="Round"
//               className="transition ease-linear duration-200 hover:scale-110 w-full"
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 items-stretch justify-center mx-auto my-6 max-w-6xl">
//             <div className="flex items-center justify-center flex-col">
//               <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 sm:p-5 xs:p-4 w-full h-full min-h-[150px]">
//                 <BsFillTrophyFill className="text-[#540F6B] text-xl xl:text-lg 2xl:text-xl lg:text-xl md:text-3xl sm:text-2xl xs:text-xl" />
//                 <h3 className="font-semibold text-black mt-2 text-lg lg:text-xl md:text-xl sm:text-lg xs:text-base">
//                   {next_round_qualifier}
//                 </h3>
//                 <h4 className="text-center font-semibold text-black mt-1 text-base lg:text-sm 2xl:text-base md:text-sm sm:text-sm xs:text-xs">
//                   Next Round Qualifier
//                 </h4>
//               </div>
//             </div>

//             <div className="flex items-center justify-center flex-col">
//               <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 sm:p-5 xs:p-4 w-full h-full min-h-[150px]">
//                 <BsFillQuestionCircleFill className="text-[#540F6B] text-xl xl:text-lg 2xl:text-xl md:text-xl sm:text-2xl xs:text-xl" />
//                 <h3 className="font-semibold text-black mt-2 text-lg lg:text-xl md:text-xl sm:text-lg xs:text-base">
//                   {total_question}
//                 </h3>
//                 <h4 className="text-center font-semibold text-black mt-1 text-base lg:text-sm 2xl:text-base md:text-sm sm:text-sm xs:text-xs">
//                   Total Question
//                 </h4>
//               </div>
//             </div>

//             <div className="flex items-center justify-center flex-col">
//               <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 sm:p-5 xs:p-4 w-full h-full min-h-[150px]">
//                 <MdWatchLater className="text-[#540F6B] text-xl xl:text-lg 2xl:text-xl md:text-3xl sm:text-2xl xs:text-xl" />
//                 <h3 className="font-semibold text-black mt-2 text-lg lg:text-xl md:text-xl sm:text-lg xs:text-base">
//                   {formatTime(duration)}
//                 </h3>
//                 <h4 className="text-center font-semibold text-black mt-1 text-base lg:text-sm 2xl:text-base md:text-sm sm:text-sm xs:text-xs">
//                   Time Duration
//                 </h4>
//               </div>
//             </div>
//           </div>

//           {/* বাটন সেকশন – তোমার চাওয়া মতো */}
//           <div>
//             {round_status === "upcoming" && !is_participated && (
//               <button className="bg-yellow-400 w-full rounded-full text-base font-semibold text-white py-[6px] transition">
//                 UPCOMING
//               </button>
//             )}

//             {round_status === "active" && !is_participated && (
//               <button
//                 onClick={() => handleParticipateClick(round)} // এখানে round id পাস হচ্ছে
//                 // disabled={loadingSets || !isParticipateEnabled} // কমেন্ট করা রাখলাম, পরে চাইলে খুলবে
//                 className="bg-secondary w-full rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loadingSets ? "Loading..." : "PARTICIPATE"}
//               </button>
//             )}

//             {round_status === "completed" && !is_participated && (
//               <button
//                 disabled
//                 className="bg-primary w-full rounded-full text-base font-semibold text-white py-[6px] opacity-60 cursor-not-allowed"
//               >
//                 Quiz Ended
//               </button>
//             )}

//             {is_participated && (
//               <Link
//                 to={`/student/participation-details/${round}`}
//                 className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary"
//               >
//                 VIEW RESULT
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Quiz Set Selection Modal */}
//       {showSetSelection && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Select Quiz Set
//               </h2>
//               <button
//                 onClick={() => setShowSetSelection(false)}
//                 className="text-3xl text-gray-500 hover:text-gray-800"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {quizSets.map((set) => (
//                 <div
//                   key={set.id}
//                   className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50 hover:border-secondary transition"
//                 >
//                   <h3 className="text-xl font-bold text-secondary mb-4">
//                     Quiz Set - {set.id}
//                   </h3>
//                   <div className="space-y-2 text-sm text-gray-700">
//                     <p>
//                       <strong>Total Questions:</strong>{" "}
//                       {set.total_questions || "N/A"}
//                     </p>
//                     <p>
//                       <strong>Total Marks:</strong> {set.total_marks}
//                     </p>
//                     <p>
//                       <strong>Marks per Question:</strong>{" "}
//                       {set.marks_per_question}
//                     </p>
//                     {set.negative_marks_per_question !== "0.00" && (
//                       <p className="text-red-600">
//                         <strong>Negative Marking:</strong> -
//                         {set.negative_marks_per_question}
//                       </p>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => handleParticipateNow(set)}
//                     className="mt-6 w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3 rounded-full transition"
//                   >
//                     Participate Now
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Participate Confirmation Modal */}
//       {showParticipateModal && selectedSet && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//           <ParticipateModal
//             onCancel={() => setShowParticipateModal(false)}
//             onConfirm={handleConfirmParticipate}
//           />
//         </div>
//       )}

//       {/* Final Alert Before Quiz Start */}
//       {showAlert && selectedSet && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//           <QuizParticipateAlert
//             onClose={() => setShowAlert(false)}
//             onContinue={handleStartQuiz}
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default StudentParticipateEventRounds;

// import { useState } from "react";
// import { BsFillQuestionCircleFill, BsFillTrophyFill } from "react-icons/bs";
// import { MdWatchLater } from "react-icons/md";
// import { Link, useNavigate } from "react-router-dom";
// import { formatDateTime } from "../../../utils/FormateDateTime";
// import formatTime from "../../../utils/FormateTime";
// import ParticipateModal from "./ParticipateModal";
// import QuizParticipateAlert from "./QuizParticipateAlert";

// const StudentParticipateEventRounds = ({
//   layout = "vertical",
//   onParticipate,
//   is_participated,
//   image,
//   round,
//   quizId,
//   round_status,
//   title,
//   subject,
//   exam_type,
//   start_date,
//   end_Date,
//   next_round_qualifier,
//   total_question,
//   isParticipateEnabled,
//   duration,
//   disable,
// }) => {
//   const isHorizontal = layout === "horizontal";

//   console.log("participate status", is_participated);
//   console.log("round_status", round_status);

//   // console.log("is_participate", is_participate);

//   // modal state
//   const [showParticipateModal, setShowParticipateModal] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <>
//       <div
//         className={`bg-white overflow-hidden transform transition ease-in-out duration-300 shadow hover:shadow-md p-3 rounded-lg ${
//           isHorizontal ? "flex gap-4 items-start" : ""
//         }`}
//       >
//         {/* content */}
//         <div className={`p-4 ${isHorizontal ? "flex-1" : ""}`}>
//           <h3 className="text-2xl font-semibold text-black mt-2 mb-3">
//             {title}
//           </h3>
//           <div className="flex items-center flex-wrap gap-2 mb-3">
//             <div className="flex items-center gap-1 border border-gray-300 py-1 px-2 rounded-full">
//               <span className="text-[15px] font-semibold text-black min-w-20 inline-block">
//                 Subject: {subject}
//               </span>
//             </div>
//             <div className="flex border border-gray-300 py-1 px-2 rounded-full bg-pink-50">
//               <span className="text-[15px] font-semibold text-black min-w-20 inline-block">
//                 Type: {exam_type}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 lg:gap-2 xl:gap-4">
//             <div className="flex items-center gap-1">
//               <span className="text-sm sm:text-[15px] font-semibold text-black">
//                 From
//               </span>
//               <div className="text-[10px] sm:text-sm lg:text-[10px] 2xl:text-sm font-semibold text-white bg-secondary bg-opacity-70 py-[2px] px-2 rounded-full">
//                 {formatDateTime(start_date)}
//               </div>
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="text-sm sm:text-[15px] font-semibold text-black">
//                 To
//               </span>
//               <div className="text-[10px] sm:text-sm lg:text-[10px] 2xl:text-sm font-semibold text-white bg-secondary bg-opacity-70 py-[2px] px-2 rounded-full">
//                 {formatDateTime(end_Date)}
//               </div>
//             </div>
//           </div>

//           {/* image */}
//           <div className="overflow-hidden shadow my-3">
//             <img
//               src={image}
//               alt="Card Image"
//               className="transition ease-linear duration-200 hover:scale-110 overflow-hidden w-full"
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 items-stretch justify-center mx-auto my-6 max-w-6xl">
//             {/* Next Round Qualifier */}
//             <div className="flex items-center justify-center flex-col">
//               <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 sm:p-5 xs:p-4 w-full h-full min-h-[150px]">
//                 <BsFillTrophyFill className="text-[#540F6B] text-xl xl:text-lg 2xl:text-xl lg:text-xl md:text-3xl sm:text-2xl xs:text-xl" />
//                 <h3 className="font-semibold text-black mt-2 text-lg lg:text-xl md:text-xl sm:text-lg xs:text-base">
//                   {next_round_qualifier}
//                 </h3>
//                 <h4 className="text-center font-semibold text-black mt-1 text-base lg:text-sm 2xl:text-base md:text-sm sm:text-sm xs:text-xs">
//                   Next Round Qualifier
//                 </h4>
//               </div>
//             </div>

//             {/* Total Question */}
//             <div className="flex items-center justify-center flex-col">
//               <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 sm:p-5 xs:p-4 w-full h-full min-h-[150px]">
//                 <BsFillQuestionCircleFill className="text-[#540F6B] text-xl xl:text-lg 2xl:text-xl md:text-xl sm:text-2xl xs:text-xl" />
//                 <h3 className="font-semibold text-black mt-2 text-lg lg:text-xl md:text-xl sm:text-lg xs:text-base">
//                   {total_question}
//                 </h3>
//                 <h4 className="text-center font-semibold text-black mt-1 text-base lg:text-sm 2xl:text-base md:text-sm sm:text-sm xs:text-xs">
//                   Total Question
//                 </h4>
//               </div>
//             </div>

//             {/* Time Duration */}
//             <div className="flex items-center justify-center flex-col">
//               <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 sm:p-5 xs:p-4 w-full h-full min-h-[150px]">
//                 <MdWatchLater className="text-[#540F6B] text-xl xl:text-lg 2xl:text-xl md:text-3xl sm:text-2xl xs:text-xl" />
//                 <h3 className="font-semibold text-black mt-2 text-lg lg:text-xl md:text-xl sm:text-lg xs:text-base">
//                   {formatTime(duration)}
//                 </h3>
//                 <h4 className="text-center font-semibold text-black mt-1 text-base lg:text-sm 2xl:text-base md:text-sm sm:text-sm xs:text-xs">
//                   Time Duration
//                 </h4>
//               </div>
//             </div>
//           </div>

//           <div>
//             {round_status === "upcoming" && !is_participated && (
//               <button className="bg-yellow-400 w-full rounded-full text-base font-semibold text-white py-[6px] transition">
//                 UPCOMING
//               </button>
//             )}

//             {/* {disable === "true" ? (
//               <button
//                 disabled
//                 className="bg-secondary w-full rounded-full text-base font-semibold text-white py-[6px] opacity-50 cursor-not-allowed"
//               >
//                 QUIZ END
//               </button>
//             ) : (
//               round_status === "active" &&
//               !is_participated && (
//                 <button
//                   className="bg-secondary w-full rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
//                   onClick={() => setShowParticipateModal(true)}
//                 >
//                   PARTICIPATE
//                 </button>
//               )
//             )} */}

//             {round_status === "active" && !is_participated && (
//               <button
//                 className="bg-secondary w-full rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={() => setShowParticipateModal(true)}
//               >
//                 PARTICIPATE
//               </button>
//             )}

//             {round_status === "completed" && !is_participated && (
//               <button
//                 disabled
//                 className="bg-primary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
//               >
//                 Quiz Ended
//               </button>
//             )}
//             {round_status === "active" && is_participated && (
//               <Link
//                 to={`/student/participation-details/${round}`}
//                 className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
//               >
//                 VIEW RESULT
//               </Link>
//             )}

//             {round_status === "completed" && is_participated && (
//               <Link
//                 to={`/student/participation-details/${round}`}
//                 className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
//               >
//                 VIEW RESULT
//               </Link>
//             )}

//             {/* {round_status === "upcoming" && is_participated === false && (
//               <button className="bg-yellow-400 w-full rounded-full text-base font-semibold text-white py-[6px] transition">
//                 UPCOMING
//               </button>
//             )}
//             {round_status === "active" && is_participated === false && (
//               <button
//                 className="bg-secondary w-full rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={() => setShowParticipateModal(true)}
//                 disabled={!isParticipateEnabled}
//               >
//                 PARTICIPATE
//               </button>
//             )}
//             {round_status === "active" && is_participated === true && (
//               <Link
//                 to={`/student/participation-details/${round}`}
//                 className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
//               >
//                 VIEW RESULT
//               </Link>
//             )}
//             {round_status === "completed" && is_participated === true && (
//               <Link
//                 to={`/student/participation-details/${round}`}
//                 className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
//               >
//                 VIEW RESULT
//               </Link>
//             )}
//             {round_status === "completed" && is_participated === false && (
//               <Link
//                 to={`/student/participation-details/${round}`}
//                 className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
//               >
//                 Quiz Ended
//               </Link>
//             )} */}
//           </div>
//         </div>
//       </div>
//       {/* Participate Modal */}
//       {showParticipateModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <ParticipateModal
//             round={round}
//             quizId={quizId}
//             onCancel={() => setShowParticipateModal(false)}
//             onConfirm={() => {
//               setShowParticipateModal(false);
//               setShowAlert(true);
//             }}
//           />
//         </div>
//       )}

//       {/* Quiz Participate Alert */}
//       {showAlert && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <QuizParticipateAlert
//             round={round}
//             quizId={quizId}
//             onClose={() => setShowAlert(false)}
//             onContinue={() => {
//               setShowAlert(false);
//               navigate(`/quiz/${round}/${quizId}`);
//             }}
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default StudentParticipateEventRounds;

// // import { useState } from "react";
// // import { BsFillQuestionCircleFill, BsFillTrophyFill } from "react-icons/bs";
// // import { MdWatchLater } from "react-icons/md";
// // import { Link, useNavigate } from "react-router-dom";
// // import { formatDateTime } from "../../../utils/FormateDateTime";
// // import formatTime from "../../../utils/FormateTime";
// // import ParticipateModal from "./ParticipateModal";
// // import QuizParticipateAlert from "./QuizParticipateAlert";

// // const StudentParticipateEventRounds = ({
// //   layout = "vertical",
// //   onParticipate,
// //   is_participated,
// //   image,
// //   round,
// //   quizId,
// //   round_status,
// //   title,
// //   subject,
// //   exam_type,
// //   start_date,
// //   end_Date,
// //   next_round_qualifier,
// //   total_question,
// //   isParticipateEnabled,
// //   duration,
// // }) => {
// //   const isHorizontal = layout === "horizontal";

// //   console.log("participate status", is_participated);
// //   console.log("round_status", round_status);

// //   // console.log("is_participate", is_participate);

// //   // modal state
// //   const [showParticipateModal, setShowParticipateModal] = useState(false);
// //   const [showAlert, setShowAlert] = useState(false);
// //   const navigate = useNavigate();

// //   return (
// //     <>
// //       <div
// //         className={`bg-white overflow-hidden transform transition ease-in-out duration-300 shadow hover:shadow-md p-3 rounded-lg ${
// //           isHorizontal ? "flex gap-4 items-start" : ""
// //         }`}
// //       >
// //         {/* content */}
// //         <div className={`p-4 ${isHorizontal ? "flex-1" : ""}`}>
// //           <h3 className="text-2xl font-semibold text-black mt-2 mb-3">
// //             {title}
// //           </h3>
// //           <div className="flex items-center gap-2 mb-3">
// //             <div className="flex items-center gap-1 border border-gray-300 py-1 px-2 rounded-full">
// //               <span className="text-[15px] font-semibold text-black min-w-20 inline-block">
// //                 Subject: {subject}
// //               </span>
// //             </div>
// //             <div className="flex border border-gray-300 py-1 px-2 rounded-full bg-pink-50">
// //               <span className="text-[15px] font-semibold text-black min-w-20 inline-block">
// //                 Type: {exam_type}
// //               </span>
// //             </div>
// //           </div>

// //           <div className="flex items-center gap-4 lg:gap-2 xl:gap-4">
// //             <div className="flex items-center gap-1">
// //               <span className="text-sm sm:text-[15px] font-semibold text-black">
// //                 From
// //               </span>
// //               <div className="text-[10px] sm:text-sm lg:text-[10px] 2xl:text-sm font-semibold text-white bg-secondary bg-opacity-70 py-[2px] px-2 rounded-full">
// //                 {formatDateTime(start_date)}
// //               </div>
// //             </div>
// //             <div className="flex items-center gap-1">
// //               <span className="text-sm sm:text-[15px] font-semibold text-black">
// //                 To
// //               </span>
// //               <div className="text-[10px] sm:text-sm lg:text-[10px] 2xl:text-sm font-semibold text-white bg-secondary bg-opacity-70 py-[2px] px-2 rounded-full">
// //                 {formatDateTime(end_Date)}
// //               </div>
// //             </div>
// //           </div>

// //           {/* image */}
// //           <div
// //             className={`overflow-hidden shadow my-3 ${
// //               isHorizontal ? "w-1/2" : ""
// //             }`}
// //           >
// //             <img
// //               src={image}
// //               alt="Card Image"
// //               className="transition ease-linear duration-200 hover:scale-110 overflow-hidden w-full"
// //             />
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 items-stretch justify-center mx-auto my-12 max-w-6xl">
// //             {/* Next Round Qualifier */}
// //             <div className="flex items-center justify-center flex-col">
// //               <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 sm:p-5 xs:p-4 w-full h-full min-h-[150px]">
// //                 <BsFillTrophyFill className="text-[#540F6B] text-xl xl:text-lg 2xl:text-xl lg:text-xl md:text-3xl sm:text-2xl xs:text-xl" />
// //                 <h3 className="font-semibold text-black mt-2 text-lg lg:text-xl md:text-xl sm:text-lg xs:text-base">
// //                   {next_round_qualifier}
// //                 </h3>
// //                 <h4 className="text-center font-semibold text-black mt-1 text-base lg:text-sm 2xl:text-base md:text-sm sm:text-sm xs:text-xs">
// //                   Next Round Qualifier
// //                 </h4>
// //               </div>
// //             </div>

// //             {/* Total Question */}
// //             <div className="flex items-center justify-center flex-col">
// //               <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 sm:p-5 xs:p-4 w-full h-full min-h-[150px]">
// //                 <BsFillQuestionCircleFill className="text-[#540F6B] text-xl xl:text-lg 2xl:text-xl md:text-xl sm:text-2xl xs:text-xl" />
// //                 <h3 className="font-semibold text-black mt-2 text-lg lg:text-xl md:text-xl sm:text-lg xs:text-base">
// //                   {total_question}
// //                 </h3>
// //                 <h4 className="text-center font-semibold text-black mt-1 text-base lg:text-sm 2xl:text-base md:text-sm sm:text-sm xs:text-xs">
// //                   Total Question
// //                 </h4>
// //               </div>
// //             </div>

// //             {/* Time Duration */}
// //             <div className="flex items-center justify-center flex-col">
// //               <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 sm:p-5 xs:p-4 w-full h-full min-h-[150px]">
// //                 <MdWatchLater className="text-[#540F6B] text-xl xl:text-lg 2xl:text-xl md:text-3xl sm:text-2xl xs:text-xl" />
// //                 <h3 className="font-semibold text-black mt-2 text-lg lg:text-xl md:text-xl sm:text-lg xs:text-base">
// //                   {formatTime(duration)}
// //                 </h3>
// //                 <h4 className="text-center font-semibold text-black mt-1 text-base lg:text-sm 2xl:text-base md:text-sm sm:text-sm xs:text-xs">
// //                   Time Duration
// //                 </h4>
// //               </div>
// //             </div>
// //           </div>

// //           <div>
// //             {round_status === "upcoming" && !is_participated && (
// //               <button className="bg-yellow-400 w-full rounded-full text-base font-semibold text-white py-[6px] transition">
// //                 UPCOMING
// //               </button>
// //             )}

// //             {round_status === "active" && !is_participated && (
// //               <button
// //                 className="bg-secondary w-full rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
// //                 onClick={() => setShowParticipateModal(true)}
// //                 disabled={!isParticipateEnabled}
// //               >
// //                 PARTICIPATE
// //               </button>
// //             )}

// //             {round_status === "completed" && !is_participated && (
// //               <button
// //                 disabled
// //                 className="bg-primary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
// //               >
// //                 Quiz Ended
// //               </button>
// //             )}
// //             {round_status === "active" && is_participated && (
// //               <Link
// //                 to={`/student/participation-details/${round}`}
// //                 className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
// //               >
// //                 VIEW RESULT
// //               </Link>
// //             )}

// //             {round_status === "completed" && is_participated && (
// //               <Link
// //                 to={`/student/participation-details/${round}`}
// //                 className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
// //               >
// //                 VIEW RESULT
// //               </Link>
// //             )}

// //             {/* {round_status === "upcoming" && is_participated === false && (
// //               <button className="bg-yellow-400 w-full rounded-full text-base font-semibold text-white py-[6px] transition">
// //                 UPCOMING
// //               </button>
// //             )}
// //             {round_status === "active" && is_participated === false && (
// //               <button
// //                 className="bg-secondary w-full rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
// //                 onClick={() => setShowParticipateModal(true)}
// //                 disabled={!isParticipateEnabled}
// //               >
// //                 PARTICIPATE
// //               </button>
// //             )}
// //             {round_status === "active" && is_participated === true && (
// //               <Link
// //                 to={`/student/participation-details/${round}`}
// //                 className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
// //               >
// //                 VIEW RESULT
// //               </Link>
// //             )}
// //             {round_status === "completed" && is_participated === true && (
// //               <Link
// //                 to={`/student/participation-details/${round}`}
// //                 className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
// //               >
// //                 VIEW RESULT
// //               </Link>
// //             )}
// //             {round_status === "completed" && is_participated === false && (
// //               <Link
// //                 to={`/student/participation-details/${round}`}
// //                 className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
// //               >
// //                 Quiz Ended
// //               </Link>
// //             )} */}
// //           </div>
// //         </div>
// //       </div>
// //       {/* Participate Modal */}
// //       {showParticipateModal && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
// //           <ParticipateModal
// //             round={round}
// //             quizId={quizId}
// //             onCancel={() => setShowParticipateModal(false)}
// //             onConfirm={() => {
// //               setShowParticipateModal(false);
// //               setShowAlert(true);
// //             }}
// //           />
// //         </div>
// //       )}

// //       {/* Quiz Participate Alert */}
// //       {showAlert && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
// //           <QuizParticipateAlert
// //             round={round}
// //             quizId={quizId}
// //             onClose={() => setShowAlert(false)}
// //             onContinue={() => {
// //               setShowAlert(false);
// //               navigate(`/quiz/${round}/${quizId}`);
// //             }}
// //           />
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default StudentParticipateEventRounds;
