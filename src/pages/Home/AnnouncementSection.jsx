import { forwardRef, useEffect, useState } from "react";
import CountUp from "react-countup";
import API from "../../api/API";
import { API_ENDPOINS } from "../../api/ApiEndpoints";
import Dollar from "../../assets/icons/dollar.svg";
import Trophy from "../../assets/icons/trophy.svg";
import UserPlus from "../../assets/icons/user-plus.svg";
import ShapeBottom from "../../assets/shape/ann-bottom.png";
import ShapeTop from "../../assets/shape/ann-top.png";
import QuizCard from "../../components/QuizCard";
import SearchInput from "../../components/SearchInput";
import SortDropdown from "../../components/SortDropdown";
import { formatDateTime } from "../../utils/FormateDateTime";

const AnnouncementSection = forwardRef((props, ref) => {
  const [quizData, setQuizData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalA, setTotalA] = useState(null);
  const [error, setError] = useState(null);

  const limit = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  // fetch Quiz data
  const fetchQuizData = async (page = 1, query = "", sort = "") => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      let url = `${API_ENDPOINS.ANNOUNCEMENT_LIST}?limit=${limit}&offset=${offset}`;

      if (query.trim() !== "") {
        url += `&keyword=${encodeURIComponent(query)}`;
      }

      if (sort) {
        url += `&sort=${sort}`;
      }

      const response = await API.get(url);

      const results = response?.data?.results?.data || [];
      const hasData = results.length > 0;

      if (response?.data?.status === false || !hasData) {
        setQuizData([]);
        setCount(0);
        setErrorMessage("No results found");
      } else {
        setQuizData(results);
        setCount(response?.data?.count ?? results.length);
        setErrorMessage("");
      }
    } catch (err) {
      console.error(err);
      setQuizData([]);
      setCount(0);
      setErrorMessage("No results found");
    } finally {
      setLoading(false);
    }
  };

  // const fetchQuizData = async (page = 1, query = "", sort = "") => {
  //   try {
  //     setLoading(true);
  //     setErrorMessage("");
  //     const offset = (page - 1) * limit;

  //     let url = `${API_ENDPOINS.ANNOUNCEMENT_LIST}?limit=${limit}&offset=${offset}`;

  //     if (query.trim() !== "") {
  //       url += `&keyword=${encodeURIComponent(query)}`;
  //     }

  //     if (sort) {
  //       url += `&sort=${sort}`;
  //     }

  //     const response = await API.get(url);

  //     if (response?.data?.status === false) {
  //       setQuizData([]);
  //       setCount(0);
  //       setErrorMessage(response?.data?.message || "No results found");
  //       return;
  //     }

  //     const results = response?.data?.results?.data || [];
  //     setQuizData(results);
  //     setCount(response?.data?.count ?? results.length);
  //   } catch (err) {
  //     console.log(err);
  //     setQuizData([]);
  //     setCount(0);
  //     setErrorMessage(err?.data?.message || "No results found");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchQuizData(currentPage, searchQuery, sortOption);
  }, [searchQuery, sortOption, currentPage]);

  const totalPages = Math.ceil(count / limit);

  // hero data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await API.get("/qzz/hero-section");
        console.log("Fetch data:", response.data);
        setTotalA(response.data);
      } catch (err) {
        console.error("API fetch error:", err);
        setError("Data Not Found");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section ref={ref} className="py-10 lg:py-16 xl:py-20 relative">
      <div className="container mx-auto px-4">
        {/* Stats Boxes */}
        <div className="w-full py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {loading ? (
              <p className="col-span-3 text-center text-gray-400">Loading...</p>
            ) : error ? (
              <p className="col-span-3 text-center text-red-400">{error}</p>
            ) : (
              <>
                {/* Participants */}
                <div className="bg-white shadow-sm rounded-2xl p-6 flex items-center space-x-4">
                  <div className="flex items-center justify-center w-14 h-14 bg-[#ECF1FC] rounded-xl">
                    <img src={UserPlus} alt="User Icon" className="max-w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      <CountUp
                        end={totalA?.total_participants || 0}
                        duration={5}
                      />
                      +
                    </h3>
                    <p className="text-gray-500 text-sm">Participants</p>
                  </div>
                </div>

                {/* Winners */}
                <div className="bg-white shadow-sm rounded-2xl p-6 flex items-center space-x-4">
                  <div className="flex items-center justify-center w-14 h-14 bg-[#ECF1FC] rounded-xl">
                    <img src={Trophy} alt="Trophy image" className="max-w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      <CountUp end={totalA?.total_winner || 0} duration={5} />+
                    </h3>
                    <p className="text-gray-500 text-sm">Winners</p>
                  </div>
                </div>

                {/* Lacs Prize Money */}
                <div className="bg-white shadow-sm rounded-2xl p-6 flex items-center space-x-4">
                  <div className="flex items-center justify-center w-14 h-14 bg-[#ECF1FC] rounded-xl">
                    <img src={Dollar} alt="dollar image" className="max-w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      <CountUp end={totalA?.total_quizzes || 0} duration={5} />+
                    </h3>
                    <p className="text-gray-500 text-sm">Lacs Prize Money</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search + Sort header */}
        <div className="mb-4 text-center relative z-20">
          <h2 className="text-3xl lg:text-4xl 2xl:text-5xl font-bold text-secondary mb-2">
            All Announcement
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-primary mx-auto mb-8 sm:mb-10 rounded-full"></div>
          {/* <p className="text-base text-gray-600 text-center md:text-left">
            Total Announcement: <span className="font-semibold">{count}</span>
          </p> */}
        </div>
        <div className="flex items-center justify-center md:justify-end gap-2">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <SortDropdown
            options={[
              { value: "", label: "All" },
              { value: "today", label: "Registration Will Close Today" },
              {
                value: "tomorrow",
                label: "Registration Will Close Tomorrow",
              },
              {
                value: "next_3",
                label: "Registration Will Close Next 3 Days",
              },
              {
                value: "next_7",
                label: "Registration Will Close Next 7 Days",
              },
            ]}
            selected={sortOption}
            onChange={setSortOption}
          />
        </div>
        <div className="flex flex-col md:flex-row md:justify-between mb-4 xl:mb-8 items-center gap-2"></div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-gray300 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* error message */}
            {errorMessage ? (
              <div className="text-center text-red500 font-semibold mt-10">
                {errorMessage}
              </div>
            ) : (
              <>
                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {quizData.map(
                    (quiz) =>
                      quiz.is_active && (
                        <QuizCard
                          key={quiz.id}
                          quizId={quiz.id}
                          layout="vertical"
                          image={quiz.announcement_event_image}
                          title={quiz.announcement_name}
                          startDate={formatDateTime(
                            quiz.registration_start_date
                          )}
                          endDate={formatDateTime(quiz.registration_end_date)}
                          rounds={quiz.round_number}
                          duration={quiz.total_days}
                          registrationLink={`/register/${quiz.id}`}
                          lp_status={quiz.lp_status}
                          showCashPrize={quiz.is_exciting_price}
                          showCertificate={quiz.is_certificate}
                          termsLink={`/terms/${quiz.id}`}
                          organizer={quiz.organizer_name}
                          subject={quiz.subject}
                          department_name={quiz.department_name}
                        />
                      )
                  )}
                </div>

                {/* Pagination */}
                {quizData.length > 0 && totalPages > 1 && (
                  <div className="flex flex-col items-center gap-4 mt-8 xl:mt-16 relative z-20">
                    <div className="flex items-center gap-2">
                      {/* Previous button */}
                      <button
                        onClick={() =>
                          currentPage > 1 && setCurrentPage(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-full font-medium transition-all ${
                          currentPage === 1
                            ? "bg-secondary text-white cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary"
                        }`}
                      >
                        Previous
                      </button>

                      {/* Pagination numbers */}
                      {(() => {
                        const maxVisible = 3;
                        const startPage =
                          Math.floor((currentPage - 1) / maxVisible) *
                            maxVisible +
                          1;
                        const endPage = Math.min(
                          startPage + maxVisible - 1,
                          totalPages
                        );

                        const pages = [];
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
                                currentPage === i
                                  ? "bg-primary text-white shadow-md scale-105"
                                  : "bg-secondary text-white hover:bg-primary hover:text-white"
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }

                        return pages;
                      })()}

                      {/* Next button */}
                      <button
                        onClick={() =>
                          currentPage < totalPages &&
                          setCurrentPage(currentPage + 1)
                        }
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-full font-medium transition-all ${
                          currentPage === totalPages
                            ? "bg-secondary text-gray-500 cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      {/* shape top */}
      <div className="absolute top-0 left-0 right-0 w-full z-10">
        <img src={ShapeTop} alt="top shape image" className="w-full" />
      </div>
      {/* shape bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-10">
        <img src={ShapeBottom} alt="top shape image" className="w-full" />
      </div>
    </section>
  );
});

export default AnnouncementSection;
