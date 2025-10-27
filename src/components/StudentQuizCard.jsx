import { GrCertificate } from "react-icons/gr";
import { IoMdRefresh } from "react-icons/io";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { Link } from "react-router-dom";
import SwitcherToggleButton from "./SwitcherToggleButton";

const StudentQuizCard = ({
  id,
  isActive,
  quizId,
  layout = "vertical",
  image,
  title,
  startDate,
  endDate,
  shareQuestion,
  onButtonClick,
  rounds,
  duration,
  lp_status,
  registrationText,
  showCashPrize = true,
  showCertificate = true,
  termsLink = "/",
  organizer = "Fleek Bangladesh Bd",
  showSwitcher = false,
  registared,
  cardButtonText,
}) => {
  const isHorizontal = layout === "horizontal";

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden transform transition-all duration-300 shadow-md hover:shadow-xl relative z-20 ${
        isHorizontal ? "flex" : ""
      }`}
    >
      {/* Dates */}
      <div className="px-6 pt-6 pb-4">
        <h4 className="text-lg xl:text-[22px] font-bold text-gray-900 mb-3">
          {title}
        </h4>
        <div className="flex flex-col gap-1 text-sm">
          <span className="text-sm text-secondary font-medium">
            {startDate} to {endDate}
          </span>
        </div>
      </div>

      {/* Organizer and Prize Info */}
      <div className="px-6 pb-4 flex items-center gap-2">
        <Link
          to={`/quiz-details/${quizId}`}
          state={{ scrollTo: "gratifications" }}
          className="text-sm text-gray-600 border border-gray-300 py-1 px-2 rounded-full"
        >
          <span className="text-gray-500">By:</span>{" "}
          <span className="font-semibold text-gray-800">{organizer}</span>
        </Link>
        {showCashPrize && (
          <Link
            to={`/quiz-details/${quizId}`}
            state={{ scrollTo: "gratifications" }}
            className="flex items-center gap-1 border border-gray-300 py-1 px-2 rounded-full bg-pink-50"
          >
            <span className="text-sm font-semibold text-gray-700">Prize:</span>
            <span className="text-sm font-bold text-green-600">Cash</span>
          </Link>
        )}
      </div>

      {/* Card Image */}
      <div
        className={`relative overflow-hidden mx-6 rounded-xl ${
          isHorizontal ? "w-1/2" : ""
        }`}
      >
        <img
          src={image}
          alt="quiz"
          className={`transition-transform duration-500 ease-in-out hover:scale-105 object-cover ${
            isHorizontal ? "h-[300px] w-full" : "w-full h-[200px]"
          }`}
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

      {/* Card Content */}
      <div
        className={`px-5 py-2 flex flex-col justify-between ${
          isHorizontal ? "w-1/2" : ""
        }`}
      >
        {/* Vertical Title */}
        {/* {!isHorizontal && (
          <h4 className="text-2xl font-bold mb-3 text-gray-900">{title}</h4>
        )} */}

        {/* Rounds & Duration */}
        <div className="py-3 flex items-center justify-between">
          {/* <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-black flex items-center justify-center">
              <FiPlusCircle className="text-black" size={24} />
            </div>
          </div> */}
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
                <p className="text-lg font-bold text-gray-800">{duration}</p>
                <p className="text-sm text-gray-500">Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mb-1">
          {lp_status === "open" &&
            (registared ? (
              <p className="w-full text-center text-base font-bold py-2 rounded-lg bg-green-600 text-white cursor-not-allowed">
                Already Registered
              </p>
            ) : (
              <button
                onClick={() => onButtonClick(quizId)}
                className="w-full text-base font-bold py-2 rounded-lg bg-gradient-to-r from-gradientEnd to-gradientStart text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Register Now
              </button>
            ))}

          {lp_status === "upcoming" && (
            <button
              disabled
              className="w-full text-base font-bold py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
            >
              Upcoming
            </button>
          )}

          {lp_status === "closed" && (
            <button
              disabled
              className="w-full text-base font-bold py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
            >
              Registration Closed
            </button>
          )}

          {cardButtonText && (
            <Link
              to={`/student/announcement-round/${quizId}`}
              className="w-full text-base font-bold py-2 rounded-lg text-center text-white bg-secondary transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {cardButtonText}
            </Link>
          )}

          {shareQuestion && (
            <button
              onClick={onButtonClick}
              className="w-full text-base font-bold py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {shareQuestion}
            </button>
          )}
        </div>

        {/* Certificate Link - Bottom */}
        <div className="flex items-center justify-between pt-2">
          {showCertificate && (
            <div className=" pb-4">
              <Link
                to={`/quiz-details/${quizId}`}
                state={{ scrollTo: "gratifications" }}
                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors underline"
              >
                <GrCertificate size={16} />
                <span className="font-medium">E-Certificate</span>
              </Link>
            </div>
          )}

          {/* Terms Link */}
          <div className=" pb-4">
            <Link
              to={`/quiz-details/${quizId}`}
              state={{ scrollTo: "terms" }}
              className="block text-center text-xs text-gray-500 hover:text-primary hover:underline transition underline"
            >
              View T&C
            </Link>
          </div>
        </div>

        {/* Prize & Certificate */}
        {/* <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {showCashPrize && (
              <Link
                to={`/quiz-details/${quizId}`}
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
                to={`/quiz-details/${quizId}`}
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
            to={`/quiz-details/${quizId}`}
            className="text-sm text-gray-500 hover:text-primary hover:underline transition"
          >
            View T&C
          </Link>
        </div>

        <p className="pt-3 border-t border-gray-200 text-sm text-gray-600">
          By: <span className="font-medium">{organizer}</span>
        </p> */}
      </div>
    </div>
  );
};

export default StudentQuizCard;

// import { GrCertificate } from "react-icons/gr";
// import { LuBadgeDollarSign } from "react-icons/lu";
// import { Link } from "react-router-dom";
// import SwitcherToggleButton from "./SwitcherToggleButton";

// const StudentQuizCard = ({
//   id,
//   isActive,
//   quizId,
//   layout = "vertical",
//   image,
//   title,
//   startDate,
//   endDate,
//   shareQuestion,
//   onButtonClick,
//   rounds,
//   duration,
//   lp_status,
//   registrationText,
//   showCashPrize = true,
//   showCertificate = true,
//   termsLink = "/",
//   organizer = "Fleek Bangladesh Bd",
//   showSwitcher = false,
//   registared,
//   cardButtonText,
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
//             isHorizontal ? "h-[250px] w-full" : "w-full h-[260px]"
//           }`}
//         />
//         {showSwitcher && (
//           <div className="absolute top-3 right-3">
//             <SwitcherToggleButton id={id} isActive={isActive} />
//           </div>
//         )}
//         <div className="absolute bottom-0 w-full bg-gradient-to-t from-black600/60 to-transparent text-white px-4 py-2">
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
//           <h4 className="text-2xl font-bold mb-3 text-gray800">{title}</h4>
//         )}

