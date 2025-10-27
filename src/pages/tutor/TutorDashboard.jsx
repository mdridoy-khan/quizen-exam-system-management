import { format } from "date-fns";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { TbExclamationCircle } from "react-icons/tb";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API from "../../api/API";
import ModalIcon from "../../assets/icons/smile.png";
import ImageSlider from "../../components/ImageSlider";
import QuizCard from "../../components/QuizCard";
import SearchInput from "../../components/SearchInput";
import SortDropdown from "../../components/SortDropdown";

const TutorDashboard = () => {
  const [announcementId, setAnnouncementId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(false);
  const [showQuizTypeModal, setShowQuizTypeModal] = useState(false);
  const [annData, setAnnData] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [sliderImages, setSliderImages] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  const limit = 8;

  const sortOptions = [
    { value: "", label: "All" },
    { value: "today", label: "Registration Will Close Today" },
    { value: "tomorrow", label: "Registration Will Close Tomorrow" },
    { value: "next_3", label: "Registration Will Close Next 3 Days" },
    { value: "next_7", label: "Registration Will Close Next 7 Days" },
  ];

  const fetchAnnouncementData = async (page = 1, query = "", sort = "") => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      let url = `/anc/announcement-list-lp/?limit=${limit}&offset=${offset}`;

      if (query.trim() !== "") {
        url += `&keyword=${encodeURIComponent(query)}`;
      }

      if (sort) {
        url += `&sort=${sort}`;
      }

      const response = await API.get(url);
      const data = response?.data?.results?.data || [];
      setAnnData(data);
      setCount(response?.data?.count || 0);
    } catch (err) {
      console.log(err);
      setAnnData([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncementData(currentPage, searchQuery, sortOption);
  }, [currentPage, searchQuery, sortOption]);

  const totalPages = Math.ceil(count / limit);

  const handleAlert = (quizId) => {
    setAnnouncementId(quizId);
    setAlertMessage(true);
  };

  const handleContinueClick = () => {
    setAlertMessage(false);
    setShowQuizTypeModal(true);
  };

  const handleCloseModal = () => {
    setAlertMessage(false);
    setShowQuizTypeModal(false);
    setAnnouncementId(null);
  };

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // banner slider images
  useEffect(() => {
    const getSlider = async () => {
      try {
        setLoading(true);
        const response = await API.get("/setting/slider-image/");
        setSliderImages(response.data || []);
      } catch (err) {
        console.error("API fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    getSlider();
  }, []);

  // handle aleat modal close
  const handleClose = () => {
    setAlertMessage(false);
    setAnnouncementId(null);
  };

  return (
    <div>
      {/* Banner Slider */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden banner_slider event_slider">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <ImageSlider images={sliderImages} />
        )}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between mt-6">
        <div className="mb-4 lg:mb-8 text-center md:text-left">
          <h2 className="text-2xl xl:text-4xl font-bold">Announcement list</h2>
          <div className="mt-2 font-semibold">Total Results: {count}</div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 mb-6">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <SortDropdown
            options={sortOptions}
            selected={sortOption}
            onChange={setSortOption}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {annData.length > 0 ? (
              annData.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quizId={quiz.id}
                  layout="vertical"
                  image={quiz.announcement_event_image}
                  title={quiz.announcement_name}
                  startDate={format(
                    new Date(quiz.registration_start_date),
                    "MMM dd, yyyy"
                  )}
                  endDate={format(
                    new Date(quiz.registration_end_date),
                    "MMM dd, yyyy"
                  )}
                  rounds={quiz.round_number}
                  duration={quiz.total_days}
                  registrationLink={`/register/${quiz.id}`}
                  onButtonClick={() => handleAlert(quiz.id)}
                  shareQuestion="Share Question"
                  showCashPrize={quiz.is_exciting_price}
                  showCertificate={quiz.is_certificate}
                  termsLink={`/terms/${quiz.id}`}
                  organizer={quiz.organizer_name}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-red-500 font-semibold mt-10">
                No announcement found
              </div>
            )}
          </div>

          {/* Pagination */}
          {annData.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`x-4 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                Previous
              </button>

              {(() => {
                const pageButtons = [];
                const visiblePages = 3;
                const startPage =
                  Math.floor((currentPage - 1) / visiblePages) * visiblePages +
                  1;
                const endPage = Math.min(
                  startPage + visiblePages - 1,
                  totalPages
                );

                for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                  pageButtons.push(
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                        currentPage === pageNum
                          ? "bg-primary text-white shadow-md scale-105"
                          : "bg-gray-100 text-gray-600 hover:bg-primary-light hover:text-primary"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }

                return pageButtons;
              })()}

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`x-4 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Notice Modal */}
      {alertMessage && announcementId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-[#FFFDF4] rounded-lg shadow-lg p-6 w-[500px]">
            {/* Close Button */}
            <div className="flex justify-end mb-2">
              <button onClick={handleClose}>
                <IoMdClose size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Icon */}
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center rounded-full">
                  <TbExclamationCircle size={60} className="text-[#EAB308]" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-black600 text-xl xl:text-2xl font-semibold text-center">
                Notice for Quiz ID: {announcementId}
              </h3>

              {/* Message */}
              <p className="text-gray700 text-center font-medium text-sm leading-relaxed">
                We're truly glad, know that you're valued and supported every
                step of the way. Make yourself at home, explore freely, and
                don't hesitate to reach out if you need anything.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center mt-8 gap-4">
              <Link
                to={`/quiz/${announcementId}`}
                className="bg-gradient-to-r from-gradientEnd to-gradientStart text-white py-2 px-6 rounded font-semibold transition hover:opacity-90"
              >
                Learn More
              </Link>
              <button
                onClick={handleContinueClick}
                className="w-1/2 bg-gradient-to-r from-gradientEnd to-gradientStart text-white py-2 px-6 rounded font-semibold transition hover:opacity-90"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI / Manual Modal */}
      {showQuizTypeModal && announcementId && (
        <div className="fixed inset-0 bg-black600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-2xl mx-4">
            <div className="bg-white shadow-lg rounded-lg max-w-xl p-6">
              <div className="flex items-center justify-end mb-4">
                <button
                  onClick={handleCloseModal}
                  className="p-1 rounded transition hover:bg-gray300"
                >
                  <IoCloseOutline size={20} />
                </button>
              </div>
              <div className="flex items-center justify-center mb-4">
                <img src={ModalIcon} alt="modal icon" />
              </div>
              <h3 className="text-center text-xl font-semibold mb-8 px-8">
                To create a quiz (Quiz ID: {announcementId}), which method do
                you use?
              </h3>
              <div className="flex items-center justify-center gap-2 pb-4">
                <Link
                  to={`/tutor/question-maker/${announcementId}`}
                  className="bg-gradient-to-r from-gradientEnd to-gradientStart text-white py-2 px-6 rounded font-semibold transition hover:opacity-90"
                >
                  AI
                </Link>
                <Link
                  to={`/tutor/manual-question-maker/${announcementId}`}
                  className="bg-gradient-to-r from-gradientEnd to-gradientStart text-white py-2 px-6 rounded font-semibold transition hover:opacity-90"
                >
                  Manual
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorDashboard;

// import { format } from "date-fns";
// import { useEffect, useState } from "react";
// import { IoCloseOutline } from "react-icons/io5";
// import { TbExclamationCircle } from "react-icons/tb";
// import { Link } from "react-router-dom";
// import API from "../../api/API";
// import QuizCard from "../../components/QuizCard";
// import SearchInput from "../../components/SearchInput";
// import SortDropdown from "../../components/SortDropdown";

// const TutorAnnouncement = () => {
//   const [announcementId, setAnnouncementId] = useState(null);
//   const [alertMessage, setAlertMessage] = useState(false);
//   const [showQuizTypeModal, setShowQuizTypeModal] = useState(false);
//   const [annData, setAnnData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [count, setCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOption, setSortOption] = useState("");

//   const limit = 8;

//   const sortOptions = [
//     { value: "today", label: "Registration Will Close Today" },
//     { value: "tomorrow", label: "Registration Will Close Tomorrow" },
//     { value: "next_3", label: "Registration Will Close Next 3 Days" },
//     { value: "next_7", label: "Registration Will Close Next 7 Days" },
//   ];

//   const fetchAnnouncementData = async (page = 1) => {
//     try {
//       setLoading(true);
//       const offset = (page - 1) * limit;
//       let url = `/anc/announcement-list-lp/?limit=${limit}&offset=${offset}`;

//       if (sortOption) url += `&sort=${sortOption}`;

//       const response = await API.get(url);
//       const data = response?.data?.results?.data || [];
//       setAnnData(data);
//       setCount(response?.data?.count || 0);

//       // search applied হলে frontend filter
//       if (searchQuery.trim() !== "") {
//         const keyword = searchQuery.toLowerCase();
//         const filtered = data.filter(
//           (item) =>
//             item.announcement_name.toLowerCase().includes(keyword) ||
//             item.organizer_name.toLowerCase().includes(keyword)
//         );
//         setFilteredData(filtered);
//       } else {
//         setFilteredData(data);
//       }
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       fetchAnnouncementData(currentPage);
//     } else {
//       const keyword = searchQuery.toLowerCase();
//       const filtered = annData.filter(
//         (item) =>
//           item.announcement_name.toLowerCase().includes(keyword) ||
//           item.organizer_name.toLowerCase().includes(keyword)
//       );
//       setFilteredData(filtered);
//     }
//   }, [currentPage, searchQuery, sortOption]);

//   // total count logic for search + pagination
//   const effectiveCount =
//     searchQuery.trim() !== "" ? filteredData.length : count;
//   const totalPages = Math.ceil(effectiveCount / limit);

//   const handleAlert = (quizId) => {
//     setAnnouncementId(quizId);
//     setAlertMessage(true);
//   };

//   const handleContinueClick = () => {
//     setAlertMessage(false);
//     setShowQuizTypeModal(true);
//   };

//   const handleCloseModal = () => {
//     setAlertMessage(false);
//     setShowQuizTypeModal(false);
//     setAnnouncementId(null);
//   };

//   const handlePageChange = (pageNum) => {
//     if (pageNum >= 1 && pageNum <= totalPages) {
//       setCurrentPage(pageNum);
//     }
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <div className="mb-4 lg:mb-8">
//           <h2 className="text-2xl xl:text-4xl font-bold">Announcement list</h2>
//           {/* Total count */}
//           <div className="mt-4 font-semibold">
//             Total Results: {effectiveCount}
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row items-center gap-2 mb-6">
//           <SearchInput value={searchQuery} onChange={setSearchQuery} />
//           <SortDropdown
//             options={sortOptions}
//             selected={sortOption}
//             onChange={setSortOption}
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <div className="w-10 h-10 border-4 border-gray-300 border-t-primary)] rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <>
//           {/* Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
//             {filteredData.length > 0 ? (
//               filteredData.map((quiz) => (
//                 <QuizCard
//                   key={quiz.id}
//                   quizId={quiz.id}
//                   layout="vertical"
//                   image={quiz.announcement_event_image}
//                   title={quiz.announcement_name}
//                   startDate={format(
//                     new Date(quiz.registration_start_date),
//                     "MMM dd, yyyy"
//                   )}
//                   endDate={format(
//                     new Date(quiz.registration_end_date),
//                     "MMM dd, yyyy"
//                   )}
//                   rounds={quiz.round_number}
//                   duration={quiz.total_days}
//                   registrationLink={`/register/${quiz.id}`}
//                   onButtonClick={() => handleAlert(quiz.id)}
//                   shareQuestion="Share Question"
//                   showCashPrize={quiz.is_exciting_price}
//                   showCertificate={quiz.is_certificate}
//                   termsLink={`/terms/${quiz.id}`}
//                   organizer={quiz.organizer_name}
//                 />
//               ))
//             ) : (
//               <div className="col-span-full text-center text-red-500 font-semibold mt-10">
//                 No announcement found for "{searchQuery}"
//               </div>
//             )}
//           </div>

//           {/* Pagination */}
//           {filteredData.length > 0 && (
//             <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-1 rounded border ${
//                   currentPage === 1
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 Previous
//               </button>

//               {[...Array(totalPages)].map((_, index) => {
//                 const pageNum = index + 1;
//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => handlePageChange(pageNum)}
//                     className={`px-3 py-1 rounded border ${
//                       currentPage === pageNum
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-gray-100 hover:bg-gray-200"
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-3 py-1 rounded border ${
//                   currentPage === totalPages
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Notice Modal */}
//       {alertMessage && announcementId && (
//         <div className="fixed inset-0 bg-black600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="max-w-2xl mx-4">
//             <div className="bg-orange200)] p-4 rounded-xl flex">
//               <span className="w-10">
//                 <TbExclamationCircle
//                   size={24}
//                   style={{ color: "var(primary)" }}
//                 />
//               </span>
//               <div className="flex-1 mb-2">
//                 <span className="text-base font-medium mb-1 flex items-center gap-2">
//                   Notice for Quiz ID: {announcementId}
//                 </span>
//                 <p className="text-sm font-medium">
//                   We're truly glad, know that you're valued and supported every
//                   step of the way. Make yourself at home, explore freely, and
//                   don't hesitate to reach out if you need anything.
//                 </p>
//                 <div className="flex items-center justify-between mt-3">
//                   <Link
//                     to={`/quiz/${announcementId}`}
//                     className="font-semibold underline"
//                   >
//                     Learn More
//                   </Link>
//                   <button
//                     onClick={handleContinueClick}
//                     className="py-1 px-2 rounded font-semibold bg-[#BAB86D] text-white"
//                   >
//                     Continue
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* AI / Manual Modal */}
//       {showQuizTypeModal && announcementId && (
//         <div className="fixed inset-0 bg-black600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="max-w-2xl mx-4">
//             <div className="bg-white shadow-lg rounded-lg max-w-xl p-6">
//               <div className="flex items-center justify-end mb-4">
//                 <button
//                   onClick={handleCloseModal}
//                   className="p-1 rounded transition hover:bg-gray300)]"
//                 >
//                   <IoCloseOutline size={20} />
//                 </button>
//               </div>
//               <h3 className="text-center text-xl font-semibold mb-8 px-8">
//                 To create a quiz (Quiz ID: {announcementId}), which method do
//                 you use?
//               </h3>
//               <div className="flex items-center justify-center gap-2 pb-4">
//                 <Link
//                   to={`/tutor/question-maker/${announcementId}`}
//                   className="text-black600)] border border-black600)] bg-transparent py-2 px-6 text-base font-semibold rounded-lg transition hover:bg-black600)] hover:text-white)]"
//                 >
//                   AI
//                 </Link>
//                 <Link
//                   to={`/tutor/manual-question-maker/${announcementId}`}
//                   className="text-black600)] border border-black600)] bg-transparent py-2 px-6 text-base font-semibold rounded-lg transition hover:bg-black600)] hover:text-white)]"
//                 >
//                   Manual
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TutorAnnouncement;
