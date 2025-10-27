import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { TbExclamationCircle } from "react-icons/tb";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API from "../../api/API";
import ImageSlider from "../../components/ImageSlider";
import UserProfileCard from "../../components/UserProfileCard";

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);
  const [messageClose, setMessageClose] = useState({
    welcomeMessage: true,
    noticeMessage: true,
  });

  useEffect(() => {
    const studentInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get("/qzz/std-dashboard-view/");
        if (response?.data?.quiz_stats) {
          setStats(response.data.quiz_stats);
        } else {
          setError("No data available from API.");
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    studentInfo();
  }, []);

  // handle message modal close
  const handleMessageClose = (modalName) => {
    setMessageClose((prev) => ({ ...prev, [modalName]: false }));
  };

  // hero slider images fetch
  useEffect(() => {
    const getSlider = async () => {
      try {
        setLoading(true);
        const response = await API.get("/setting/slider-image/");
        console.log("Fetch slider:", response.data);
        setSliderImages(response.data);
      } catch (err) {
        console.error("API fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    getSlider();
  }, []);

  return (
    <div className="container mx-auto px-4">
      {/* header part */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl 2xl:text-3xl text-black font-semibold">
          Profile
        </h2>
        {/* <div className="flex items-center justify-center mb-8">
          <button
            className="text-white bg-gradient-to-r from-primary to-secondary py-[6px] px-6 inline-block rounded-lg font-medium text-base"
          >
            Edit Profile
          </button>
        </div> */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 2xl:gap-10">
        {/* profile card */}
        <div className="lg:col-span-1">
          <UserProfileCard />
        </div>

        {/* profile details content */}
        <div className="lg:col-span-2">
          {/* banner slider */}
          <div className="banner_slider event_slider">
            <ImageSlider images={sliderImages} singleView />
          </div>

          <div className="space-y-2">
            {/* welcome message */}
            {messageClose.welcomeMessage && (
              <div className="bg-[#FFFDF4] bg-opacity-30 p-4 rounded-xl mb-4 shadow">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-base font-medium block mb-1">
                    Welcome
                  </span>
                  <button onClick={() => handleMessageClose("welcomeMessage")}>
                    <RxCross2 size={20} />
                  </button>
                </div>
                <p className="text-sm font-medium mt-2">
                  We're truly dead, know that you’re valued and supported every
                  step of the way.Make yourself at home,explore freely, and
                  don’t hesitate to reach out if you need anything. Once again,
                  a heartfeltwelcome — we’re excited for what lies ahead!
                </p>
              </div>
            )}

            {/* notice message */}
            {messageClose.noticeMessage && (
              <div className="bg-orange-50 p-4 rounded-xl mb-8 shadow">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-base font-medium mb-1 flex items-center gap-2">
                    <TbExclamationCircle
                      size={24}
                      style={{ color: "primary" }}
                    />{" "}
                    Notice
                  </span>
                  <button onClick={() => handleMessageClose("noticeMessage")}>
                    <RxCross2 size={20} />
                  </button>
                </div>
                <p className="text-sm font-medium mt-2">
                  We're truly dead, know that you’re valued and supported every
                  step of the way.Make yourself at home,explore freely, and
                  don’t hesitate to reach out if you need anything. Once again,
                  a heartfeltwelcome — we’re excited for what lies ahead!
                </p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center mt-8">
              <div className="loader border-4 border-t-4 border-gray-200 rounded-full w-10 h-10 animate-spin"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 mt-8">{error}</p>
          ) : stats ? (
            <div className="mt-8 flex gap-4 flex-wrap">
              {/* question box */}
              <div className="bg-[#74b9ff] bg-opacity-30 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350 shadow">
                <span className="text-[15px] font-semibold mb-3 block">
                  Average Score
                </span>
                <h3 className="text-2xl font-semibold">
                  {stats.average_score}
                </h3>
              </div>
              <div className="bg-[#74b9ff] bg-opacity-30 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350 shadow">
                <span className="text-[15px] font-semibold mb-3 block">
                  Highest Score
                </span>
                <h3 className="text-2xl font-semibold">
                  {stats.highest_score}
                </h3>
              </div>
              <div className="bg-[#74b9ff] bg-opacity-30 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350 shadow">
                <span className="text-[15px] font-semibold mb-3 block">
                  Lowest Score
                </span>
                <h3 className="text-2xl font-semibold">{stats.lowest_score}</h3>
              </div>
              <div className="bg-[#74b9ff] bg-opacity-30 py-8 px-6 w-full xl:max-w-52 rounded-xl text-center transition hover:bg-cyan350 shadow">
                <span className="text-[15px] font-semibold mb-3 block">
                  Total Attempts
                </span>
                <h3 className="text-2xl font-semibold">
                  {stats.total_attempts}
                </h3>
              </div>
            </div>
          ) : (
            <p className="text-red-500 mt-8">No Information Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
