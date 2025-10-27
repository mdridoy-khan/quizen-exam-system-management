import { FaFacebookMessenger, FaLinkedin } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { RiWhatsappFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import appstore from "../assets/footer/appStore.png";
import playstore from "../assets/footer/playStore.png";
import eduwise from "../assets/logo/edu-wise.jpg";
import finwise from "../assets/logo/finwise.jpg";
import fundDay from "../assets/logo/fund-day.jpg";
import logo from "../assets/logo/logo.png";
import quicDigital from "../assets/logo/quick-digital.jpg";
import tutorWise from "../assets/logo/tutor-wise.jpg";
import tutorWise1 from "../assets/logo/tutor-wise1.jpg";
import wiseCorporation from "../assets/logo/wise-corporation2.jpg";

const Footer = () => {
  return (
    <footer>
      {/* main footer */}
      <div className="container mx-auto px-4 mb-6">
        <div className="pt-20 lg:pt-32 pb-10 min-h-[455px] rounded-xl xl:rounded-2xl bg-secondary">
          {/* Top Section */}
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 items-start justify-between">
            {/* Logo Section */}
            <div>
              <Link to="/" className="inline-block mb-2">
                <img src={logo} alt="footer logo" className="w-32" />
              </Link>
            </div>

            {/* All Pages */}
            <div>
              <h4 className="font-semibold text-lg mb-3 text-white">
                All Pages
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-200 transition hover:text-primary"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/winners"
                    className="text-gray-200 transition hover:text-primary"
                  >
                    Winner Announcement
                  </Link>
                </li>
                <li>
                  <Link
                    to="/closed-quiz"
                    className="text-gray-200 transition hover:text-primary"
                  >
                    Closed Quiz
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="font-semibold text-lg mb-3 text-white">
                Contact Us
              </h4>
              <ul className="space-y-2 text-gray-200 text-sm">
                <li className="flex items-center gap-2">
                  <FiPhone className="text-white w-5 text-lg" />
                  <span className="flex-1 text-base">+880 1897-621279</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiMail className="text-white w-5 text-lg" />
                  <span className="flex-1 text-base">support@fleekbd.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiMapPin className="text-white mt-[2px] w-5 text-lg" />
                  <span className="flex-1 text-base">
                    H:417, R:7 Baridhara DOHS, Dhaka–1206
                  </span>
                </li>
              </ul>
            </div>
            {/* Store Buttons */}
            <div className="mt-4 flex flex-col gap-2 lg:items-end lg:justify-end">
              <img src={appstore} alt="App Store" className="w-32" />
              <img src={playstore} alt="Google Play" className="w-32" />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="max-w-7xl mx-auto px-4 mt-4 xl:mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-gray-300 text-base">Copyright © FleekBd 2025</p>

            <div className="flex items-center gap-4">
              <Link to="/" aria-label="Messenger">
                <FaFacebookMessenger
                  size={20}
                  className="text-[#F3EFDA] transition-colors duration-300 hover:text-primary"
                />
              </Link>
              <Link to="/" aria-label="WhatsApp">
                <RiWhatsappFill
                  size={20}
                  className="text-[#F3EFDA] transition-colors duration-300 hover:text-primary"
                />
              </Link>
              <Link to="/" aria-label="LinkedIn">
                <FaLinkedin
                  size={20}
                  className="text-[#F3EFDA] transition-colors duration-300 hover:text-primary"
                />
              </Link>
              <Link to="/" aria-label="Facebook">
                <FaSquareFacebook
                  size={20}
                  className="text-[#F3EFDA] transition-colors duration-300 hover:text-primary"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Group logos section */}
      <div className="bg-gray-900 py-6">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-gray-400 text-sm font-medium mb-4">
            OUR GROUP
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {[
              { src: eduwise, alt: "Eduwise" },
              { src: finwise, alt: "Finwise" },
              { src: fundDay, alt: "Fund Day" },
              { src: quicDigital, alt: "Quick Digital" },
              { src: tutorWise, alt: "Tutor Wise" },
              { src: tutorWise1, alt: "Tutor Wise 1" },
              { src: wiseCorporation, alt: "Wise Corporation" },
            ].map((logo, index) => (
              <Link
                key={index}
                to="/"
                className="bg-black px-4 py-1 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors duration-200"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-16 h-12 object-contain"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// import { Link } from "react-router-dom";
// import facebook from "../assets/icons/facebook.svg";
// import linkedin from "../assets/icons/linkedin.svg";
// import messanger from "../assets/icons/messanger.svg";
// import whatsapp from "../assets/icons/whatsapp.svg";
// import eduwise from "../assets/logo/edu-wise.jpg";
// import finwise from "../assets/logo/finwise.jpg";
// import fundDay from "../assets/logo/fund-day.jpg";
// import logo from "../assets/logo/logo.png";
// import quicDigital from "../assets/logo/quick-digital.jpg";
// import tutorWise from "../assets/logo/tutor-wise.jpg";
// import tutorWise1 from "../assets/logo/tutor-wise1.jpg";
// import wiseCorporation from "../assets/logo/wise-corporation2.jpg";
// const Footer = () => {
//   return (
//     <footer>
//       <div className="bg-primary">
//         <div className="container mx-auto px-4">
//           {/* copyright area */}
//           <div className="flex items-center justify-center sm:justify-between flex-wrap py-4 border-b border-white border-opacity-80">
//             <span className="text-white opacity-80 text-sm">
//               Copyright © FleekBd 2025
//             </span>
//             <span className="text-white font-semibold text-sm">
//               Last Updated: Jul, 2025 -aexa-quizweb07
//             </span>
//           </div>

//           {/* footer content */}
//           <div className="flex items-center justify-center sm:justify-between flex-col md:flex-row py-4 gap-4">
//             <div className="flex flex-col items-center md:items-start justify-center md:justify-start gap-3 xl:max-w-3xl">
//               <Link to="/">
//                 <img src={logo} alt="footer logo" className="max-w-[120px]" />
//               </Link>
//               <p className="text-white text-sm text-center md:text-start">
//                 © Content owned, Lorem ipsum dolor sit amet consectetur
//                 adipisicing elit. Architecto distinctio, quasi amet pariatur
//                 quidem magnam at est necessitatibus deserunt numquam.
//               </p>
//             </div>
//             <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
//               <p className="text-white w-20">Follow us :</p>
//               <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
//                 <Link
//                   to="/"
//                   className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full transition ease-in-out duration-200 hover:bg-gray100"
//                 >
//                   <img src={facebook} alt="facebook icon" width={24} />
//                 </Link>
//                 <Link
//                   to="/"
//                   className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full transition ease-in-out duration-200 hover:bg-gray100"
//                 >
//                   <img src={whatsapp} alt="facebook icon" width={24} />
//                 </Link>
//                 <Link
//                   to="/"
//                   className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full transition ease-in-out duration-200 hover:bg-gray100"
//                 >
//                   <img src={linkedin} alt="facebook icon" width={24} />
//                 </Link>
//                 <Link
//                   to="/"
//                   className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full transition ease-in-out duration-200 hover:bg-gray100"
//                 >
//                   <img src={messanger} alt="facebook icon" width={24} />
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="bg-black600">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-center py-4 gap-4 flex-wrap">
//             <Link to="/" className="inline-flex">
//               <img
//                 src={eduwise}
//                 alt="our group logo"
//                 className="w-[60px] sm:w-[70px] md:w-[80px]"
//               />
//             </Link>
//             <Link
//               to="/"
//               className="inline-flex lg:pl-4 lg:border-l border-gray100 border-opacity-30"
//             >
//               <img
//                 src={finwise}
//                 alt="our group logo"
//                 className="w-[60px] sm:w-[70px] md:w-[80px]"
//               />
//             </Link>
//             <Link
//               to="/"
//               className="inline-flex lg:pl-4 lg:border-l border-gray100 border-opacity-30"
//             >
//               <img
//                 src={fundDay}
//                 alt="our group logo"
//                 className="w-[60px] sm:w-[70px] md:w-[80px]"
//               />
//             </Link>
//             <Link
//               to="/"
//               className="inline-flex lg:pl-4 lg:border-l border-gray100 border-opacity-30"
//             >
//               <img
//                 src={quicDigital}
//                 alt="our group logo"
//                 className="w-[60px] sm:w-[70px] md:w-[80px]"
//               />
//             </Link>
//             <Link
//               to="/"
//               className="inline-flex lg:pl-4 lg:border-l border-gray100 border-opacity-30"
//             >
//               <img
//                 src={tutorWise}
//                 alt="our group logo"
//                 className="w-[60px] sm:w-[70px] md:w-[80px]"
//               />
//             </Link>
//             <Link
//               to="/"
//               className="inline-flex lg:pl-4 lg:border-l border-gray100 border-opacity-30"
//             >
//               <img
//                 src={tutorWise1}
//                 alt="our group logo"
//                 className="w-[60px] sm:w-[70px] md:w-[80px]"
//               />
//             </Link>
//             <Link
//               to="/"
//               className="inline-flex lg:pl-4 lg:border-l border-gray100 border-opacity-30"
//             >
//               <img
//                 src={wiseCorporation}
//                 alt="our group logo"
//                 className="w-[60px] sm:w-[70px] md:w-[80px]"
//               />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };
// export default Footer;
