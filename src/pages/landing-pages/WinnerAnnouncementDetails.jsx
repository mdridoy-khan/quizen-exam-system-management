import { BiLogOutCircle } from "react-icons/bi";
import { Link } from "react-router-dom";
import WinnerAnnouncementImage from "../../assets/images/winner-announcement.jpg";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const WinnerAnnouncementDetails = () => {
  return (
    <div>
      {/* Common header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 sm:my-16 lg:my-20">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray900 mb-4 sm:mb-6 md:mb-8 text-center">
          Winner Announcement of “Quiz Competition 2025”
        </h2>

        <div className="max-w-3xl mx-auto drop-shadow-xl space-y-4 sm:space-y-6">
          <img
            src={WinnerAnnouncementImage}
            alt="Winner announcement image"
            className="w-full h-auto object-cover rounded-xl sm:rounded-2xl"
          />
          <div className="flex items-center justify-end">
            <Link
              to="/winners"
              className="flex items-center gap-1.5 bg-cyan600 py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg text-sm sm:text-base font-semibold text-white transition-all hover:bg-blue700 focus:ring-2 focus:ring-blue500 focus:ring-offset-2"
            >
              <BiLogOutCircle size={18} className="sm:w-5 sm:h-5" />
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Common footer */}
      <Footer />
    </div>
  );
};

export default WinnerAnnouncementDetails;