//         {/* Dates */}
//         <div className="flex flex-col gap-1 text-sm">
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
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div className="flex items-center gap-4">
//             <div className="text-center">
//               <h4 className="font-bold text-xl text-gray800">{rounds}</h4>
//               <span className="text-base text-gray500">Rounds</span>
//             </div>
//             <div className="text-center pl-4 border-l border-gray300">
//               <h4 className="font-bold text-xl text-gray800">{duration}</h4>
//               <span className="text-base text-gray500">Days</span>
//             </div>
//           </div>

//           {/* Registration Button - based on lp_status */}
//           {lp_status === "open" &&
//             (registared ? (
//               <p className="text-sm font-semibold border text-white bg-green-600  py-1.5 px-4 rounded-lg transition-all duration-300 hover:shadow-md">
//                 Already Registered
//               </p>
//             ) : (
//               <button
//                 onClick={() => onButtonClick(quizId)}
//                 className="text-sm font-semibold border border-red600 text-red600 py-1.5 px-4 rounded-lg transition-all duration-300 hover:bg-red600 hover:text-white hover:shadow-md"
//               >
//                 Registration Now
//               </button>
//             ))}

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
//               className="text-sm font-semibold border border-gray300 text-gray500 py-1.5 px-4 rounded-lg bg-gray100 cursor-not-allowed"
//             >
//               Registration Closed
//             </button>
//           )}

