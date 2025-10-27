import { format } from "date-fns";
import { useEffect, useState } from "react";
import API from "../../api/API";
import { API_ENDPOINS } from "../../api/ApiEndpoints";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import QuizCard from "../../components/QuizCard";
import SearchInput from "../../components/SearchInput";

const ClosedQuiz = () => {
  const [closedQuiz, setClosedQuiz] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 8;

  const fetchClosedQuiz = async (page = 1, query = "") => {
    try {
      setLoading(true);
      setErrorMessage("");
      const offset = (page - 1) * limit;

      let url = `${API_ENDPOINS.CLOSED_QUIZ}?limit=${limit}&offset=${offset}`;
      if (query.trim() !== "") url += `&keyword=${encodeURIComponent(query)}`;

      const response = await API.get(url);

      if (response?.data?.status === false) {
        setClosedQuiz([]);
        setCount(0);
        setErrorMessage(response?.data?.message || "No results found");
        return;
      }

      console.log("Closed quiz", response.data.id);

      setClosedQuiz(response?.data || []);
      setCount(response?.data?.count || 0);
    } catch (err) {
      console.log("Error fetching closed quizzes:", err);
      setClosedQuiz([]);
      setCount(0);
      setErrorMessage("No results found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClosedQuiz(currentPage, searchQuery);
  }, [searchQuery, currentPage]);

  const totalPages = Math.ceil(count / limit);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="bg-body-gradient min-h-screen">
      <Header />

      <div className="container mx-auto px-4 my-10 lg:my-16 xl:my-20">
        <div className="flex items-center justify-between flex-col md:flex-row mb-4 xl:mb-8 gap-2">
          <h2 className="text-xl sm:text-2xl xl:text-4xl font-semibold text-black600">
            Closed Quizzes
          </h2>

          <div className="flex items-center gap-2">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-gray300 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : errorMessage ? (
          <div className="text-center text-primary font-semibold mt-10">
            {errorMessage}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {closedQuiz.length > 0 ? (
                closedQuiz.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
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
                    quizId={quiz.id}
                    winnerList={quiz.winner_list}
                    closedQuiz="Registration Closed"
                    lp_status={quiz.lp_status}
                    showCashPrize={quiz.is_pricemoney}
                    showCertificate={quiz.is_certificate}
                    termsLink="/terms-and-conditions"
                    organizer={quiz.organizer_name}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-primary font-semibold mt-10">
                  No quizzes found for "{searchQuery}"
                </div>
              )}
            </div>

            {/* Pagination */}
            {closedQuiz.length > 0 && totalPages > 1 && (
              <div className="flex flex-col items-center gap-2 mt-16">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray200 text-gray400 cursor-not-allowed"
                        : "bg-primary text-white"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1 rounded ${
                          currentPage === i
                            ? "bg-primary text-white"
                            : "bg-gray100 text-black600"
                        }`}
                      >
                        {i}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray200 text-gray400 cursor-not-allowed"
                        : "bg-primary text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ClosedQuiz;

// import { format } from "date-fns";
// import { useEffect, useState } from "react";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import Footer from "../../components/Footer";
// import Header from "../../components/Header";
// import QuizCard from "../../components/QuizCard";
// import SearchInput from "../../components/SearchInput";
// import SortDropdown from "../../components/SortDropdown";

// const ClosedQuiz = () => {
//   const [closedQuiz, setClosedQuiz] = useState([]);
//   const [count, setCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const limit = 8;

//   const sortOptions = [
//     { value: "", label: "All" },
//     { value: "today", label: "Registration Will Close Today" },
//     { value: "tomorrow", label: "Registration Will Close Tomorrow" },
//     { value: "next_3", label: "Registration Will Close Next 3 Days" },
//     { value: "next_7", label: "Registration Will Close Next 7 Days" },
//   ];

//   const fetchClosedQuiz = async (page = 1, query = "", sort = "") => {
//     try {
//       setLoading(true);
//       setErrorMessage("");
//       const offset = (page - 1) * limit;

//       let url = `${API_ENDPOINS.CLOSED_QUIZ}?limit=${limit}&offset=${offset}`;
//       if (query.trim() !== "") url += `&keyword=${encodeURIComponent(query)}`;
//       if (sort) url += `&sort=${sort}`;

//       const response = await API.get(url);

//       if (response?.data?.status === false) {
//         setClosedQuiz([]);
//         setCount(0);
//         setErrorMessage(response?.data?.message || "No results found");
//         return;
//       }

//       console.log("Closed quiz", response.data);

//       setClosedQuiz(response?.data || []);
//       setCount(response?.data?.count || 0);
//     } catch (err) {
//       console.log("Error fetching closed quizzes:", err);
//       setClosedQuiz([]);
//       setCount(0);
//       setErrorMessage("No results found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClosedQuiz(currentPage, searchQuery, sortOption);
//   }, [searchQuery, sortOption, currentPage]);

//   const totalPages = Math.ceil(count / limit);

//   const handlePageChange = (pageNum) => {
//     if (pageNum >= 1 && pageNum <= totalPages) {
//       setCurrentPage(pageNum);
//     }
//   };

//   return (
//     <div>
//       <Header />

//       <div className="container mx-auto px-4 my-10 lg:my-16 xl:my-20">
//         <div className="flex items-center justify-between flex-col md:flex-row mb-4 xl:mb-8 gap-2">
//           <h2 className="text-xl sm:text-2xl xl:text-4xl font-semibold text-black600">
//             Closed Quizzes
//           </h2>

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
//             <div className="w-10 h-10 border-4 border-gray300 border-t-primary rounded-full animate-spin"></div>
//           </div>
//         ) : errorMessage ? (
//           <div className="text-center text-red500 font-semibold mt-10">
//             {errorMessage}
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
//               {closedQuiz.length > 0 ? (
//                 closedQuiz.map((quiz) => (
//                   <QuizCard
//                     key={quiz.id}
//                     image={quiz.announcement_event_image}
//                     title={quiz.announcement_name}
//                     startDate={format(
//                       new Date(quiz.registration_start_date),
//                       "MMM dd, yyyy"
//                     )}
//                     endDate={format(
//                       new Date(quiz.registration_end_date),
//                       "MMM dd, yyyy"
//                     )}
//                     rounds={quiz.round_number}
//                     duration={quiz.total_days}
//                     closedQuiz="Registration Closed"
//                     lp_status={quiz.lp_status}
//                     showCashPrize={quiz.is_pricemoney}
//                     showCertificate={quiz.is_certificate}
//                     termsLink="/terms-and-conditions"
//                     organizer={quiz.organizer_name}
//                   />
//                 ))
//               ) : (
//                 <div className="col-span-full text-center text-red500 font-semibold mt-10">
//                   No quizzes found for "{searchQuery}"
//                 </div>
//               )}
//             </div>

//             {/* Pagination */}
//             {closedQuiz.length > 0 && totalPages > 1 && (
//               <div className="flex flex-col items-center gap-2 mt-16">
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === 1
//                         ? "bg-gray200 text-gray400 cursor-not-allowed"
//                         : "bg-primary text-white"
//                     }`}
//                   >
//                     Previous
//                   </button>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                     (i) => (
//                       <button
//                         key={i}
//                         onClick={() => handlePageChange(i)}
//                         className={`px-3 py-1 rounded ${
//                           currentPage === i
//                             ? "bg-primary text-white"
//                             : "bg-gray100 text-black600"
//                         }`}
//                       >
//                         {i}
//                       </button>
//                     )
//                   )}

//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === totalPages
//                         ? "bg-gray200 text-gray400 cursor-not-allowed"
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
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default ClosedQuiz;

// import { format } from "date-fns";
// import { useEffect, useState } from "react";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import Footer from "../../components/Footer";
// import Header from "../../components/Header";
// import QuizCard from "../../components/QuizCard";
// import SearchInput from "../../components/SearchInput";
// import SortDropdown from "../../components/SortDropdown";

// const ClosedQuiz = () => {
//   const [closedQuiz, setClosedQuiz] = useState([]);
//   const [count, setCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const limit = 8;

//   const sortOptions = [
//     { value: "", label: "All" },
//     { value: "today", label: "Registration Will Close Today" },
//     { value: "tomorrow", label: "Registration Will Close Tomorrow" },
//     { value: "next_3", label: "Registration Will Close Next 3 Days" },
//     { value: "next_7", label: "Registration Will Close Next 7 Days" },
//   ];

//   const fetchClosedQuiz = async (page = 1, query = "", sort = "") => {
//     try {
//       setLoading(true);
//       setErrorMessage("");
//       const offset = (page - 1) * limit;

//       let url = `${API_ENDPOINS.INACTIVE_ANNOUNCEMENT_LIST}?limit=${limit}&offset=${offset}`;
//       if (query.trim() !== "") url += `&keyword=${encodeURIComponent(query)}`;
//       if (sort) url += `&sort=${sort}`;

//       const response = await API.get(url);

//       if (response?.data?.status === false) {
//         setClosedQuiz([]);
//         setCount(0);
//         setErrorMessage(response?.data?.message || "No results found");
//         return;
//       }

//       setClosedQuiz(response?.data?.results?.data || []);
//       setCount(response?.data?.count || 0);
//     } catch (err) {
//       console.log("Error fetching closed quizzes:", err);
//       setErrorMessage("No results found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClosedQuiz(currentPage, searchQuery, sortOption);
//   }, [searchQuery, sortOption, currentPage]);

//   const totalPages = Math.ceil(count / limit);

//   return (
//     <div>
//       <Header />

//       <div className="container mx-auto px-4 my-10 lg:my-16 xl:my-20">
//         <div className="flex items-center justify-center flex-col md:flex-row md:justify-between mb-4 xl:mb-8 gap-2">
//           <h2 className="text-xl sm:text-2xl xl:text-4xl font-semibold text-black600">
//             Closed Quizzes
//           </h2>

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
//             <div className="w-10 h-10 border-4 border-gray300 border-t-primary rounded-full animate-spin"></div>
//           </div>
//         ) : errorMessage ? (
//           <div className="text-center text-red500 font-semibold mt-10">
//             {errorMessage}
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
//               {closedQuiz.map((quiz) => (
//                 <QuizCard
//                   key={quiz.id}
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
//                   closedQuiz="Registration Closed"
//                   lp_status={quiz.lp_status}
//                   showCashPrize={quiz.is_pricemoney}
//                   showCertificate={quiz.is_certificate}
//                   termsLink="/terms-and-conditions"
//                   organizer={quiz.organizer_name}
//                 />
//               ))}
//             </div>

//             {/* Pagination */}
//             {closedQuiz.length > 0 && totalPages > 1 && (
//               <div className="flex flex-col items-center gap-2 mt-16">
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() =>
//                       currentPage > 1 && setCurrentPage(currentPage - 1)
//                     }
//                     disabled={currentPage === 1}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === 1
//                         ? "bg-gray200 text-gray400 cursor-not-allowed"
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
//                             : "bg-gray100 text-black600-400"
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
//                         ? "bg-gray200 text-gray400 cursor-not-allowed"
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
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default ClosedQuiz;
