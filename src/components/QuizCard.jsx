import { useMemo, useState } from "react";
import { GrCertificate } from "react-icons/gr";
import { IoMdRefresh } from "react-icons/io";
import { IoShareSocialSharp } from "react-icons/io5";
import { LuBadgeDollarSign } from "react-icons/lu";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { Link } from "react-router-dom";
import SocialShare from "./SocialShare";
import SwitcherToggleButton from "./SwitcherToggleButton";
import ToggleQuizOpenCloseModal from "./ToggleQuizOpenCloseModal";

const QuizCard = ({
  id,
  isActive,
  quizId,
  layout = "vertical",
  image,
  title,
  startDate,
  endDate,
  lp_status,
  shareQuestion,
  onButtonClick,
  rounds,
  duration,
  closedQuiz,
  registrationText,
  showCashPrize = true,
  showCertificate = true,
  termsLink = "/",
  organizer = "Fleek Bangladesh Bd",
  showSwitcher = false,
  annOpenClose = false,
  winnerList = [],
  subject,
  department_name,
  activeAnn,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const isHorizontal = layout === "horizontal";

  // console.log("lp_status", lp_status);
  // console.log("endDate", endDate);

  const domain = window.location.origin;

  // Check if endDate has passed
  const isExpired = useMemo(() => {
    try {
      const quizEnd = new Date(endDate);
      const now = new Date();
      return now > quizEnd;
    } catch (err) {
      // console.error("Invalid date:", endDate);
      return false;
    }
  }, [endDate]);

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden transform transition-all duration-300 shadow-md hover:shadow-xl relative z-20 ${
        isHorizontal ? "md:flex" : ""
      }`}
    >
      {/* Card wrapper for vertical layout */}
      {!isHorizontal ? (
        <div className="flex flex-col">
          {/* Title and Date - Top Section */}
          <div className="px-6 pt-6 pb-4">
            <h4 className="text-[22px] font-bold text-gray-900 mb-3">
              {title}
            </h4>
            <p className="text-sm text-secondary font-medium">
              {startDate} to {endDate}
            </p>
          </div>

          {/* subject and Department name */}
          <div className="px-6 pb-4 flex items-center flex-wrap gap-2">
            <Link
              to={`/announcement-details/${quizId}`}
              state={{ scrollTo: "gratifications" }}
              className="text-sm text-gray-600 border border-gray-300 py-1 px-2 rounded-full"
            >
              <span className="text-gray-500">Subject:</span>{" "}
              <span className="font-semibold text-gray-800">{subject}</span>
            </Link>
            <Link
              to={`/announcement-details/${quizId}`}
              state={{ scrollTo: "gratifications" }}
              className="flex items-center gap-1 border border-gray-300 py-1 px-2 rounded-full bg-pink-50"
            >
              <span className="text-sm font-semibold text-gray-700">
                Departmenent:
              </span>
              <span className="text-sm font-bold text-green-600">
                {department_name}
              </span>
            </Link>
          </div>
          {/* Organizer and Prize Info */}
          <div className="px-6 pb-4 flex items-center gap-2">
            <Link
              to={`/announcement-details/${quizId}`}
              state={{ scrollTo: "gratifications" }}
              className="text-sm text-gray-600 border border-gray-300 py-1 px-2 rounded-full"
            >
              <span className="text-gray-500">By:</span>{" "}
              <span className="font-semibold text-gray-800">{organizer}</span>
            </Link>
            {showCashPrize && (
              <Link
                to={`/announcement-details/${quizId}`}
                state={{ scrollTo: "gratifications" }}
                className="flex items-center gap-1 border border-gray-300 py-1 px-2 rounded-full bg-pink-50"
              >
                <span className="text-sm font-semibold text-gray-700">
                  Prize:
                </span>
                <span className="text-sm font-bold text-green-600">Cash</span>
              </Link>
            )}
          </div>

          {/* Card Image */}
          <div className="relative overflow-hidden mx-6 rounded-xl">
            <img
              src={image}
              alt="quiz"
              className="transition-transform duration-500 ease-in-out hover:scale-105 object-cover w-full h-[200px]"
            />
            {showSwitcher && (
              <div className="absolute top-3 right-3">
                <SwitcherToggleButton id={id} isActive={isActive} />
              </div>
            )}
            {annOpenClose && (
              <div className="absolute top-3 left-3">
                <ToggleQuizOpenCloseModal id={id} isActive={isActive} />
              </div>
            )}
          </div>

          {/* Rounds & Duration Info */}
          <div className="px-6 pt-5">
            {/* <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-black flex items-center justify-center">
                <FiPlusCircle className="text-black" size={24} />
              </div>
            </div> */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setIsShareOpen(true)}
                className="text-black hover:text-primary"
              >
                <IoShareSocialSharp className="text-xl" />
              </button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <IoMdRefresh className="text-black" size={20} />
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-gray-800">{rounds}</p>
                    <p className="text-sm text-gray-500">Rounds</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MdOutlineAccessTimeFilled className="text-black" size={24} />
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-gray-800">
                      {duration}
                    </p>
                    <p className="text-sm text-gray-500">Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SocialShare
            url={`${domain}/announcement-details/${quizId}`}
            title=""
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
          />

          {/* Action Button */}
          <div className="px-6 my-4 border-b border-gray-200">
            {closedQuiz && lp_status === "open" && (
              <button
                disabled
                className="w-full text-base font-bold rounded-lg leading-10  bg-gray-200 text-gray-500 cursor-not-allowed"
              >
                {closedQuiz}
              </button>
            )}

            {!closedQuiz && lp_status === "open" && (
              <Link
                to={`/announcement-details/${quizId}`}
                className="block w-full mb-4 text-center text-base leading-10  font-bold text-white rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Register Now
              </Link>
            )}
            {activeAnn === "true" && lp_status === "open" && (
              <button
                disabled
                className="block w-full mb-4 text-center text-base leading-10  font-bold text-white rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg ursor-not-allowed"
              >
                Registration Running
              </button>
            )}

            {lp_status === "upcoming" && (
              <button
                disabled
                className="w-full text-base mb-4 font-bold rounded-lg leading-10  bg-gradient-to-r from-yellow-200 to-orange-200 text-gray-500 cursor-not-allowed"
              >
                Upcoming
              </button>
            )}

            {lp_status === "closed" && (
              <button
                disabled
                className="w-full text-base mb-4 font-bold leading-10  rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
              >
                Registration Closed
              </button>
            )}

            {shareQuestion && !isExpired && (
              <button
                onClick={onButtonClick}
                className="w-full text-base font-bold text-white mb-4 leading-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {shareQuestion}
              </button>
            )}
          </div>

          {/* Winner List */}
          {winnerList.length > 0 && (
            <div className="px-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 place-items-center">
                {winnerList.map((item) => (
                  <div
                    key={item.user_id}
                    className="flex flex-col items-center justify-center gap-1"
                  >
                    <p className="text-sm font-semibold text-gray-700">
                      {item.position}
                    </p>
                    <img
                      src={item.profile_picture}
                      alt="Quiz Winner"
                      className="w-12 h-12 rounded-full"
                    />
                    <h3 className="text-xs text-gray-600">{item.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificate Link - Bottom */}
          <div className="flex items-center justify-between pt-2">
            {showCertificate && (
              <div className="px-6 pb-4">
                <Link
                  to={`/announcement-details/${quizId}`}
                  state={{ scrollTo: "gratifications" }}
                  className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors underline"
                >
                  <GrCertificate size={16} />
                  <span className="font-medium">E-Certificate</span>
                </Link>
              </div>
            )}

            {/* Terms Link */}
            <div className="px-6 pb-4">
              <Link
                to={`/announcement-details/${quizId}`}
                state={{ scrollTo: "terms" }}
                className="block text-center text-xs text-gray-500 hover:text-primary hover:underline transition underline"
              >
                View T&C
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // Horizontal Layout (Original)
        <>
          {/* card image */}
          <div className="relative overflow-hidden md:w-1/2">
            <img
              src={image}
              alt="quiz"
              className="transition-transform duration-500 ease-in-out hover:scale-110 object-cover h-[300px] w-full"
            />
            {showSwitcher && (
              <div className="absolute top-3 right-3">
                <SwitcherToggleButton id={id} isActive={isActive} />
              </div>
            )}
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent text-white px-4 py-2">
              <h4 className="text-lg font-semibold truncate">{title}</h4>
            </div>
          </div>

          {/* card content */}
          <div className="p-5 flex flex-col justify-between md:w-1/2">
            {/* Dates */}
            <div className="flex items-center justify-between text-sm mb-4">
              <p className="font-medium">
                From:{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent font-bold">
                  {startDate}
                </span>
              </p>
              <p className="font-medium">
                To:{" "}
                <span className="bg-gradient-to-r from-red-500 to-rose-700 bg-clip-text text-transparent font-bold">
                  {endDate}
                </span>
              </p>
            </div>

            {/* Rounds & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center  gap-4">
                <div className="text-center">
                  <h4 className="font-bold text-lg text-gray-800">{rounds}</h4>
                  <span className="text-base text-gray-500">Rounds</span>
                </div>
                <div className="text-center pl-4 border-l border-gray-300">
                  <h4 className="font-bold text-lg text-gray-800">
                    {duration}
                  </h4>
                  <span className="text-base text-gray-500">Days</span>
                </div>
              </div>

              {/* Buttons */}
              {closedQuiz && lp_status === "open" && (
                <button
                  disabled
                  className="text-sm font-semibold border border-gray-300 text-gray-500 py-1.5 px-3 rounded-lg bg-gray-100 cursor-not-allowed"
                >
                  {closedQuiz}
                </button>
              )}

              {!closedQuiz && lp_status === "open" && (
                <Link
                  to={`/announcement-details/${quizId}`}
                  className="text-sm font-semibold border border-red-600 text-red-600 py-1.5 px-4 rounded-lg transition-all duration-300 hover:bg-red-600 hover:text-white hover:shadow-md"
                >
                  Register Now
                </Link>
              )}

              {lp_status === "upcoming" && (
                <button
                  disabled
                  className="text-sm font-semibold border border-gray-300 text-gray-500 py-1.5 px-4 rounded-lg bg-gray-100 cursor-not-allowed"
                >
                  Upcoming
                </button>
              )}

              {lp_status === "closed" && (
                <button
                  disabled
                  className="text-sm font-semibold border border-gray-300 text-gray-500 py-1.5 px-2 xl:px-4 rounded-lg bg-gray-100 cursor-not-allowed"
                >
                  Registration Closed
                </button>
              )}
              {shareQuestion && lp_status === "closed" && (
                <button
                  disabled
                  className="text-sm font-semibold border border-gray-300 text-gray-500 py-1.5 px-2 xl:px-4 rounded-lg bg-gray-100 cursor-not-allowed"
                >
                  Registration Closed
                </button>
              )}

              {shareQuestion && lp_status === "open" && (
                <button
                  onClick={onButtonClick}
                  className="text-sm font-semibold border border-red-600 text-red-600 py-1.5 px-4 rounded-lg transition-all duration-300 hover:bg-red-600 hover:text-white hover:shadow-md"
                >
                  {shareQuestion}
                </button>
              )}
            </div>

            {/* winner list */}
            {winnerList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 place-items-center">
                {winnerList.map((item) => (
                  <div
                    key={item.user_id}
                    className="flex flex-col items-center justify-center gap-1"
                  >
                    <p>{item.position}</p>
                    <img
                      src={item.profile_picture}
                      alt="Quiz Winner"
                      className="w-12 h-12 rounded-full"
                    />
                    <h3>{item.name}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <p></p>
            )}

            {/* Prize & Certificate */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {showCashPrize && (
                  <Link
                    to={`/announcement-details/${quizId}`}
                    state={{ scrollTo: "gratifications" }}
                    className="flex items-center gap-1 group"
                  >
                    <LuBadgeDollarSign
                      className="text-cyan-500 group-hover:scale-110 transition-transform"
                      size={20}
                    />
                    <span className="text-sm text-gray-600 font-medium group-hover:text-cyan-600">
                      Cash Prize
                    </span>
                  </Link>
                )}
                {showCertificate && (
                  <Link
                    to={`/announcement-details/${quizId}`}
                    state={{ scrollTo: "gratifications" }}
                    className="flex items-center gap-1 group"
                  >
                    <GrCertificate
                      className="text-cyan-500 group-hover:scale-110 transition-transform"
                      size={20}
                    />
                    <span className="text-sm text-gray-600 font-medium group-hover:text-cyan-600">
                      E-Certificate
                    </span>
                  </Link>
                )}
              </div>
              <Link
                to={`/announcement-details/${quizId}`}
                state={{ scrollTo: "terms" }}
                className="text-sm text-gray-500 hover:text-red-600 hover:underline transition"
              >
                View T&C
              </Link>
            </div>

            {/* Organizer */}
            <p className="pt-3 border-t border-gray-200 text-sm text-gray-600">
              By: <span className="font-medium">{organizer}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizCard;

// import { GrCertificate } from "react-icons/gr";
// import { LuBadgeDollarSign } from "react-icons/lu";
// import { Link } from "react-router-dom";
// import SwitcherToggleButton from "./SwitcherToggleButton";

// const QuizCard = ({
//   id,
//   isActive,
//   quizId,
//   layout = "vertical",
//   image,
//   title,
//   startDate,
//   endDate,
//   lp_status,
//   shareQuestion,
//   onButtonClick,
//   rounds,
//   duration,
//   closedQuiz,
//   registrationText,
//   showCashPrize = true,
//   showCertificate = true,
//   termsLink = "/",
//   organizer = "Fleek Bangladesh Bd",
//   showSwitcher = false,
//   winnerList = [],
// }) => {
//   const isHorizontal = layout === "horizontal";

//   return (
//     <div
//       className={`bg-white rounded-2xl overflow-hidden transform transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 ${
//         isHorizontal ? "flex" : ""
//       }`}
//     >
//       {/* card image */}
//       <div
//         className={`relative overflow-hidden ${isHorizontal ? "w-1/2" : ""}`}
//       >
//         <img
//           src={image}
//           alt="quiz"
//           className={`transition-transform duration-500 ease-in-out hover:scale-110 object-cover ${
//             isHorizontal ? "h-[300px] w-full" : "w-full h-[260px]"
//           }`}
//         />
//         {showSwitcher && (
//           <div className="absolute top-3 right-3">
//             <SwitcherToggleButton id={id} isActive={isActive} />
//           </div>
//         )}
//         <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent text-white px-4 py-2">
//           <h4 className="text-lg font-semibold truncate">{title}</h4>
//         </div>
//       </div>

//       {/* card content */}
//       <div
//         className={`p-5 flex flex-col justify-between ${
//           isHorizontal ? "w-1/2" : ""
//         }`}
//       >
//         {/* Title */}
//         {!isHorizontal && (
//           <h4 className="text-xl xl:text-2xl font-bold mb-3 text-gray800">
//             {title}
//           </h4>
//         )}

//         {/* Dates */}
//         <div className="flex items-center justify-between text-sm mb-4">
//           <p className="font-medium">
//             From:{" "}
//             <span className="bg-gradient-to-r from-green500 to-emerald-700 bg-clip-text text-transparent font-bold">
//               {startDate}
//             </span>
//           </p>
//           <p className="font-medium">
//             To:{" "}
//             <span className="bg-gradient-to-r from-red500 to-rose-700 bg-clip-text text-transparent font-bold">
//               {endDate}
//             </span>
//           </p>
//         </div>

//         {/* Rounds & Actions */}
//         <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
//           <div className="flex items-center gap-4">
//             <div className="text-center">
//               <h4 className="font-bold text-lg text-gray800">{rounds}</h4>
//               <span className="text-base text-gray500">Rounds</span>
//             </div>
//             <div className="text-center pl-4 border-l border-gray300">
//               <h4 className="font-bold text-lg text-gray800">{duration}</h4>
//               <span className="text-base text-gray500">Days</span>
//             </div>
//           </div>

//           {/* Buttons */}
//           {closedQuiz && lp_status === "open" && (
//             <button
//               disabled
//               className="text-sm font-semibold border border-gray300 text-gray500 py-1.5 px-3 rounded-lg bg-gray100 cursor-not-allowed"
//             >
//               {closedQuiz}
//             </button>
//           )}

//           {!closedQuiz && lp_status === "open" && (
//             <Link
//               to={`/announcement-details/${quizId}`}
//               className="text-sm font-semibold border border-red600 text-red600 py-1.5 px-4 rounded-lg transition-all duration-300 hover:bg-red600 hover:text-white hover:shadow-md"
//             >
//               Register Now
//             </Link>
//           )}

//           {lp_status === "upcoming" && (
//             <button
//               disabled
//               className="text-sm font-semibold border border-gray300 text-gray500 py-1.5 px-4 rounded-lg bg-gray100 cursor-not-allowed"
//             >
//               Upcoming
//             </button>
//           )}

//           {lp_status === "closed" && (
//             <button
//               disabled
//               className="text-sm font-semibold border border-gray300 text-gray500 py-1.5 px-2 xl:px-4 rounded-lg bg-gray100 cursor-not-allowed"
//             >
//               Registration Closed
//             </button>
//           )}

//           {shareQuestion && (
//             <button
//               onClick={onButtonClick}
//               className="text-sm font-semibold border border-red600 text-red600 py-1.5 px-4 rounded-lg transition-all duration-300 hover:bg-red600 hover:text-white hover:shadow-md"
//             >
//               {shareQuestion}
//             </button>
//           )}
//         </div>

//         {/* winner list */}
//         {winnerList.length > 0 ? (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 place-items-center">
//             {winnerList.map((item) => (
//               <div
//                 key={item.user_id}
//                 className="flex flex-col items-center justify-center gap-1"
//               >
//                 <p>{item.position}</p>
//                 <img
//                   src={item.profile_picture}
//                   alt="Quiz Winner"
//                   className="w-12 h-12 rounded-full"
//                 />
//                 <h3>{item.name}</h3>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p></p>
//         )}

//         {/* Prize & Certificate */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             {showCashPrize && (
//               <Link
//                 to={`/announcement-details/${quizId}`}
//                 state={{ scrollTo: "gratifications" }}
//                 className="flex items-center gap-1 group"
//               >
//                 <LuBadgeDollarSign
//                   className="text-cyan500 group-hover:scale-110 transition-transform"
//                   size={20}
//                 />
//                 <span className="text-sm text-gray600 font-medium group-hover:text-cyan600">
//                   Cash Prize
//                 </span>
//               </Link>
//             )}
//             {showCertificate && (
//               <Link
//                 to={`/announcement-details/${quizId}`}
//                 state={{ scrollTo: "gratifications" }}
//                 className="flex items-center gap-1 group"
//               >
//                 <GrCertificate
//                   className="text-cyan500 group-hover:scale-110 transition-transform"
//                   size={20}
//                 />
//                 <span className="text-sm text-gray600 font-medium group-hover:text-cyan600">
//                   E-Certificate
//                 </span>
//               </Link>
//             )}
//           </div>
//           <Link
//             to={`/announcement-details/${quizId}`}
//             state={{ scrollTo: "terms" }}
//             className="text-sm text-gray500 hover:text-red600 hover:underline transition"
//           >
//             View T&C
//           </Link>
//         </div>

//         {/* Organizer */}
//         <p className="pt-3 border-t border-gray-200 text-sm text-gray600">
//           By: <span className="font-medium">{organizer}</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default QuizCard;
