import { useEffect, useState } from "react";
import API from "../../api/API";
import SearchInput from "../../components/SearchInput";
import SortDropdown from "../../components/SortDropdown";
import StudentQuizCard from "../../components/StudentQuizCard";
import { formatDateTime } from "../../utils/FormateDateTime";

const MyAnnouncement = () => {
  const [quizData, setQuizData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const limit = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  const sortOptions = [
    { value: "today", label: "Registration Will Close Today" },
    { value: "tomorrow", label: "Registration Will Close Tomorrow" },
    { value: "next_3", label: "Registration Will Close Next 3 Days" },
    { value: "next_7", label: "Registration Will Close Next 7 Days" },
  ];

  const fetchQuizData = async (page = 1) => {
    try {
      setLoading(true);
      setError("");
      const offset = (page - 1) * limit;
      let url = `/anc/student-announcement-reg-list/?limit=${limit}&offset=${offset}`;

      if (sortOption) url += `&sort=${sortOption}`;

      const response = await API.get(url);

      if (response?.status >= 200 && response?.status < 300) {
        const results = response?.data?.results || [];
        setQuizData(results);
        setCount(response?.data?.count || 0);

        if (searchQuery.trim() !== "") {
          const keyword = searchQuery.toLowerCase();
          const filtered = results.filter(
            (quiz) =>
              quiz.announcement_name.toLowerCase().includes(keyword) ||
              quiz.organizer_name.toLowerCase().includes(keyword)
          );
          setFilteredData(filtered);
        } else {
          setFilteredData(results);
        }
      } else {
        setError(response?.data?.message || "Failed to fetch data.");
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Something went wrong while fetching data.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchQuizData(currentPage);
    } else {
      const keyword = searchQuery.toLowerCase();
      const filtered = quizData.filter(
        (quiz) =>
          quiz.announcement_name.toLowerCase().includes(keyword) ||
          quiz.organizer_name.toLowerCase().includes(keyword)
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, sortOption, currentPage]);

  const effectiveCount =
    searchQuery.trim() !== "" ? filteredData.length : count;

  const totalPages = Math.ceil(effectiveCount / limit);

  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 md:gap-0">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl 2xl:text-3xl text-black font-semibold">
              Your Announcement list
            </h2>
            <p className="text-base text-gray-600">
              Total Results:{" "}
              <span className="font-semibold">{effectiveCount}</span>
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

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold mt-10">
            {error}
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {filteredData.length > 0 ? (
                filteredData.map(
                  (quiz) =>
                    quiz.is_active && (
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
                        cardButtonText="View Rounds"
                        showCashPrize={quiz.is_exciting_price}
                        showCertificate={quiz.is_certificate}
                        termsLink={`/terms/${quiz.id}`}
                        organizer={quiz.organizer_name}
                      />
                    )
                )
              ) : (
                <div className="col-span-full text-center text-red-500 font-semibold mt-10">
                  No quiz found for "{searchQuery}"
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-16">
                <div className="flex items-center gap-2">
                  {/* Previous button */}
                  <button
                    onClick={() =>
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-primary text-white"
                    }`}
                  >
                    Prev
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                            currentPage === i
                              ? "bg-primary text-white shadow-md scale-105"
                              : "bg-gray-100 text-gray-600 hover:text-primary"
                          }`}
                        >
                          {i}
                        </button>
                      )
                    )}
                  </div>

                  {/* Next button */}
                  <button
                    onClick={() =>
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
                    }
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
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
      </div>
    </section>
  );
};

export default MyAnnouncement;
