import { FaPlay } from "react-icons/fa";
import Singnal from "../../assets/images/banner-images/singnal.svg";
import icon from "../../assets/images/banner-images/steps-icons/icon.svg";
import icon1 from "../../assets/images/banner-images/steps-icons/icon1.svg";
import icon2 from "../../assets/images/banner-images/steps-icons/icon2.svg";
import icon3 from "../../assets/images/banner-images/steps-icons/icon3.svg";
import icon4 from "../../assets/images/banner-images/steps-icons/icon4.svg";
import icon5 from "../../assets/images/banner-images/steps-icons/icon5.svg";
import TicTokImg from "../../assets/images/banner-images/tictok.png";

const ParticipateGuide = () => {
  const features = [
    {
      icon: icon,
      title: "Create Account",
      desc: "Sign up quickly with email or social media to get started",
      bg: "bg-purple-200",
    },
    {
      icon: icon1,
      title: "Browse Quizzes",
      desc: "Explore thousands of quizzes across various categories",
      bg: "bg-purple-200",
    },
    {
      icon: icon2,
      title: "Start Quiz",
      desc: "Begin your quiz journey with interactive questions",
      bg: "bg-pink-200",
    },
    {
      icon: icon3,
      title: "Submit Answers",
      desc: "Complete all questions and submit your responses",
      bg: "bg-pink-200",
    },
    {
      icon: icon4,
      title: "Get Results",
      desc: "Receive instant scores and detailed performance analysis",
      bg: "bg-green-200",
    },
    {
      icon: icon5,
      title: "Share & Compete",
      desc: "Explore thousands of quizzes across various categories",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <section className="text-secondary py-12 xl:py-20">
      <div className="container mx-auto px-4 xl:mt-8">
        <h2 className="text-3xl lg:text-4xl 2xl:text-5xl font-bold text-center">
          How It Works
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto my-3 rounded-full"></div>
        <p className="text-center max-w-2xl mx-auto text-lg mb-8 md:mb-12 xl:mb-20">
          Discover the simple steps to start your quiz journey and unlock
          endless learning possibilities!
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-between">
          <div>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-8 transition-transform transform hover:scale-105 hover:shadow-2xl ${f.bg}`}
                >
                  <div className="w-12 h-12 bg-secondary text-white flex items-center justify-center rounded-full text-3xl mb-4">
                    <img src={f.icon} alt={f.title} className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl xl:text-2xl font-semibold mb-2 bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent">
                    {f.title}
                  </h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-10">
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold mb-2">Track Progress</h3>
                <p className="text-lg">
                  Monitor your learning journey and improve over time
                </p>
              </div>
              <div className="w-16 h-16 bg-black flex items-center justify-center rounded-full overflow-hidden">
                <img
                  src={Singnal}
                  alt="signal image"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="max-w-[350px] text-center">
              <h3 className="mb-4 text-2xl font-bold bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent">
                Watch & Learn
              </h3>
              <img src={TicTokImg} alt="tictok frame" />
            </div>

            {/* Play Button */}
            <button className="absolute inset-0 flex items-center justify-center w-full h-full">
              {/* Glass square box */}
              <div
                className="w-20 h-20 flex items-center justify-center rounded-xl
                 bg-gradient-to-br from-[#ED4186]/20 to-[#540F6B]/20
                 backdrop-blur-md border border-white/20
                 shadow-lg shadow-black/40 transition-transform duration-300 
                 hover:scale-110"
              >
                {/* Gradient circle inside */}
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-full 
                   bg-gradient-to-br from-[#ED4186] to-[#540F6B]
                   shadow-md shadow-black/40"
                >
                  <FaPlay className="text-white text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] ml-1" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* <div className="absolute top-0 left-0 right-0">
        <img src={shape} alt="section shape image" className="w-full" />
      </div> */}
    </section>
  );
};

export default ParticipateGuide;

// import { useState } from "react";
// import {
//   FaChartLine,
//   FaCheckCircle,
//   FaClock,
//   FaListUl,
//   FaMedal,
//   FaMobileAlt,
//   FaPlay,
//   FaPlayCircle,
//   FaShareAlt,
//   FaTrophy,
//   FaUserPlus,
//   FaUsers,
// } from "react-icons/fa";

// // Sample video URLs for each step (replace with actual video URLs)
// const videoUrls = [
//   "https://example.com/video1.mp4",
//   "https://example.com/video2.mp4",
//   "https://example.com/video3.mp4",
//   "https://example.com/video4.mp4",
//   "https://example.com/video5.mp4",
//   "https://example.com/video6.mp4",
//   "https://example.com/video7.mp4",
// ];

// const steps = [
//   {
//     icon: FaUserPlus,
//     title: "Create Account",
//     description: "Sign up quickly with email or social media to get started",
//   },
//   {
//     icon: FaListUl,
//     title: "Browse Quizzes",
//     description: "Explore thousands of quizzes across various categories",
//   },
//   {
//     icon: FaPlayCircle,
//     title: "Start Quiz",
//     description: "Begin your quiz journey with interactive questions",
//   },
//   {
//     icon: FaCheckCircle,
//     title: "Submit Answers",
//     description: "Complete all questions and submit your responses",
//   },
//   {
//     icon: FaTrophy,
//     title: "Get Results",
//     description: "Receive instant scores and detailed performance analysis",
//   },
//   {
//     icon: FaShareAlt,
//     title: "Share & Compete",
//     description: "Share achievements and challenge friends",
//   },
//   {
//     icon: FaChartLine,
//     title: "Track Progress",
//     description: "Monitor your learning journey and improve over time",
//     span: "md:col-span-2",
//   },
// ];

// const features = [
//   { icon: FaClock, text: "Self-paced Learning" },
//   { icon: FaMedal, text: "Earn Certificates" },
//   { icon: FaUsers, text: "Join Communities" },
//   { icon: FaMobileAlt, text: "Mobile Friendly" },
// ];

// const ParticipateGuide = () => {
//   const [selectedStep, setSelectedStep] = useState(null);

//   const handleStepClick = (index) => {
//     setSelectedStep(index);
//   };

//   return (
//     <div>
//       <div className="relative">
//         {/* Background Decorations */}
//         <div className="fixed inset-0 pointer-events-none z-[-1]">
//           <div className="absolute w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[300px] lg:h-[300px] bg-yellow400 opacity-10 rounded-full top-[10%] left-[5%] animate-float hidden sm:block"></div>
//           <div className="absolute w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] lg:w-[200px] lg:h-[200px] bg-pink400 opacity-10 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] bottom-[10%] right-[5%] animate-float-reverse hidden md:block"></div>
//           <div className="absolute w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[150px] lg:h-[150px] bg-blue400 opacity-10 rounded-full top-1/2 right-[10%] animate-float-slow hidden lg:block"></div>
//         </div>

//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-20">
//           <div className="text-center mb-12 sm:mb-16 lg:mb-20 relative">
//             <h2
//               className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black600 drop-shadow-2xl relative inline-block pb-2 sm:pb-3
//                 after:content-[''] after:absolute after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2
//                 after:w-24 sm:after:w-32 after:h-[4px] sm:after:h-[6px] after:bg-yellow400 after:rounded"
//             >
//               How It Works
//             </h2>
//             <p className="text-base lg:text-xl text-black600 max-w-md sm:max-w-lg lg:max-w-xl mx-auto mt-4 sm:mt-5 font-normal">
//               Discover the simple steps to start your quiz journey and unlock
//               endless learning possibilities!
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 2xl:gap-20 items-center">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
//               {steps.map((step, index) => {
//                 const Icon = step.icon;
//                 return (
//                   <div
//                     key={index}
//                     className={`bg-white/95 rounded-2xl participate_steps_card p-6 sm:p-8 lg:p-6 2xl:p-8 relative shadow
//                       transition-all duration-300 cursor-pointer ${
//                         step.span || ""
//                       }
//                       ${
//                         selectedStep === index
//                           ? "border-2 border-indigo400"
//                           : ""
//                       }`}
//                     onClick={() => handleStepClick(index)}
//                   >
//                     <div
//                       className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 w-12 xl:w-16 h-12 xl:h-16 bg-gradient-to-br from-indigo400 to-purple500
//                         rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-lg"
//                     >
//                       {index + 1}
//                     </div>
//                     <div
//                       className="w-12 sm:w-14 h-12 sm:h-14 2xl:w-[70px] 2xl:h-[70px] bg-gradient-to-br from-pink400 to-red500 rounded-xl sm:rounded-2xl
//                         flex items-center justify-center mb-4 sm:mb-5 text-white text-xl sm:text-2xl lg:text-3xl shadow-md"
//                     >
//                       <Icon className="text-xl sm:text-2xl lg:text-3xl" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray800 mb-2">
//                       {step.title}
//                     </h3>
//                     <p className="text-gray600 leading-relaxed text-sm">
//                       {step.description}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="bg-white/95 rounded-2xl sm:rounded-[30px] p-6 sm:p-8 lg:p-10 shadow">
//               <div className="text-center mb-6 sm:mb-8 relative z-[1]">
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray800 mb-2">
//                   Watch & Learn
//                 </h3>
//                 <p className="text-gray600 text-sm sm:text-base lg:text-lg">
//                   See our platform in action with this quick tutorial
//                 </p>
//               </div>
//               <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl mb-6 sm:mb-8 z-[1]">
//                 {selectedStep !== null ? (
//                   <video
//                     className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] object-cover"
//                     controls
//                     src={videoUrls[selectedStep]}
//                     poster="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
//                   >
//                     Your browser does not support the video tag.
//                   </video>
//                 ) : (
//                   <div
//                     className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] bg-cover bg-center relative"
//                     style={{
//                       backgroundImage:
//                         "url('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-black600/30 flex items-center justify-center transition-all duration-300">
//                       <div
//                         className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-white/90 rounded-full flex items-center justify-center
//                           cursor-pointer hover:scale-110 hover:bg-white transition-all duration-300 shadow-2xl"
//                       >
//                         <FaPlay className="text-2xl sm:text-3xl lg:text-4xl text-indigo400 ml-1 sm:ml-2" />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 relative z-[1]">
//                 {features.map((feature, index) => {
//                   const FeatureIcon = feature.icon;
//                   return (
//                     <div
//                       key={index}
//                       className="flex items-center p-3 sm:p-4 bg-indigo-100/50 rounded-xl sm:rounded-2xl
//                           transition-all duration-300"
//                     >
//                       <div
//                         className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-indigo400 to-purple500
//                           rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 text-white"
//                       >
//                         <FeatureIcon className="text-base sm:text-xl" />
//                       </div>
//                       <div className="font-semibold text-gray800 text-sm sm:text-base">
//                         {feature.text}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ParticipateGuide;
