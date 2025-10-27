import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API from "../../api/API";
import ImageSlider from "../../components/ImageSlider";
import AllAnnouncementList from "./AllAnnouncementList";

const Dashboard = () => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sliderImages, setSliderImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await API.get("/anc/student-dashboard-reg-open-anc/");
      console.log("fetchQuizData", response.data.data);

      if (!response?.data?.data) {
        setQuizData([]);
        setErrorMessage("No results found");
        return;
      }

      const allQuizzes = response.data.data;

      if (allQuizzes.length === 0) {
        setQuizData([]);
        setErrorMessage(
          "Currently, no quizzes are available for registration."
        );
      } else {
        setQuizData(allQuizzes);
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setQuizData([]);
      setErrorMessage("Failed to fetch announcements!");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (quizId) => {
    setSelectedQuizId(quizId);
    setShowModal(true);
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await API.post(
        `/anc/announcement/${selectedQuizId}/reg/`
      );

      if (response?.status === 200 || response?.status === 201) {
        toast.success("Successfully Registered!");
        setShowModal(false);

        setQuizData((prevData) =>
          prevData.map((quiz) =>
            quiz.id === selectedQuizId ? { ...quiz, is_registered: true } : quiz
          )
        );
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Registration failed, try again!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
    fetchQuizData();
  }, []);

  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl 2xl:text-3xl text-black font-semibold">
            Dashboard
          </h2>
          <div className="flex items-center justify-center mb-8">
            <Link
              to="/student/all-announcement"
              className="text-white bg-gradient-to-r from-primary to-secondary py-[6px] px-6 inline-block rounded-lg font-medium text-base"
            >
              All Announcement
            </Link>
          </div>
        </div>
        {/* Banner Slider */}
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden banner_slider event_slider">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : (
            <ImageSlider images={sliderImages} />
          )}
        </div>

        <AllAnnouncementList />
      </div>
    </section>
  );
};

export default Dashboard;

// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import SearchInput from "../../components/SearchInput";
// import SortDropdown from "../../components/SortDropdown";
// import StudentQuizCard from "../../components/StudentQuizCard";
// import { formatDateTime } from "../../utils/FormateDateTime";

// const AnnouncementList = () => {
//   const [quizData, setQuizData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [count, setCount] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [selectedQuizId, setSelectedQuizId] = useState(null);

//   const limit = 8;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOption, setSortOption] = useState("");

//   const sortOptions = [
//     { value: "today", label: "Registration Will Close Today" },
//     { value: "tomorrow", label: "Registration Will Close Tomorrow" },
//     { value: "next_3", label: "Registration Will Close Next 3 Days" },
//     { value: "next_7", label: "Registration Will Close Next 7 Days" },
//   ];

//   const fetchQuizData = async (page = 1) => {
//     try {
//       setLoading(true);
//       const offset = (page - 1) * limit;
//       let url = `${API_ENDPOINS.ANNOUNCEMENT_LIST}?limit=${limit}&offset=${offset}`;

//       if (sortOption) url += `&sort=${sortOption}`;

//       const response = await API.get(url);
//       const results = response?.data?.results?.data || [];

//       setQuizData(results);
//       setCount(response?.data?.count || 0);

//       if (searchQuery.trim() !== "") {
//         const keyword = searchQuery.toLowerCase();
//         const filtered = results.filter(
//           (quiz) =>
//             quiz.announcement_name.toLowerCase().includes(keyword) ||
//             quiz.organizer_name.toLowerCase().includes(keyword)
//         );
//         setFilteredData(filtered);
//       } else {
//         setFilteredData(results);
//       }
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message ||
//         err.response?.data?.detail ||
//         "Failed to fetch announcements!";
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       fetchQuizData(currentPage);
//     } else {
//       const keyword = searchQuery.toLowerCase();
//       const filtered = quizData.filter(
//         (quiz) =>
//           quiz.announcement_name.toLowerCase().includes(keyword) ||
//           quiz.organizer_name.toLowerCase().includes(keyword)
//       );
//       setFilteredData(filtered);
//     }
//   }, [searchQuery, sortOption, currentPage]);

