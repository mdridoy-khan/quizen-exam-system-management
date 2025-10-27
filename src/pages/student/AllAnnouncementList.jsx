import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API from "../../api/API";
import { API_ENDPOINS } from "../../api/ApiEndpoints";
import ModalIcon from "../../assets/icons/smile.png";
import SearchInput from "../../components/SearchInput";
import SortDropdown from "../../components/SortDropdown";
import StudentQuizCard from "../../components/StudentQuizCard";
import { formatDateTime } from "../../utils/FormateDateTime";

const AllAnnouncementList = () => {
  const [quizData, setQuizData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const limit = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const sortOptions = [
    { value: "", label: "All" },
    { value: "today", label: "Registration Will Close Today" },
    { value: "tomorrow", label: "Registration Will Close Tomorrow" },
    { value: "next_3", label: "Registration Will Close Next 3 Days" },
    { value: "next_7", label: "Registration Will Close Next 7 Days" },
  ];

  const fetchQuizData = async (page = 1, query = "", sort = "") => {
    try {
      setLoading(true);
      setErrorMessage("");
      const offset = (page - 1) * limit;
      let url = `${API_ENDPOINS.ANNOUNCEMENT_LIST}?limit=${limit}&offset=${offset}`;
      if (query.trim() !== "") url += `&keyword=${encodeURIComponent(query)}`;
      if (sort) url += `&sort=${sort}`;

      const response = await API.get(url);

      if (response?.data?.status === false) {
        setQuizData([]);
        setCount(0);
        setErrorMessage(response?.data?.message || "No results found");
        return;
      }

      setQuizData(response?.data?.results?.data || []);
      setCount(response?.data?.count || 0);
    } catch (err) {
      console.log("Error fetching announcements:", err);
      setQuizData([]);
      setCount(0);
      setErrorMessage("Failed to fetch announcements!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData(currentPage, searchQuery, sortOption);
  }, [currentPage, searchQuery, sortOption]);

  const totalPages = Math.ceil(count / limit);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Modal handlers
  const handleOpenModal = (quizId) => {
    setSelectedQuizId(quizId);
    setShowModal(true);
  };

  // const handleRegister = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await API.post(
  //       `/anc/announcement/${selectedQuizId}/reg/`
  //     );
  //     if (response?.status === 200 || response?.status === 201) {
  //       toast.success("Successfully Registered!");
  //       setShowModal(false);
  //     }
  //   } catch (err) {
  //     const errorMsg =
  //       err.response?.data?.message ||
  //       err.response?.data?.detail ||
  //       "Registration failed, try again!";
  //     toast.error(errorMsg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  return (
    <section>
      <div className="container mx-auto px-4">
        {/* Header + Search + Sort */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 md:gap-0">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl 2xl:text-3xl text-black font-semibold">
              All Announcement list
            </h2>
            <p className="text-base text-gray-600">
              Total Results: <span className="font-semibold">{count}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
            <SortDropdown
              options={sortOptions}
              selected={sortOption}
              onChange={setSortOption}
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : errorMessage ? (
          <div className="text-center text-red-500 font-semibold mt-10">
            {errorMessage}
          </div>
        ) : (
          <>
            {/* Quiz Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {quizData.length > 0 ? (
                quizData
                  .filter((quiz) => quiz.is_active)
                  .map((quiz) => (
                    <StudentQuizCard
                      key={quiz.id}
                      quizId={quiz.id}
                      layout="vertical"
                      image={quiz.announcement_event_image}
                      title={quiz.announcement_name}
                      startDate={formatDateTime(quiz.registration_start_date)}
                      endDate={formatDateTime(quiz.registration_end_date)}
                      rounds={quiz.round_number}
                      duration={quiz.total_days}
                      lp_status={quiz.lp_status}
                      registared={quiz.is_registered}
                      showCashPrize={quiz.is_exciting_price}
                      showCertificate={quiz.is_certificate}
                      termsLink={`/terms/${quiz.id}`}
                      organizer={quiz.organizer_name}
                      onButtonClick={handleOpenModal}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center text-red-500 font-semibold mt-10">
                  No quiz found for "{searchQuery}"
                </div>
              )}
            </div>

            {/* Pagination */}
            {quizData.length > 0 && totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-16">
                <div className="flex items-center gap-2">
                  {/* Previous button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {(() => {
                      let startPage = Math.max(currentPage - 1, 1);
                      let endPage = Math.min(startPage + 2, totalPages);

                      if (endPage - startPage < 2) {
                        startPage = Math.max(endPage - 2, 1);
                      }

                      return Array.from(
                        { length: endPage - startPage + 1 },
                        (_, i) => startPage + i
                      ).map((i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                            currentPage === i
                              ? "bg-primary text-white shadow-md scale-105"
                              : "bg-gray-100 text-gray-600 hover:bg-primary-light hover:text-primary"
                          }`}
                        >
                          {i}
                        </button>
                      ));
                    })()}
                  </div>

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                  >
                    Next
                  </button>
                </div>

                {/* Showing info */}
                {/* <p className="text-xs text-gray-500">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </p> */}
              </div>
            )}
          </>
        )}

        {/* Registration Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black600 bg-opacity-50 z-50">
            <div className="bg-[#FFFDF4] rounded-lg shadow-lg p-6 w-[600px]">
              <div className="flex gap-4 mb-4">
                <div>
                  <img src={ModalIcon} alt="modal image" />
                </div>
                <h3 className="text-xl xl:text-2xl mb-4">
                  Are you sure you want to participate in this quiz?
                </h3>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleRegister}
                  className="w-[50%] bg-gradient-to-r from-gradientEnd to-gradientStart text-white py-2 px-4 rounded"
                >
                  Register Now
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-primary text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllAnnouncementList;