//           {/* button text for student announcement */}
//           {cardButtonText && (
//             <Link
//               to={`/student/announcement-round/${quizId}`}
//               className="text-sm font-semibold border border-blue400 text-blue600 py-1.5 px-4 rounded-lg transition-all duration-300 hover:bg-blue600 hover:text-white hover:shadow-md"
//             >
//               {cardButtonText}
//             </Link>
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

//         {/* Prize & Certificate */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             {showCashPrize && (
//               <Link to="/" className="flex items-center gap-1 group">
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
//               <Link to="/" className="flex items-center gap-1 group">
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
//             to={`/quiz-details/${quizId}`}
//             className="text-sm text-gray500 hover:text-red600 hover:underline transition"
//           >
//             View T&C
//           </Link>
//         </div>

//         {/* Organizer */}
//         <p className="pt-3 border-t border-gray200 text-sm text-gray600">
//           By: <span className="font-medium">{organizer}</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default StudentQuizCard;

// import { GrCertificate } from "react-icons/gr";
// import { LuBadgeDollarSign } from "react-icons/lu";
// import { Link } from "react-router-dom";
// import SwitcherToggleButton from "./SwitcherToggleButton";

// const StudentQuizCard = ({
//   id,
//   isActive,
//   quizId,
//   layout = "vertical",
//   image,
//   title,
//   startDate,
//   endDate,
//   shareQuestion,
//   onButtonClick,
//   rounds,
//   duration,
//   lp_status,
//   registrationText,
//   showCashPrize = true,
//   showCertificate = true,
//   termsLink = "/",
//   organizer = "Fleek Bangladesh Bd",
//   showSwitcher = false,
//   registared,
//   cardButtonText,
// }) => {
//   const isHorizontal = layout === "horizontal";

//   // console.log("roundID:", rounds);

//   return (
//     <div
//       className={`bg-[var(--white)] overflow-hidden transform transition ease-in-out duration-300 shadow hover:shadow-md ${
//         isHorizontal ? "flex" : ""
//       }`}
//     >
//       {/* card image */}
//       <div
//         className={`overflow-hidden shadow ${
//           isHorizontal ? "w-1/2" : ""
//         } relative`}
//       >
//         <img
//           src={image}
//           alt="quiz"
//           className={`transition ease-linear duration-200 hover:scale-110 object-cover bg-no-repeat bg-cover ${
//             isHorizontal ? "h-[300px] w-full" : "w-full h-[300px]"
//           }`}
//         />
//         {showSwitcher && (
//           <div className="absolute top-2 right-2">
//             <SwitcherToggleButton id={id} isActive={isActive} />
//           </div>
//         )}
//       </div>

//       {/* card content */}
//       <div className={`p-4 ${isHorizontal ? "w-1/2" : ""}`}>
//         <h4 className="text-lg xl:text-xl font-bold mb-2">{title}</h4>

//         <div className="flex items-center justify-between text-sm mb-4">
//           <p className="text-[var(gray500)]">
//             From:{" "}
//             <span className="text-[var(green700)] font-bold">
//               {startDate}
//             </span>
//           </p>
//           <p className="text-[var(gray500)]">
//             To:{" "}
//             <span className="text-[var(red700)] font-bold">{endDate}</span>
//           </p>
//         </div>

//         <div className="flex items-center justify-between sm:flex-col md:flex-row lg:flex-col 2xl:flex-row mb-4 gap-4">
//           <div className="flex items-center justify-center gap-2">
//             <div className="text-center">
//               <h4 className="font-bold leading-none">{rounds}</h4>
//               <span className="text-sm text-[var(gray500)] font-medium">
//                 Rounds
//               </span>
//             </div>
//             <div className="text-center pl-2 border-l border-[var(gray300)]">
//               <h4 className="font-bold leading-none">{duration}</h4>
//               <span className="text-sm text-[var(gray500)] font-medium">
//                 Days
//               </span>
//             </div>
//           </div>

