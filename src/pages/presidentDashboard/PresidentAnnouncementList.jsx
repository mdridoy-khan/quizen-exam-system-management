import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { GoPlusCircle } from "react-icons/go";
import { LiaEdit } from "react-icons/lia";
import { LuCirclePlus } from "react-icons/lu";
import { TiDocumentText } from "react-icons/ti";
import { Link } from "react-router-dom";
import API from "../../api/API";
import { API_ENDPOINS } from "../../api/ApiEndpoints";
import ErrorImage from "../../assets/error/404.png";
import QuizCard from "../../components/QuizCard";
import { formatDateTime } from "../../utils/FormateDateTime";

const PresidentAnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // Notice Modal
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [currentAnnouncementId, setCurrentAnnouncementId] = useState(null);
  const [noticeText, setNoticeText] = useState("");
  const [noticeList, setNoticeList] = useState([]);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [noticeError, setNoticeError] = useState(null);
  const [editingNoticeId, setEditingNoticeId] = useState(null);

  useEffect(() => {
    fetchAnnouncements(
      `${API_ENDPOINS.GET_ANNOUNCEMENTS}?limit=${limit}&offset=0`
    );
  }, []);

  const fetchAnnouncements = async (url) => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get(url);
      const results = response.data.results?.data || [];
      setAnnouncements(results);
      setCount(response.data.count || 0);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);

      const urlObj = new URL(url, window.location.origin);
      const offset = parseInt(urlObj.searchParams.get("offset")) || 0;
      const pageNumber = Math.floor(offset / limit) + 1;
      setCurrentPage(pageNumber);
      setTotalPages(Math.ceil((response.data.count || 0) / limit));
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load announcements. Please try again.");
      setAnnouncements([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return dateString ? format(parseISO(dateString), "MMM dd, yyyy") : "";
    } catch (err) {
      return "";
    }
  };

  // Notice Modal Functions
  const openNoticeModal = (announcementId) => {
    setCurrentAnnouncementId(announcementId);
    setNoticeModalOpen(true);
    setNoticeText("");
    setEditingNoticeId(null);
    fetchNoticeList(announcementId);
  };

  const fetchNoticeList = async (announcementId) => {
    try {
      setNoticeError(null);
      const response = await API.get(
        `/anc/view-announcement-notice-anc/${announcementId}/`
      );
      setNoticeList(response?.data?.data || []);
    } catch (err) {
      setNoticeError("Failed to fetch notices.");
    }
  };

  const handleCreateNotice = async () => {
    if (!noticeText.trim()) return;
    setNoticeLoading(true);
    try {
      await API.post(
        `/anc/create-announcement-notice-anc/${currentAnnouncementId}/`,
        {
          notice_text: noticeText,
        }
      );
      setNoticeText("");
      fetchNoticeList(currentAnnouncementId);
    } catch (err) {
      setNoticeError("Failed to create notice.");
    } finally {
      setNoticeLoading(false);
    }
  };

  const handleUpdateNotice = async () => {
    if (!noticeText.trim() || !editingNoticeId) return;
    setNoticeLoading(true);
    try {
      await API.put(`/anc/edit-announcement-notice/${editingNoticeId}/`, {
        notice_text: noticeText,
      });
      setNoticeText("");
      setEditingNoticeId(null);
      fetchNoticeList(currentAnnouncementId);
    } catch (err) {
      setNoticeError("Failed to update notice.");
    } finally {
      setNoticeLoading(false);
    }
  };

  return (
    <div className="dashboard_content">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl xl:text-3xl font-bold text-gray800 mb-1">
            Announcement List
          </h2>
          <p className="text-lg text-gray600">
            Total Announcements: {loading ? "..." : count}
          </p>
        </div>

        <Link
          to="/president/announcement-creation-form"
          className="inline-flex items-center gap-2 rounded-lg py-3 px-6 text-white font-semibold
                     bg-gradient-to-r from-gradientStart to-gradientEnd
                     hover:shadow-lg transition-all duration-300 text-sm whitespace-nowrap"
        >
          CREATE ANNOUNCEMENT <LuCirclePlus size={20} />
        </Link>
      </div>

      {/* লোডিং স্টেট */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <FaSpinner className="animate-spin text-6xl text-primary mb-4" />
          <p className="text-gray600">Loading announcements...</p>
        </div>
      )}

      {/* এরর স্টেট */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <img src={ErrorImage} alt="Error" className="w-72" />
          <p className="text-xl font-semibold text-red-600 mb-2">
            No Announcement Found
          </p>
          <p className="text-gray600 mb-6 max-w-md">{error}</p>
          <button
            onClick={() =>
              fetchAnnouncements(
                `${API_ENDPOINS.GET_ANNOUNCEMENTS}?limit=${limit}&offset=0`
              )
            }
            className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* নো ডেটা স্টেট */}
      {!loading && !error && announcements.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <img src={ErrorImage} alt="No announcements" className="w-80" />
          <h3 className="text-2xl font-bold text-gray700 mb-3">
            No Announcements Found
          </h3>
          <p className="text-gray500 max-w-md">
            There are no announcements yet. Click the button above to create
            your first one!
          </p>
        </div>
      )}

      {/* ডেটা থাকলে কার্ড দেখাবে */}
      {!loading && !error && announcements.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-10">
            {announcements.map((ann) => (
              <div key={ann.id}>
                <QuizCard
                  id={ann.id}
                  quizId={ann.id}
                  isActive={ann.is_active}
                  image={ann.announcement_event_image}
                  title={ann.announcement_name}
                  startDate={formatDate(ann.registration_start_date)}
                  endDate={formatDate(ann.registration_end_date)}
                  rounds={ann.round_number}
                  duration={ann.total_days}
                  registrationText={ann.is_reg_open}
                  showCashPrize={ann.is_pricemoney}
                  lp_status={ann.lp_status}
                  showCertificate={ann.is_certificate}
                  termsLink="/terms-and-conditions"
                  organizer={ann.organizer_name}
                  showSwitcher={true}
                  closedQuiz={true}
                />

                <div className="flex items-center gap-2 mt-2">
                  <Link
                    to={`/president/rounds/${ann.id}`}
                    className="flex items-center justify-center gap-1 rounded-lg py-2 px-3 text-white text-[10px] 2xl:text-[12px] font-semibold bg-primary transition-all duration-300 ease-in-out"
                  >
                    VIEW ROUND'S <TiDocumentText size={18} />
                  </Link>

                  {/* ADD NOTICE BUTTON */}
                  <button
                    onClick={() => openNoticeModal(ann.id)}
                    className="flex items-center justify-center gap-1 rounded-lg py-2 px-3 text-white text-[10px] 2xl:text-[12px] font-semibold bg-primary transition-all duration-300 ease-in-out"
                  >
                    ADD NOTICE <GoPlusCircle size={18} />
                  </button>

                  <Link
                    to={`/president/announcement-creation-form/${ann.id}`}
                    className="flex items-center justify-center gap-1 rounded-lg py-2 px-3 text-white text-[10px] 2xl:text-[12px] font-semibold bg-primary transition-all duration-300 ease-in-out"
                  >
                    EDIT <LiaEdit size={18} />
                  </Link>
                </div>

                {/* <div className="flex flex-wrap gap-2 mt-3">
                  <Link
                    to={`/president/rounds/${ann.id}`}
                    className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition"
                  >
                    VIEW ROUNDS <TiDocumentText size={16} />
                  </Link>

                  <button
                    onClick={() => openNoticeModal(ann.id)}
                    className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                  >
                    ADD NOTICE <GoPlusCircle size={16} />
                  </button>

                  <Link
                    to={`/president/announcement-creation-form/${ann.id}`}
                    className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    EDIT <LiaEdit size={16} />
                  </Link>
                </div> */}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center gap-4 mt-16">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => fetchAnnouncements(prevPageUrl)}
                disabled={!prevPageUrl}
                className="px-4 py-2 text-sm rounded-full font-semibold text-white bg-secondary disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Prev
              </button>

              <div className="flex gap-1 flex-wrap justify-center">
                {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  const showLeft = currentPage - 2;
                  const showRight = currentPage + 2;

                  for (let i = 1; i <= totalPages; i++) {
                    if (
                      i === 1 ||
                      i === totalPages ||
                      (i >= showLeft && i <= showRight)
                    ) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() =>
                            fetchAnnouncements(
                              `${
                                API_ENDPOINS.GET_ANNOUNCEMENTS
                              }?limit=${limit}&offset=${(i - 1) * limit}`
                            )
                          }
                          className={`px-4 py-2 text-sm rounded-full font-semibold ${
                            currentPage === i
                              ? "bg-secondary text-white shadow-md scale-105"
                              : "bg-gray200 text-gray700 hover:bg-gray300 hover:text-gray900 shadow-sm"
                          } transition-all duration-300 ease-in-out`}
                        >
                          {i}
                        </button>
                      );
                    } else if (
                      (i === showLeft - 1 && i > 1) ||
                      (i === showRight + 1 && i < totalPages)
                    ) {
                      pages.push(
                        <span
                          key={`ellipsis-${i}`}
                          className="px-2 text-gray400 text-sm select-none"
                        >
                          ...
                        </span>
                      );
                    }
                  }
                  return pages;
                })()}
              </div>

              <button
                onClick={() => fetchAnnouncements(nextPageUrl)}
                disabled={!nextPageUrl}
                className="px-4 py-2 text-sm rounded-full font-semibold text-white bg-secondary disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Notice Modal */}
      {noticeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => {
                setNoticeModalOpen(false);
                setNoticeText("");
                setEditingNoticeId(null);
                setNoticeError(null);
              }}
              className="absolute top-4 right-6 text-3xl text-gray-500 hover:text-gray-800"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {editingNoticeId ? "Edit Notice" : "Add New Notice"}
            </h2>

            <textarea
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              placeholder="Write your notice here..."
              className="w-full border-2 border-gray-300 rounded-lg p-4 mb-4 focus:border-primary outline-none resize-none"
              rows={5}
            />

            <div className="flex justify-end gap-3 mb-6">
              <button
                onClick={() => {
                  setNoticeModalOpen(false);
                  setNoticeText("");
                  setEditingNoticeId(null);
                }}
                className="px-6 py-2.5 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingNoticeId ? handleUpdateNotice : handleCreateNotice
                }
                disabled={noticeLoading || !noticeText.trim()}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-60 transition flex items-center gap-2"
              >
                {noticeLoading
                  ? "Saving..."
                  : editingNoticeId
                  ? "Update Notice"
                  : "Create Notice"}
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-3">Existing Notices</h3>
              {noticeError && (
                <p className="text-red-500 text-sm mb-3">{noticeError}</p>
              )}
              {noticeList.length === 0 ? (
                <p className="text-gray-500 italic">No notices added yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 border">Notice</th>
                        <th className="p-3 border">Created</th>
                        <th className="p-3 border">Updated</th>
                        <th className="p-3 border">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {noticeList.map((notice) => (
                        <tr key={notice.id} className="hover:bg-gray-50">
                          <td className="p-3 border max-w-md">
                            {notice.notice_text}
                          </td>
                          <td className="p-3 border text-xs text-gray-600">
                            {formatDateTime(notice.created_at)}
                          </td>
                          <td className="p-3 border text-xs text-gray-600">
                            {formatDateTime(notice.updated_at)}
                          </td>
                          <td className="p-3 border">
                            <button
                              onClick={() => {
                                setEditingNoticeId(notice.id);
                                setNoticeText(notice.notice_text);
                              }}
                              className="px-3 py-1.5 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresidentAnnouncementList;

// import { format, parseISO } from "date-fns";
// import { useEffect, useState } from "react";
// import { FaSpinner } from "react-icons/fa";
// import { GoPlusCircle } from "react-icons/go";
// import { LiaEdit } from "react-icons/lia";
// import { LuCirclePlus } from "react-icons/lu";
// import { TiDocumentText } from "react-icons/ti";
// import { Link } from "react-router-dom";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import QuizCard from "../../components/QuizCard";
// import { formatDateTime } from "../../utils/FormateDateTime";

// const PresidentAnnouncementList = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // pagination state
//   const [nextPageUrl, setNextPageUrl] = useState(null);
//   const [prevPageUrl, setPrevPageUrl] = useState(null);
//   const [count, setCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const limit = 8;

//   // modal state
//   const [noticeModalOpen, setNoticeModalOpen] = useState(false);
//   const [currentAnnouncementId, setCurrentAnnouncementId] = useState(null);
//   const [noticeText, setNoticeText] = useState("");
//   const [noticeList, setNoticeList] = useState([]);
//   const [noticeLoading, setNoticeLoading] = useState(false);
//   const [noticeError, setNoticeError] = useState(null);
//   const [editingNoticeId, setEditingNoticeId] = useState(null);

//   useEffect(() => {
//     fetchAnnouncements(
//       `${API_ENDPOINS.GET_ANNOUNCEMENTS}?limit=${limit}&offset=0`
//     );
//   }, []);

//   const fetchAnnouncements = async (url) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await API.get(url);
//       const results = response.data.results.data;
//       setAnnouncements(results);

//       setNextPageUrl(response.data.next);
//       setPrevPageUrl(response.data.previous);

//       const totalCount = response.data.count;
//       setCount(totalCount);

//       const urlObj = new URL(url, window.location.origin);
//       const offset = parseInt(urlObj.searchParams.get("offset")) || 0;
//       const pageNumber = Math.floor(offset / limit) + 1;
//       setCurrentPage(pageNumber);

//       setTotalPages(Math.ceil(totalCount / limit));
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       setError("Failed to load announcements.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       return dateString ? format(parseISO(dateString), "MMM dd, yyyy") : "";
//     } catch (err) {
//       console.error("Date format error:", err);
//       return "";
//     }
//   };

//   // ----- NOTICE MODAL FUNCTIONS -----
//   const openNoticeModal = (announcementId) => {
//     setCurrentAnnouncementId(announcementId);
//     setNoticeModalOpen(true);
//     fetchNoticeList(announcementId);
//   };

//   const fetchNoticeList = async (announcementId) => {
//     try {
//       setNoticeError(null);
//       const response = await API.get(
//         `/anc/view-announcement-notice-anc/${announcementId}/`
//       );
//       console.log("notices:", response.data.data);
//       setNoticeList(response?.data?.data);
//     } catch (err) {
//       console.error(err);
//       setNoticeError("Failed to fetch notices.");
//     }
//   };

//   const handleCreateNotice = async () => {
//     if (!noticeText.trim()) return;
//     setNoticeLoading(true);
//     try {
//       await API.post(
//         `/anc/create-announcement-notice-anc/${currentAnnouncementId}/`,
//         { notice_text: noticeText }
//       );
//       setNoticeText("");
//       fetchNoticeList(currentAnnouncementId);
//     } catch (err) {
//       console.error(err);
//       setNoticeError("Failed to create notice.");
//     } finally {
//       setNoticeLoading(false);
//     }
//   };

//   // handle notice update
//   const handleUpdateNotice = async () => {
//     if (!noticeText.trim() || !editingNoticeId) return;
//     setNoticeLoading(true);
//     try {
//       await API.put(`/anc/edit-announcement-notice/${editingNoticeId}/`, {
//         notice_text: noticeText,
//       });
//       setNoticeText("");
//       setEditingNoticeId(null);
//       fetchNoticeList(currentAnnouncementId);
//     } catch (err) {
//       console.error(err);
//       setNoticeError("Failed to update notice.");
//     } finally {
//       setNoticeLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[70vh]">
//         <FaSpinner className="animate-spin text-4xl text-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-[70vh] text-red-500 text-lg">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard_content">
//       <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 md:gap-0">
//         <div className="text-center md:text-left">
//           <h2 className="text-xl xl:text-3xl font-bold flex items-center flex-wrap gap-2 mb-1 text-gray800 !leading-snug">
//             Announcement list
//           </h2>
//           <h3 className="font-semibold text-lg text-gray600">
//             (Total Quiz: {count})
//           </h3>
//         </div>

//         <div>
//           <Link
//             to="/president/announcement-creation-form"
//             className="inline-flex items-center gap-2 rounded-md py-2 px-4 text-white font-semibold
//             bg-gradient-to-r from-gradientStart to-gradientEnd
//             transition-all duration-300 ease-in-out text-sm"
//           >
//             CREATE ANNOUNCEMENT <LuCirclePlus size={18} />
//           </Link>
//         </div>
//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
//         {announcements.map((ann, index) => (
//           <div key={ann.id || index}>
//             <QuizCard
//               id={ann.id}
//               quizId={ann.id}
//               isActive={ann.is_active}
//               image={ann.announcement_event_image}
//               title={ann.announcement_name}
//               startDate={formatDate(ann.registration_start_date)}
//               endDate={formatDate(ann.registration_end_date)}
//               rounds={ann.round_number}
//               duration={ann.total_days}
//               registrationText={ann.is_reg_open}
//               showCashPrize={ann.is_pricemoney}
//               lp_status={ann.lp_status}
//               showCertificate={ann.is_certificate}
//               termsLink="/terms-and-conditions"
//               organizer={ann.organizer_name}
//               showSwitcher={true}
//               closedQuiz={true}
//             />
//             <div className="flex items-center gap-2 mt-2">
//               <Link
//                 to={`/president/rounds/${ann.id}`}
//                 className="flex items-center justify-center gap-1 rounded-lg py-2 px-3 text-white text-[10px] 2xl:text-[12px] font-semibold bg-primary transition-all duration-300 ease-in-out"
//               >
//                 VIEW ROUND'S <TiDocumentText size={18} />
//               </Link>

//               {/* ADD NOTICE BUTTON */}
//               <button
//                 onClick={() => openNoticeModal(ann.id)}
//                 className="flex items-center justify-center gap-1 rounded-lg py-2 px-3 text-white text-[10px] 2xl:text-[12px] font-semibold bg-primary transition-all duration-300 ease-in-out"
//               >
//                 ADD NOTICE <GoPlusCircle size={18} />
//               </button>

//               <Link
//                 to={`/president/announcement-creation-form/${ann.id}`}
//                 className="flex items-center justify-center gap-1 rounded-lg py-2 px-3 text-white text-[10px] 2xl:text-[12px] font-semibold bg-primary transition-all duration-300 ease-in-out"
//               >
//                 EDIT <LiaEdit size={18} />
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* NOTICE MODAL */}
//       {noticeModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-xl w-[90%] md:w-2/3 p-6 xl:p-8 relative">
//             <h2 className="text-xl font-bold mb-4">
//               {editingNoticeId ? "Edit Notice" : "Create Notice"}
//             </h2>
//             <textarea
//               value={noticeText}
//               onChange={(e) => setNoticeText(e.target.value)}
//               placeholder="Enter your notice..."
//               className="w-full border rounded-lg p-2 mb-4 resize-none focus:border-secondary outline-none"
//               rows={4}
//             ></textarea>
//             <div className="flex justify-end gap-2 mb-4">
//               <button
//                 onClick={() => {
//                   setNoticeModalOpen(false);
//                   setNoticeText("");
//                   setEditingNoticeId(null);
//                 }}
//                 className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={
//                   editingNoticeId ? handleUpdateNotice : handleCreateNotice
//                 }
//                 disabled={noticeLoading}
//                 className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary transition"
//               >
//                 {noticeLoading
//                   ? editingNoticeId
//                     ? "Updating..."
//                     : "Creating..."
//                   : editingNoticeId
//                   ? "Update Notice"
//                   : "Create Notice"}
//               </button>
//             </div>

//             {/* Notice Table */}
//             <div className="overflow-x-auto border-t pt-2">
//               <h3 className="font-semibold mb-2">Notice List:</h3>
//               {noticeError && (
//                 <p className="text-red-500 text-sm mb-2">{noticeError}</p>
//               )}
//               {noticeList.length === 0 ? (
//                 <p className="text-gray-500 text-sm">No notices yet.</p>
//               ) : (
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="p-2 border">Notice</th>
//                       <th className="p-2 border">Created At</th>
//                       <th className="p-2 border">Updated At</th>
//                       <th className="p-2 border">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {noticeList.map((notice) => (
//                       <tr key={notice.id} className="border-b last:border-b-0">
//                         <td className="p-2">{notice.notice_text}</td>
//                         <td className="p-2 text-xs text-gray-400">
//                           {formatDateTime(notice.created_at)}
//                         </td>
//                         <td className="p-2 text-xs text-gray-400">
//                           {formatDateTime(notice.updated_at)}
//                         </td>
//                         <td className="p-2">
//                           <button
//                             onClick={() => {
//                               setEditingNoticeId(notice.id);
//                               setNoticeText(notice.notice_text);
//                             }}
//                             className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
//                           >
//                             Edit
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>

//             {/* Close button */}
//             <button
//               onClick={() => {
//                 setNoticeModalOpen(false);
//                 setNoticeText("");
//                 setEditingNoticeId(null);
//               }}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-2xl"
//             >
//               &times;
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Pagination buttons */}
//       <div className="flex flex-col items-center gap-4 mt-16">
//         <div className="flex items-center gap-2 flex-wrap justify-center">
//           <button
//             onClick={() => fetchAnnouncements(prevPageUrl)}
//             disabled={!prevPageUrl}
//             className="px-4 py-2 text-sm rounded-full font-semibold text-white bg-secondary disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
//           >
//             Prev
//           </button>

//           <div className="flex gap-1 flex-wrap justify-center">
//             {(() => {
//               const pages = [];
//               const maxVisible = 5;
//               const showLeft = currentPage - 2;
//               const showRight = currentPage + 2;

//               for (let i = 1; i <= totalPages; i++) {
//                 if (
//                   i === 1 ||
//                   i === totalPages ||
//                   (i >= showLeft && i <= showRight)
//                 ) {
//                   pages.push(
//                     <button
//                       key={i}
//                       onClick={() =>
//                         fetchAnnouncements(
//                           `${
//                             API_ENDPOINS.GET_ANNOUNCEMENTS
//                           }?limit=${limit}&offset=${(i - 1) * limit}`
//                         )
//                       }
//                       className={`px-4 py-2 text-sm rounded-full font-semibold ${
//                         currentPage === i
//                           ? "bg-secondary text-white shadow-md scale-105"
//                           : "bg-gray200 text-gray700 hover:bg-gray300 hover:text-gray900 shadow-sm"
//                       } transition-all duration-300 ease-in-out`}
//                     >
//                       {i}
//                     </button>
//                   );
//                 } else if (
//                   (i === showLeft - 1 && i > 1) ||
//                   (i === showRight + 1 && i < totalPages)
//                 ) {
//                   pages.push(
//                     <span
//                       key={`ellipsis-${i}`}
//                       className="px-2 text-gray400 text-sm select-none"
//                     >
//                       ...
//                     </span>
//                   );
//                 }
//               }
//               return pages;
//             })()}
//           </div>

//           <button
//             onClick={() => fetchAnnouncements(nextPageUrl)}
//             disabled={!nextPageUrl}
//             className="px-4 py-2 text-sm rounded-full font-semibold text-white bg-secondary disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PresidentAnnouncementList;

// import { format, parseISO } from "date-fns";
// import { useEffect, useState } from "react";
// import { FaSpinner } from "react-icons/fa";
// import { GoPlusCircle } from "react-icons/go";
// import { LiaEdit } from "react-icons/lia";
// import { LuCirclePlus } from "react-icons/lu";
// import { TiDocumentText } from "react-icons/ti";
// import { Link } from "react-router-dom";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import QuizCard from "../../components/QuizCard";

// const PresidentAnnouncementList = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // pagination state
//   const [nextPageUrl, setNextPageUrl] = useState(null);
//   const [prevPageUrl, setPrevPageUrl] = useState(null);
//   const [count, setCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const limit = 8;

//   useEffect(() => {
//     fetchAnnouncements(
//       `${API_ENDPOINS.GET_ANNOUNCEMENTS}?limit=${limit}&offset=0`
//     );
//   }, []);

//   const fetchAnnouncements = async (url) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await API.get(url);
//       console.log("Get Announcement Data:", response);

//       const results = response.data.results.data;
//       setAnnouncements(results);

//       setNextPageUrl(response.data.next);
//       setPrevPageUrl(response.data.previous);

//       const totalCount = response.data.count;
//       setCount(totalCount);

//       const urlObj = new URL(url, window.location.origin);
//       const offset = parseInt(urlObj.searchParams.get("offset")) || 0;
//       const pageNumber = Math.floor(offset / limit) + 1;
//       setCurrentPage(pageNumber);

//       setTotalPages(Math.ceil(totalCount / limit));
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       setError("Failed to load announcements.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       return dateString ? format(parseISO(dateString), "MMM dd, yyyy") : "";
//     } catch (err) {
//       console.error("Date format error:", err);
//       return "";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[70vh]">
//         <FaSpinner className="animate-spin text-4xl text-cyan500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-[70vh] text-red500 text-lg">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard_content">
//       <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl p-6 shadow-lg mb-8 gap-4 md:gap-0">
//         <div>
//           <h2 className="text-xl xl:text-3xl font-bold flex items-center flex-wrap gap-2 mb-1 text-gray800 !leading-snug">
//             Announcement list
//           </h2>
//           {/* total quiz */}
//           <h3 className="font-semibold text-lg text-gray600">
//             (Total Quiz: {count})
//           </h3>
//         </div>

//         <div>
//           <Link
//             to="/president/announcement-creation-form"
//             className="inline-flex items-center gap-2 rounded-xl py-2 px-4 text-white font-semibold
//             bg-gradient-to-r from-primary to-secondary
//             transition-all duration-300 ease-in-out text-sm"
//           >
//             CREATE ANNOUNCEMENT <LuCirclePlus size={18} />
//           </Link>
//         </div>
//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
//         {announcements.map((ann, index) => (
//           <div key={ann.id || index}>
//             <QuizCard
//               id={ann.id}
//               quizId={ann.id}
//               isActive={ann.is_active}
//               image={ann.announcement_event_image}
//               title={ann.announcement_name}
//               startDate={formatDate(ann.registration_start_date)}
//               endDate={formatDate(ann.registration_end_date)}
//               rounds={ann.round_number}
//               duration={ann.total_days}
//               registrationText={ann.is_reg_open}
//               showCashPrize={ann.is_pricemoney}
//               showCertificate={ann.is_certificate}
//               termsLink="/terms-and-conditions"
//               organizer={ann.organizer_name}
//               showSwitcher={true}
//             />
//             <div className="flex items-center gap-2 mt-2">
//               <Link
//                 to={`/president/rounds/${ann.id}`}
//                 className="flex items-center justify-center gap-1 rounded-lg py-2 px-4 text-white text-[10px] sm:text-[12px] font-semibold
//                 bg-primary
//       transition-all duration-300 ease-in-out"
//               >
//                 VIEW ROUND'S <TiDocumentText size={18} />
//               </Link>

//               <Link
//                 to={`/president/add-notice/${ann.id}`}
//                 className="flex items-center justify-center gap-1 rounded-lg py-2 px-4 text-white text-[10px] sm:text-[12px] font-semibold
//                 bg-primary
//       transition-all duration-300 ease-in-out"
//               >
//                 ADD NOTICE <GoPlusCircle size={18} />
//               </Link>

//               <Link
//                 to={`/president/announcement-creation-form/${ann.id}`}
//                 className="flex items-center justify-center gap-1 rounded-lg py-2 px-4 text-white text-[10px] sm:text-[12px] font-semibold
//                 bg-primary
//       transition-all duration-300 ease-in-out"
//               >
//                 EDIT <LiaEdit size={18} />
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination buttons */}
//       <div className="flex flex-col items-center gap-4 mt-16">
//         <div className="flex items-center gap-2 flex-wrap justify-center">
//           {/* Prev Button */}
//           <button
//             onClick={() => fetchAnnouncements(prevPageUrl)}
//             disabled={!prevPageUrl}
//             className="px-4 py-2 rounded-xl font-semibold text-white
//         bg-gradient-to-r from-primary to-secondary
//         disabled:opacity-50 disabled:cursor-not-allowed
//         shadow-sm hover:shadow-md hover:scale-105
//         transition-all duration-300 ease-in-out"
//           >
//             Prev
//           </button>

//           {/* Page number buttons with ellipsis */}
//           <div className="flex gap-1 flex-wrap justify-center">
//             {(() => {
//               const pages = [];
//               const maxVisible = 5;
//               const showLeft = currentPage - 2;
//               const showRight = currentPage + 2;

//               for (let i = 1; i <= totalPages; i++) {
//                 if (
//                   i === 1 ||
//                   i === totalPages ||
//                   (i >= showLeft && i <= showRight)
//                 ) {
//                   pages.push(
//                     <button
//                       key={i}
//                       onClick={() =>
//                         fetchAnnouncements(
//                           `${
//                             API_ENDPOINS.GET_ANNOUNCEMENTS
//                           }?limit=${limit}&offset=${(i - 1) * limit}`
//                         )
//                       }
//                       className={`px-4 py-2 rounded-xl font-semibold text-sm
//                   ${
//                     currentPage === i
//                       ? "bg-primary text-white shadow-md scale-105"
//                       : "bg-gray200 text-gray700 hover:bg-gray300 hover:text-gray900 shadow-sm"
//                   }
//                   transition-all duration-300 ease-in-out`}
//                     >
//                       {i}
//                     </button>
//                   );
//                 } else if (
//                   (i === showLeft - 1 && i > 1) ||
//                   (i === showRight + 1 && i < totalPages)
//                 ) {
//                   // ellipsis
//                   pages.push(
//                     <span
//                       key={`ellipsis-${i}`}
//                       className="px-2 text-gray400 text-sm select-none"
//                     >
//                       ...
//                     </span>
//                   );
//                 }
//               }
//               return pages;
//             })()}
//           </div>

//           {/* Next Button */}
//           <button
//             onClick={() => fetchAnnouncements(nextPageUrl)}
//             disabled={!nextPageUrl}
//             className="px-4 py-2 rounded-xl font-semibold text-white
//         bg-gradient-to-r from-primary to-secondary
//         disabled:opacity-50 disabled:cursor-not-allowed
//         shadow-sm hover:shadow-md hover:scale-105
//         transition-all duration-300 ease-in-out"
//           >
//             Next
//           </button>
//         </div>

//         {/* Info text */}
//         {/* <span className="font-semibold text-gray600 text-sm mt-2">
//           Page {currentPage} of {totalPages} (Total: {count})
//         </span> */}
//       </div>
//     </div>
//   );
// };

// export default PresidentAnnouncementList;

// import { format, parseISO } from "date-fns";
// import { useEffect, useState } from "react";
// import { GoPlusCircle } from "react-icons/go";
// import { LiaEdit } from "react-icons/lia";
// import { LuCirclePlus } from "react-icons/lu";
// import { TiDocumentText } from "react-icons/ti";
// import { Link } from "react-router-dom";
// import API from "../../api/API";
// import { API_ENDPOINS } from "../../api/ApiEndpoints";
// import QuizCard from "../../components/QuizCard";

// const PresidentAnnouncementList = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // pagination state
//   const [nextPageUrl, setNextPageUrl] = useState(null);
//   const [prevPageUrl, setPrevPageUrl] = useState(null);
//   const [count, setCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const limit = 8;

//   useEffect(() => {
//     fetchAnnouncements(
//       `${API_ENDPOINS.GET_ANNOUNCEMENTS}?limit=${limit}&offset=0`
//     );
//   }, []);

//   const fetchAnnouncements = async (url) => {
//     try {
//       setLoading(true);
//       const response = await API.get(url);
//       console.log("Get Announcement Data:", response);

//       const results = response.data.results.data;
//       setAnnouncements(results);

//       setNextPageUrl(response.data.next);
//       setPrevPageUrl(response.data.previous);

//       const totalCount = response.data.count;
//       setCount(totalCount);

//       const urlObj = new URL(url, window.location.origin);
//       const offset = parseInt(urlObj.searchParams.get("offset")) || 0;
//       const pageNumber = Math.floor(offset / limit) + 1;
//       setCurrentPage(pageNumber);

//       setTotalPages(Math.ceil(totalCount / limit));

//       setLoading(false);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       setError("Failed to load announcements.");
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       return dateString ? format(parseISO(dateString), "MMM dd, yyyy") : "";
//     } catch (err) {
//       console.error("Date format error:", err);
//       return "";
//     }
//   };

//   if (loading) {
//     return <div className="text-center mt-10">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red500 mt-10">{error}</div>;
//   }

//   return (
//     <div className="dashboard_content">
//       <h2 className="text-2xl xl:text-4xl font-bold lg:mb-8 flex items-center flex-wrap gap-2 mb-6 !leading-none">
//         Announcement list
//         <Link
//           to="/president/announcement-creation-form"
//           className="inline-flex items-center text-[12px] font-bold bg-[var(cyan500)] leading-none py-1 px-3 rounded-md gap-2 text-[var(--white)] mt-2"
//         >
//           CREATE ANNOUNCEMENT <LuCirclePlus size={18} color="#ffffff" />
//         </Link>
//       </h2>
//       {/* total quiz */}
//       <h3 className="font-semibold text-xl mb-6">(Total Quiz: {count})</h3>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
//         {announcements.map((ann, index) => (
//           <div key={ann.id || index}>
//             <QuizCard
//               id={ann.id}
//               quizId={ann.id}
//               isActive={ann.is_active}
//               image={ann.announcement_event_image}
//               title={ann.announcement_name}
//               startDate={formatDate(ann.registration_start_date)}
//               endDate={formatDate(ann.registration_end_date)}
//               rounds={ann.round_number}
//               duration={ann.total_days}
//               registrationText={ann.is_reg_open}
//               showCashPrize={ann.is_pricemoney}
//               showCertificate={ann.is_certificate}
//               termsLink="/terms-and-conditions"
//               organizer={ann.organizer_name}
//               showSwitcher={true}
//             />
//             <div className="flex items-center gap-1 mt-2">
//               <Link
//                 to={`/president/rounds/${ann.id}`}
//                 className="flex items-center justify-center gap-1 bg-[var(cyan600)] rounded-lg py-2 px-3 text-[var(--white)] text-[10px] sm:text-[12px] font-semibold"
//               >
//                 VIEW ROUND'S <TiDocumentText size={18} />
//               </Link>
//               <Link
//                 to={`/president/add-notice/${ann.id}`}
//                 className="flex items-center justify-center gap-1 bg-[var(cyan600)] rounded-lg py-2 px-3 text-[var(--white)] text-[10px] sm:text-[12px] font-semibold"
//               >
//                 ADD NOTICE <GoPlusCircle size={18} />
//               </Link>
//               <Link
//                 to={`/president/announcement-creation-form/${ann.id}`}
//                 className="flex items-center justify-center gap-1 bg-[var(cyan600)] rounded-lg py-2 px-3 text-[var(--white)] text-[10px] sm:text-[12px] font-semibold"
//               >
//                 EDIT <LiaEdit size={18} />
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination buttons */}
//       <div className="flex flex-col items-center gap-4 mt-16">
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => fetchAnnouncements(prevPageUrl)}
//             disabled={!prevPageUrl}
//             className="px-3 py-1 bg-[var(primary)] text-white rounded disabled:opacity-50"
//           >
//             Prev
//           </button>

//           {/* Page number buttons with ellipsis */}
//           <div className="flex gap-1">
//             {(() => {
//               const pages = [];
//               const maxVisible = 5;
//               const showLeft = currentPage - 2;
//               const showRight = currentPage + 2;

//               for (let i = 1; i <= totalPages; i++) {
//                 if (
//                   i === 1 ||
//                   i === totalPages ||
//                   (i >= showLeft && i <= showRight)
//                 ) {
//                   pages.push(
//                     <button
//                       key={i}
//                       onClick={() =>
//                         fetchAnnouncements(
//                           `${
//                             API_ENDPOINS.GET_ANNOUNCEMENTS
//                           }?limit=${limit}&offset=${(i - 1) * limit}`
//                         )
//                       }
//                       className={`px-3 py-1 rounded ${
//                         currentPage === i
//                           ? "bg-[var(cyan600)] text-white"
//                           : "bg-[var(gray300)] text-white"
//                       }`}
//                     >
//                       {i}
//                     </button>
//                   );
//                 } else if (
//                   (i === showLeft - 1 && i > 1) ||
//                   (i === showRight + 1 && i < totalPages)
//                 ) {
//                   // ellipsis add
//                   pages.push(
//                     <span key={`ellipsis-${i}`} className="px-2">
//                       ...
//                     </span>
//                   );
//                 }
//               }
//               return pages;
//             })()}
//           </div>

//           <button
//             onClick={() => fetchAnnouncements(nextPageUrl)}
//             disabled={!nextPageUrl}
//             className="px-3 py-1 bg-[var(primary)] text-white rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>

//         {/* Info text */}
//         <span className="font-semibold">
//           Page {currentPage} of {totalPages} (Total: {count})
//         </span>
//       </div>
//     </div>
//   );
// };

// export default PresidentAnnouncementList;
