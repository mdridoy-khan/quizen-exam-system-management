import { useState } from "react";
import { BsFillQuestionCircleFill, BsFillTrophyFill } from "react-icons/bs";
import { MdWatchLater } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { formatDateTime } from "../../../utils/FormateDateTime";
import formatTime from "../../../utils/FormateTime";
import ParticipateModal from "./ParticipateModal";
import QuizParticipateAlert from "./QuizParticipateAlert";

const StudentParticipateRound = ({
  layout = "vertical",
  onParticipate,
  is_participated,
  image,
  round,
  quizId,
  round_status,
  title,
  subject,
  exam_type,
  start_date,
  end_Date,
  next_round_qualifier,
  total_question,
  isParticipateEnabled,
  duration,
  disable,
}) => {
  const isHorizontal = layout === "horizontal";

  console.log("participate status", is_participated);
  console.log("round_status", round_status);

  // console.log("is_participate", is_participate);

  // modal state
  const [showParticipateModal, setShowParticipateModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`bg-white overflow-hidden transform transition ease-in-out duration-300 shadow hover:shadow-md p-3 rounded-lg ${
          isHorizontal ? "flex gap-4 items-start" : ""
        }`}
      >
        {/* content */}
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

          <div className="flex items-center gap-4 lg:gap-2 xl:gap-4">
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

          {/* image */}
          <div className="overflow-hidden shadow my-3">
            <img
              src={image}
              alt="Card Image"
              className="transition ease-linear duration-200 hover:scale-110 overflow-hidden w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 items-stretch justify-center mx-auto my-6 max-w-6xl">
            {/* Next Round Qualifier */}
            <div className="flex items-center justify-center flex-col">
              <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 sm:p-5 xs:p-4 w-full h-full min-h-[150px]">
                <BsFillTrophyFill className="text-[#540F6B] text-xl xl:text-lg 2xl:text-xl lg:text-xl md:text-3xl sm:text-2xl xs:text-xl" />
                <h3 className="font-semibold text-black mt-2 text-lg lg:text-xl md:text-xl sm:text-lg xs:text-base">
                  {next_round_qualifier}
                </h3>
                <h4 className="text-center font-semibold text-black mt-1 text-base lg:text-sm 2xl:text-base md:text-sm sm:text-sm xs:text-xs">
                  Next Round Qualifier
                </h4>
              </div>
            </div>

            {/* Total Question */}
            <div className="flex items-center justify-center flex-col">
              <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 sm:p-5 xs:p-4 w-full h-full min-h-[150px]">
                <BsFillQuestionCircleFill className="text-[#540F6B] text-xl xl:text-lg 2xl:text-xl md:text-xl sm:text-2xl xs:text-xl" />
                <h3 className="font-semibold text-black mt-2 text-lg lg:text-xl md:text-xl sm:text-lg xs:text-base">
                  {total_question}
                </h3>
                <h4 className="text-center font-semibold text-black mt-1 text-base lg:text-sm 2xl:text-base md:text-sm sm:text-sm xs:text-xs">
                  Total Question
                </h4>
              </div>
            </div>

            {/* Time Duration */}
            <div className="flex items-center justify-center flex-col">
              <div className="relative bg-[#F5F3FF] flex flex-col items-center justify-center rounded-xl p-6 sm:p-5 xs:p-4 w-full h-full min-h-[150px]">
                <MdWatchLater className="text-[#540F6B] text-xl xl:text-lg 2xl:text-xl md:text-3xl sm:text-2xl xs:text-xl" />
                <h3 className="font-semibold text-black mt-2 text-lg lg:text-xl md:text-xl sm:text-lg xs:text-base">
                  {formatTime(duration)}
                </h3>
                <h4 className="text-center font-semibold text-black mt-1 text-base lg:text-sm 2xl:text-base md:text-sm sm:text-sm xs:text-xs">
                  Time Duration
                </h4>
              </div>
            </div>
          </div>

          <div>
            {round_status === "upcoming" && !is_participated && (
              <button className="bg-yellow-400 w-full rounded-full text-base font-semibold text-white py-[6px] transition">
                UPCOMING
              </button>
            )}

            {/* {disable === "true" ? (
              <button
                disabled
                className="bg-secondary w-full rounded-full text-base font-semibold text-white py-[6px] opacity-50 cursor-not-allowed"
              >
                QUIZ END
              </button>
            ) : (
              round_status === "active" &&
              !is_participated && (
                <button
                  className="bg-secondary w-full rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowParticipateModal(true)}
                >
                  PARTICIPATE
                </button>
              )
            )} */}

            {round_status === "active" && !is_participated && (
              <button
                className="bg-secondary w-full rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setShowParticipateModal(true)}
              >
                PARTICIPATE
              </button>
            )}

            {round_status === "completed" && !is_participated && (
              <button
                disabled
                className="bg-primary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
              >
                Quiz Ended
              </button>
            )}
            {round_status === "active" && is_participated && (
              <Link
                to={`/student/participation-details/${round}`}
                className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
              >
                VIEW RESULT
              </Link>
            )}

            {round_status === "completed" && is_participated && (
              <Link
                to={`/student/participation-details/${round}`}
                className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
              >
                VIEW RESULT
              </Link>
            )}

            {/* {round_status === "upcoming" && is_participated === false && (
              <button className="bg-yellow-400 w-full rounded-full text-base font-semibold text-white py-[6px] transition">
                UPCOMING
              </button>
            )}
            {round_status === "active" && is_participated === false && (
              <button
                className="bg-secondary w-full rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setShowParticipateModal(true)}
                disabled={!isParticipateEnabled}
              >
                PARTICIPATE
              </button>
            )}
            {round_status === "active" && is_participated === true && (
              <Link
                to={`/student/participation-details/${round}`}
                className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
              >
                VIEW RESULT
              </Link>
            )}
            {round_status === "completed" && is_participated === true && (
              <Link
                to={`/student/participation-details/${round}`}
                className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
              >
                VIEW RESULT
              </Link>
            )}
            {round_status === "completed" && is_participated === false && (
              <Link
                to={`/student/participation-details/${round}`}
                className="bg-secondary w-full flex items-center justify-center rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary)]"
              >
                Quiz Ended
              </Link>
            )} */}
          </div>
        </div>
      </div>
      {/* Participate Modal */}
      {showParticipateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ParticipateModal
            round={round}
            quizId={quizId}
            onCancel={() => setShowParticipateModal(false)}
            onConfirm={() => {
              setShowParticipateModal(false);
              setShowAlert(true);
            }}
          />
        </div>
      )}

      {/* Quiz Participate Alert */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <QuizParticipateAlert
            round={round}
            quizId={quizId}
            onClose={() => setShowAlert(false)}
            onContinue={() => {
              setShowAlert(false);
              navigate(`/quiz/${round}/${quizId}`);
            }}
          />
        </div>
      )}
    </>
  );
};

export default StudentParticipateRound;

// import { useState } from "react";
// import { BsFillQuestionCircleFill, BsFillTrophyFill } from "react-icons/bs";
// import { MdWatchLater } from "react-icons/md";
// import { Link, useNavigate } from "react-router-dom";
// import { formatDateTime } from "../../../utils/FormateDateTime";
// import formatTime from "../../../utils/FormateTime";
// import ParticipateModal from "./ParticipateModal";
// import QuizParticipateAlert from "./QuizParticipateAlert";

// const StudentParticipateRound = ({
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
//           <div className="flex items-center gap-2 mb-3">
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
//           <div
//             className={`overflow-hidden shadow my-3 ${
//               isHorizontal ? "w-1/2" : ""
//             }`}
//           >
//             <img
//               src={image}
//               alt="Card Image"
//               className="transition ease-linear duration-200 hover:scale-110 overflow-hidden w-full"
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 items-stretch justify-center mx-auto my-12 max-w-6xl">
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

//             {round_status === "active" && !is_participated && (
//               <button
//                 className="bg-secondary w-full rounded-full text-base font-semibold text-white py-[6px] transition hover:text-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={() => setShowParticipateModal(true)}
//                 disabled={!isParticipateEnabled}
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

// export default StudentParticipateRound;