//           {/* Registration Button */}
//           {/* {registrationText !== undefined ? (
//             registrationText ? (
//               registared ? (
//                 <p className="bg-green-500 text-white py-2 px-4 rounded">
//                   Already Registered
//                 </p>
//               ) : (
//                 <button
//                   onClick={() => onButtonClick(quizId)}
//                   className="text-base xl:text-lg font-bold border border-green-950 text-[var(red700)] py-1 px-2 lg:px-3 rounded transition ease-in-out duration-300 hover:text-[var(--white)] hover:bg-[var(red700)] hover:border-transparent"
//                 >
//                   Registration Running
//                 </button>
//               )
//             ) : (
//               <button className="text-base xl:text-lg font-bold border border-green-950 text-[var(red700)] py-1 px-2 lg:px-3 rounded transition ease-in-out duration-300 hover:text-[var(--white)] hover:bg-[var(red700)] hover:border-transparent">
//                 Registration Close
//               </button>
//             )
//           ) : (
//             shareQuestion && (
//               <button
//                 onClick={onButtonClick}
//                 className="text-base xl:text-lg font-bold border border-green-950 text-[var(red700)] py-1 px-2 lg:px-3 rounded transition ease-in-out duration-300 hover:text-[var(--white)] hover:bg-[var(red700)] hover:border-transparent"
//               >
//                 {shareQuestion}
//               </button>
//             )
//           )} */}

//           {/* Registration Button - based on lp_status */}
//           {lp_status === "open" &&
//             (registared ? (
//               <p className="bg-green-500 text-white py-2 px-4 rounded">
//                 Already Registered
//               </p>
//             ) : (
//               <button
//                 onClick={() => onButtonClick(quizId)}
//                 className="text-base xl:text-lg font-bold border border-green-950 text-[var(red700)] py-1 px-2 lg:px-3 rounded transition ease-in-out duration-300 hover:text-[var(--white)] hover:bg-[var(red700)] hover:border-transparent"
//               >
//                 Registration Now
//               </button>
//             ))}

//           {lp_status === "upcoming" && (
//             <button
//               disabled
//               className="text-base xl:text-lg font-bold border border-gray-400 text-gray500 py-1 px-2 lg:px-3 rounded cursor-not-allowed"
//             >
//               Upcoming
//             </button>
//           )}

//           {lp_status === "closed" && (
//             <button
//               disabled
//               className="text-base xl:text-lg font-bold border border-gray-400 text-gray500 py-1 px-2 lg:px-3 rounded cursor-not-allowed"
//             >
//               Registration Closed
//             </button>
//           )}

//           {/* button text for student announcement */}
//           {cardButtonText && (
//             <Link
//               to={`/student/announcement-round/${quizId}`}
//               className="bg-blue-700 text-white py-2 px-4 rounded"
//             >
//               {cardButtonText}
//             </Link>
//           )}
//         </div>

//         <div className="flex items-center justify-between mb-4 mt-4">
//           <div className="flex items-center justify-center gap-2">
//             {showCashPrize && (
//               <Link to="/" className="flex items-center justify-center gap-1">
//                 <LuBadgeDollarSign color="#91C8E4" size={20} />
//                 <span className="text-sm text-[var(gray500)] font-semibold transition hover:text-[var(cyan500)]">
//                   Cash Prize
//                 </span>
//               </Link>
//             )}
//             {showCertificate && (
//               <Link to="/" className="flex items-center justify-center gap-1">
//                 <GrCertificate color="#91C8E4" size={20} />
//                 <span className="text-sm text-[var(gray500)] font-semibold transition hover:text-[var(cyan500)]">
//                   E-Certificate
//                 </span>
//               </Link>
//             )}
//           </div>
//           <Link
//             to={`/quiz-details/${quizId}`}
//             className="text-sm text-[var(gray500)] transition hover:underline"
//           >
//             View T&C
//           </Link>
//         </div>

//         <p className="pt-2 border-t border-[var(gray300)]">
//           By: <span>{organizer}</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default StudentQuizCard;