//   // Modal handler
//   const handleOpenModal = (quizId) => {
//     setSelectedQuizId(quizId);
//     setShowModal(true);
//   };

//   const handleRegister = async () => {
//     try {
//       setLoading(true);
//       const response = await API.post(
//         `/anc/announcement/${selectedQuizId}/reg/`
//       );

//       if (response?.status === 200 || response?.status === 201) {
//         toast.success("Successfully Registered!");
//         setShowModal(false);
//       }
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message ||
//         err.response?.data?.detail ||
//         "Registration failed, try again!";
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const effectiveCount =
//     searchQuery.trim() !== "" ? filteredData.length : count;

//   const totalPages = Math.ceil(effectiveCount / limit);

//   return (
//     <section>
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row md:justify-between mb-4 xl:mb-8 items-center gap-2">
//           <div className="mb-4">
//             <h2 className="text-2xl xl:text-4xl font-bold mb-2">
//               All Announcement list
//             </h2>
//             <p className="text-base text-gray-600">
//               Total Results:{" "}
//               <span className="font-semibold">{effectiveCount}</span>
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <SearchInput value={searchQuery} onChange={setSearchQuery} />
//             <SortDropdown
//               options={sortOptions}
//               selected={sortOption}
//               onChange={setSortOption}
//             />
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-40">
//             <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
//           </div>
//         ) : (
//           <>
//             {/* Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//               {filteredData.length > 0 ? (
//                 filteredData.map(
//                   (quiz) =>
//                     quiz.is_active && (
//                       <StudentQuizCard
//                         key={quiz.id}
//                         quizId={quiz.id}
//                         layout="vertical"
//                         image={quiz.announcement_event_image}
//                         title={quiz.announcement_name}
//                         startDate={formatDateTime(quiz.registration_start_date)}
//                         endDate={formatDateTime(quiz.registration_end_date)}
//                         rounds={quiz.round_number}
//                         duration={quiz.total_days}
//                         lp_status={quiz.lp_status}
//                         registared={quiz.is_registered}
//                         showCashPrize={quiz.is_exciting_price}
//                         showCertificate={quiz.is_certificate}
//                         termsLink={`/terms/${quiz.id}`}
//                         organizer={quiz.organizer_name}
//                         onButtonClick={handleOpenModal}
//                       />
//                     )
//                 )
//               ) : (
//                 <div className="col-span-full text-center text-red-500 font-semibold mt-10">
//                   No quiz found for "{searchQuery}"
//                 </div>
//               )}
//             </div>

//             {/* Pagination */}
//             {filteredData.length > 0 && totalPages > 1 && (
//               <div className="flex flex-col items-center gap-2 mt-16">
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() =>
//                       currentPage > 1 && setCurrentPage(currentPage - 1)
//                     }
//                     disabled={currentPage === 1}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === 1
//                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                         : "bg-primary text-white"
//                     }`}
//                   >
//                     Previous
//                   </button>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                     (i) => (
//                       <button
//                         key={i}
//                         onClick={() => setCurrentPage(i)}
//                         className={`px-3 py-1 rounded ${
//                           currentPage === i
//                             ? "bg-primary text-white"
//                             : "bg-gray-100 text-black600-400"
//                         }`}
//                       >
//                         {i}
//                       </button>
//                     )
//                   )}

//                   <button
//                     onClick={() =>
//                       currentPage < totalPages &&
//                       setCurrentPage(currentPage + 1)
//                     }
//                     disabled={currentPage === totalPages}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === totalPages
//                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                         : "bg-primary text-white"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {/* Modal */}
//         {showModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black600 bg-opacity-50 z-50">
//             <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
//               <h3 className="text-lg font-bold mb-4 text-center">
//                 Are you sure to participate this quiz?
//               </h3>
//               <div className="flex justify-center gap-4">
//                 <button
//                   onClick={handleRegister}
//                   className="bg-red700 text-white py-2 px-4 rounded hover:bg-red-800"
//                 >
//                   Registration Now
//                 </button>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="border border-gray-400 py-2 px-4 rounded hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default AnnouncementList;
