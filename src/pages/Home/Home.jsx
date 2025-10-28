import { useRef } from "react";
import Header from "../../components/Header";
import HeaderTop from "../../components/HeaderTop";
import Hero from "../../components/hero/Hero";

const Home = () => {
  const announcementRef = useRef(null);

  const handleScrollToAnnouncement = () => {
    if (announcementRef.current) {
      announcementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  return (
    <>
      <div className="bg-body-gradient min-h-screen">
        <HeaderTop onAnnouncementClick={handleScrollToAnnouncement} />
        <Header />
        <Hero onParticipateClick={handleScrollToAnnouncement} />
        {/* <AnnouncementSection ref={announcementRef} /> */}
        {/* <ParticipateGuide /> */}
        {/* <Faq /> */}
        {/* <Feedback /> */}
        {/* <AuthButtons onParticipateClick={handleScrollToAnnouncement} /> */}
        {/* <WhatsAppContact /> */}
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Home;

// import { useEffect, useState } from "react";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import AuthButtons from "../../components/AuthButtons";
// import Footer from "../../components/Footer";
// import Header from "../../components/Header";
// import Hero from "../../components/hero/Hero";
// import QuizCard from "../../components/QuizCard";
// import SearchInput from "../../components/SearchInput";
// import SortDropdown from "../../components/SortDropdown";
// import WhatsAppContact from "../../components/WhatsAppContact";
// import { formatDateTime } from "../../utils/FormateDateTime";
// import Faq from "./Faq";
// import Feedback from "./Feedback";
// import ParticipateGuide from "./ParticipateGuide";

// const Home = () => {
//   const [quizData, setQuizData] = useState([]);
//   const [count, setCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const limit = 8;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOption, setSortOption] = useState("");

//   const fetchQuizData = async (page = 1, query = "", sort = "") => {
//     try {
//       setLoading(true);
//       setErrorMessage("");
//       const offset = (page - 1) * limit;

//       let url = `${API_ENDPOINS.ANNOUNCEMENT_LIST}?limit=${limit}&offset=${offset}`;

//       if (query.trim() !== "") {
//         url += `&keyword=${encodeURIComponent(query)}`;
//       }

//       if (sort) {
//         url += `&sort=${sort}`;
//       }

//       const response = await API.get(url);

//       if (response?.data?.status === false) {
//         setQuizData([]);
//         setCount(0);
//         setErrorMessage(response?.data?.message || "No results found");
//         return;
//       }

//       const results = response?.data?.results?.data || [];
//       setQuizData(results);
//       setCount(response?.data?.count || 0);
//     } catch (err) {
//       console.log(err);
//       setErrorMessage("No results found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuizData(currentPage, searchQuery, sortOption);
//   }, [searchQuery, sortOption, currentPage]);

//   const totalPages = Math.ceil(count / limit);

//   return (
//     <>
//       {/* header */}
//       <Header />
//       <Hero />
//       <section className="bg-gray100 py-10 lg:py-16">
//         <div className="container mx-auto px-4">
//           {/* Search + Sort header */}
//           <div className="flex flex-col md:flex-row md:justify-between mb-4 xl:mb-8 items-center gap-2">
//             <div className="mb-4">
//               <h2 className="text-2xl xl:text-4xl font-bold mb-2">
//                 Live Announcement
//               </h2>
//               <p className="text-base text-gray-600">
//                 Total Announcement:{" "}
//                 <span className="font-semibold">{count}</span>
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <SearchInput value={searchQuery} onChange={setSearchQuery} />
//               <SortDropdown
//                 options={[
//                   { value: "", label: "All" },
//                   { value: "today", label: "Registration Will Close Today" },
//                   {
//                     value: "tomorrow",
//                     label: "Registration Will Close Tomorrow",
//                   },
//                   {
//                     value: "next_3",
//                     label: "Registration Will Close Next 3 Days",
//                   },
//                   {
//                     value: "next_7",
//                     label: "Registration Will Close Next 7 Days",
//                   },
//                 ]}
//                 selected={sortOption}
//                 onChange={setSortOption}
//               />
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-40">
//               <div className="w-10 h-10 border-4 border-gray300 border-t-primary rounded-full animate-spin"></div>
//             </div>
//           ) : (
//             <>
//               {/* error message */}
//               {errorMessage ? (
//                 <div className="text-center text-red500 font-semibold mt-10">
//                   {errorMessage}
//                 </div>
//               ) : (
//                 <>
//                   {/* Cards */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                     {quizData.map(
//                       (quiz) =>
//                         quiz.is_active && (
//                           <QuizCard
//                             key={quiz.id}
//                             quizId={quiz.id}
//                             layout="vertical"
//                             image={quiz.announcement_event_image}
//                             title={quiz.announcement_name}
//                             startDate={formatDateTime(
//                               quiz.registration_start_date
//                             )}
//                             endDate={formatDateTime(quiz.registration_end_date)}
//                             rounds={quiz.round_number}
//                             duration={quiz.total_days}
//                             registrationLink={`/register/${quiz.id}`}
//                             lp_status={quiz.lp_status}
//                             showCashPrize={quiz.is_exciting_price}
//                             showCertificate={quiz.is_certificate}
//                             termsLink={`/terms/${quiz.id}`}
//                             organizer={quiz.organizer_name}
//                           />
//                         )
//                     )}
//                   </div>

//                   {/* Pagination */}
//                   {quizData.length > 0 && totalPages > 1 && (
//                     <div className="flex flex-col items-center gap-2 mt-16">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() =>
//                             currentPage > 1 && setCurrentPage(currentPage - 1)
//                           }
//                           disabled={currentPage === 1}
//                           className={`px-3 py-1 rounded-md ${
//                             currentPage === 1
//                               ? "bg-gray200 text-gray400 cursor-not-allowed"
//                               : "bg-primary text-white"
//                           }`}
//                         >
//                           Previous
//                         </button>

//                         {Array.from(
//                           { length: totalPages },
//                           (_, i) => i + 1
//                         ).map((i) => (
//                           <button
//                             key={i}
//                             onClick={() => setCurrentPage(i)}
//                             className={`px-3 py-1 rounded ${
//                               currentPage === i
//                                 ? "bg-primary text-white"
//                                 : "bg-gray100 text-black600"
//                             }`}
//                           >
//                             {i}
//                           </button>
//                         ))}

//                         <button
//                           onClick={() =>
//                             currentPage < totalPages &&
//                             setCurrentPage(currentPage + 1)
//                           }
//                           disabled={currentPage === totalPages}
//                           className={`px-3 py-1 rounded-md ${
//                             currentPage === totalPages
//                               ? "bg-gray200 text-gray400 cursor-not-allowed"
//                               : "bg-primary text-white"
//                           }`}
//                         >
//                           Next
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       </section>

//       <ParticipateGuide />
//       <Faq />
//       <Feedback />
//       <AuthButtons />
//       <WhatsAppContact />
//       <Footer />
//     </>
//   );
// };

// export default Home;
