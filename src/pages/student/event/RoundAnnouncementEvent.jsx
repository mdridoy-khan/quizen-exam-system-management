import { useCallback, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { TbExclamationCircle } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/API";
import CountdownTimer from "../../../components/CountdownTimer";
import { formatDateTime } from "../../../utils/FormateDateTime";
import ParticipateModal from "../roundAnnouncement/ParticipateModal";
import QuizParticipateAlert from "../roundAnnouncement/QuizParticipateAlert";
import StudentParticipateEventRounds from "./StudentParticipateEventRounds";

const RoundAnnouncementEvent = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [annRound, setAnnRound] = useState(null);
  const [noticeData, setNoticeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  // For enabling participate button after countdown
  const [activeRounds, setActiveRounds] = useState(new Set());

  // Quiz Set Selection (Inline)
  const [selectedRoundForSets, setSelectedRoundForSets] = useState(null); // { roundId, roundName }
  const [quizSets, setQuizSets] = useState([]);
  const [loadingSets, setLoadingSets] = useState(false);

  // Final participation flow
  const [selectedSet, setSelectedSet] = useState(null);
  const [showParticipateModal, setShowParticipateModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Fetch main data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [roundRes, noticeRes] = await Promise.all([
          API.get(`/anc/student-announcement-round-list-anc/${quizId}`),
          API.get(`/anc/view-announcement-notice-anc/${quizId}/`).catch(() => ({
            data: { data: [], status: false },
          })),
        ]);

        setAnnRound(roundRes.data);
        if (noticeRes.data.status && noticeRes.data.data.length > 0) {
          setNoticeData(noticeRes.data.data);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load event data.");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) fetchData();
  }, [quizId]);

  // Countdown complete → enable button + update status
  const handleCountdownComplete = useCallback((roundId) => {
    setActiveRounds((prev) => new Set(prev).add(roundId));
    setAnnRound((prev) => {
      if (!prev?.data) return prev;
      return {
        ...prev,
        data: prev.data.map((r) =>
          r.id === roundId ? { ...r, round_status: "active" } : r
        ),
      };
    });
  }, []);

  // Load Quiz Sets for a round (inline)
  const loadQuizSets = async (roundId, roundName) => {
    if (selectedRoundForSets?.roundId === roundId) {
      setSelectedRoundForSets(null);
      setQuizSets([]);
      return;
    }

    setLoadingSets(true);
    setSelectedRoundForSets({ roundId, roundName });
    setQuizSets([]);

    try {
      const res = await API.get(
        `/qzz/view-event-quiz-set/anc/${quizId}/round/${roundId}/`
      );
      setQuizSets(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load quiz sets. Please try again.");
      setSelectedRoundForSets(null);
    } finally {
      setLoadingSets(false);
    }
  };

  // Select a set → open confirmation modal
  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setShowParticipateModal(true);
  };

  const handleConfirmParticipate = () => {
    setShowParticipateModal(false);
    setShowAlert(true);
  };

  const handleStartQuiz = () => {
    setShowAlert(false);
    navigate(
      `/quiz/${quizId}/round/${selectedRoundForSets.roundId}/set/${selectedSet.id}`
    );
  };

  const isRoundActive = (round) => {
    return round.round_status === "active" || activeRounds.has(round.id);
  };

  return (
    <div className="relative px-4 py-6 max-w-7xl mx-auto">
      {/* Notice */}
      {!noticeDismissed && noticeData.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl mb-6 relative">
          <button
            onClick={() => setNoticeDismissed(true)}
            className="absolute top-4 right-4"
          >
            <RxCross2 size={22} className="text-gray-600 hover:text-gray-800" />
          </button>
          <div className="space-y-3">
            {noticeData.map((item) => (
              <div key={item.id}>
                <div className="flex items-center gap-2 mb-2">
                  <TbExclamationCircle size={24} className="text-orange-600" />
                  <span className="font-bold text-orange-800">
                    Important Notice
                  </span>
                </div>
                <p className="text-gray-800 font-medium pl-8">
                  {item.notice_text}
                </p>
                <p className="text-xs text-gray-500 pl-8">
                  Updated: {formatDateTime(item.updated_at)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading & Error */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 py-8 font-medium">{error}</div>
      )}

      {/* Banner */}
      {!loading && !error && annRound && (
        <div
          className="relative rounded-2xl h-64 mb-10 overflow-hidden shadow-lg"
          style={{
            backgroundImage: `url(${annRound.announcement_info.announcement_banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-2xl font-bold">
              {annRound.announcement_info.announcement_name}
            </h1>
          </div>
        </div>
      )}

      {/* Rounds Grid */}
      {!loading && !error && annRound?.data?.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {annRound.data.map((round) => (
            <div key={round.id} className="space-y-3">
              {/* Round Header */}
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-black">
                  {round.round_name}
                </h3>
                <div className="flex items-center justify-center">
                  <div className="bg-primary text-white py-[2px] px-3 text-base font-semibold rounded-md">
                    {round.round_status === "upcoming" ? (
                      <CountdownTimer
                        targetDate={round.quiz_start_date}
                        onComplete={() => handleCountdownComplete(round.id)}
                      />
                    ) : (
                      <p className="bg-primary text-white py-[2px] px-2 text-base font-semibold rounded-md ">
                        {round.round_status}
                      </p>
                    )}
                    {/* <CountdownTimer
                        targetDate={round.quiz_start_date}
                        onComplete={() => handleCountdownComplete(round.id)}
                      /> */}
                  </div>
                </div>
              </div>

              {/* Round Card */}
              <StudentParticipateEventRounds
                round={round.id}
                quizId={quizId}
                round_status={round.round_status}
                is_participated={round.is_participated}
                image={round.round_image}
                title={round.announcement_name}
                subject={round.topic_subject}
                exam_type={round.exam_type}
                start_date={round.quiz_start_date}
                end_Date={round.quiz_end_date}
                next_round_qualifier={round.next_round_qualifier}
                total_question={round.total_questions}
                duration={round.duration}
                isParticipateEnabled={isRoundActive(round)}
                onParticipate={(roundId) =>
                  loadQuizSets(roundId, round.round_name)
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Inline Quiz Set Selection */}
      {selectedRoundForSets && (
        <div className="mt-6 lg:mt-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-xl relative overflow-hidden">
            {/* Soft Gradient Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF247410] via-[#261E6910] to-transparent pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-[#261E69] tracking-tight">
                Select Quiz Set – {selectedRoundForSets.roundName}
              </h3>

              <button
                onClick={() => {
                  setSelectedRoundForSets(null);
                  setQuizSets([]);
                }}
                className="text-[#FF2474] hover:text-[#ff005c] font-semibold flex items-center gap-1 transition-colors"
              >
                <RxCross2 size={22} />
                Close
              </button>
            </div>

            {loadingSets ? (
              <div className="text-center py-16">
                <div className="inline-block w-12 h-12 border-4 border-[#FF2474] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 text-lg">
                  Loading quiz sets...
                </p>
              </div>
            ) : quizSets.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                <p className="text-gray-600 text-lg">
                  No quiz sets available for this round.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                {quizSets.map((set) => (
                  <div
                    key={set.id}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100  transition-all hover:scale-[1.02] hover:border-[#FF2474]"
                  >
                    <h4 className="text-lg font-semibold text-[#261E69] mb-2">
                      Subject: {set.subject || "N/A"}
                    </h4>

                    <div className="space-y-1 text-sm text-gray-700">
                      <p>
                        <strong>Questions:</strong> {set.total_questions}
                      </p>
                      <p>
                        <strong>Total Marks:</strong> {set.total_marks}
                      </p>
                      <p>
                        <strong>Per Question:</strong> {set.marks_per_question}
                      </p>

                      {set.negative_marks_per_question !== "0.00" && (
                        <p className="text-[#FF2474] font-semibold">
                          Negative: -{set.negative_marks_per_question}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleSelectSet(set)}
                      className="mt-3 w-full bg-gradient-to-r from-[#FF2474] to-[#261E69] hover:from-[#ff005c] hover:to-[#1a1655] text-white font-medium py-1.5 rounded-full transition"
                    >
                      Participate Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Final Modals */}
      {showParticipateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <ParticipateModal
            onConfirm={handleConfirmParticipate}
            onCancel={() => setShowParticipateModal(false)}
          />
        </div>
      )}

      {showAlert && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <QuizParticipateAlert
            onClose={() => setShowAlert(false)}
            onContinue={handleStartQuiz}
          />
        </div>
      )}
    </div>
  );
};

export default RoundAnnouncementEvent;

// import { useEffect, useState } from "react";
// import { RxCross2 } from "react-icons/rx";
// import { TbExclamationCircle } from "react-icons/tb";
// import { useNavigate, useParams } from "react-router-dom";
// import API from "../../../api/API";
// import CountdownTimer from "../../../components/CountdownTimer";
// import { formatDateTime } from "../../../utils/FormateDateTime";
// import ParticipateModal from "../roundAnnouncement/ParticipateModal";
// import QuizParticipateAlert from "../roundAnnouncement/QuizParticipateAlert";
// import StudentParticipateEventRounds from "./StudentParticipateEventRounds";
// // import StudentParticipateRound from "../roundAnnouncement/StudentParticipateRound";

// const RoundAnnouncementEvent = () => {
//   const [isParticipateModalOpen, setIsParticipateModalOpen] = useState(false);
//   const [isQuizAlertOpen, setIsQuizAlertOpen] = useState(false);
//   const [selectedRound, setSelectedRound] = useState(null);
//   const [annRound, setAnnRound] = useState(null);
//   const [enabledButtons, setEnabledButtons] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState(true);
//   const navigate = useNavigate();
//   const [noticeData, setNoticeData] = useState([]);
//   const { quizId } = useParams();

//   // get announcement data
//   // useEffect(() => {
//   //   const getAnnouncement = async () => {
//   //     try {
//   //       const response = await API.get(
//   //         `/anc/student-announcement-reg-list/${quizId}`
//   //       );
//   //       console.log("getAnnouncement:", response);
//   //     } catch (err) {
//   //       console.error(err);
//   //     }
//   //   };
//   //   getAnnouncement();
//   // }, [quizId]);

//   // get round data
//   useEffect(() => {
//     const getRound = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const response = await API.get(
//           `/anc/student-announcement-round-list-anc/${quizId}`
//         );
//         setAnnRound(response?.data);
//       } catch (err) {
//         const message =
//           err?.response?.data?.message ||
//           err?.response?.data?.error ||
//           "Something went wrong while fetching round data.";
//         setError(message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getRound();
//   }, [quizId]);

//   // get event question set
//   // useEffect(() => {
//   //   const getEventQuestions = async () => {
//   //     try{
//   //       const response = await API.get(`qzz/view-event-quiz-set/anc/${quizId}/round/114/`)
//   //     }
//   //   }
//   // }, [])

//   // handle countdown timer
//   const handleCountdownComplete = (roundId) => {
//     setEnabledButtons((prev) => ({ ...prev, [roundId]: true }));
//     setAnnRound((prev) => {
//       if (!prev) return prev;
//       const next = { ...prev };
//       if (Array.isArray(next.data)) {
//         next.data = next.data.map((r) => {
//           // Only change to active if round was previously upcoming
//           if (r.id === roundId && r.round_status === "upcoming") {
//             return { ...r, round_status: "active" };
//           }
//           return r;
//         });
//       }
//       return next;
//     });
//   };

//   // fetch notice data
//   useEffect(() => {
//     const getNotice = async () => {
//       setLoading(true);
//       try {
//         const response = await API.get(
//           `/anc/view-announcement-notice-anc/${quizId}/`
//         );
//         console.log("get notice response:", response.data);

//         if (response.data.status) {
//           setNoticeData(response.data.data);
//         }
//       } catch (err) {
//         console.error("Error fetching notice:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (quizId) getNotice();
//   }, [quizId]);

//   // const handleCountdownComplete = (roundId) => {
//   //   setEnabledButtons((prev) => ({ ...prev, [roundId]: true }));
//   //   setAnnRound((prev) => {
//   //     if (!prev) return prev;
//   //     const next = { ...prev };
//   //     if (Array.isArray(next.data)) {
//   //       next.data = next.data.map((r) =>
//   //         r.id === roundId ? { ...r, round_status: "active" } : r
//   //       );
//   //     }
//   //     return next;
//   //   });
//   // };

//   const handleParticipateClick = (round) => {
//     setSelectedRound(round);
//     setIsParticipateModalOpen(true);
//   };

//   const handleConfirm = () => {
//     setIsParticipateModalOpen(false);
//     setIsQuizAlertOpen(true);
//   };

//   const handleCancel = () => {
//     setIsParticipateModalOpen(false);
//     setSelectedRound(null);
//   };

//   const handleAlertClose = () => {
//     setIsQuizAlertOpen(false);
//     setSelectedRound(null);
//   };

//   const handleAlertContinue = () => {
//     setIsQuizAlertOpen(false);
//     navigate(`/quiz/${selectedRound}`);
//   };

//   // hanle notice popup
//   const handleNotice = () => {
//     setNotice(false);
//   };

//   return (
//     <div className="relative px-2">
//       {/* Modal Overlay for ParticipateModal */}
//       {isParticipateModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
//           <ParticipateModal onConfirm={handleConfirm} onCancel={handleCancel} />
//         </div>
//       )}

//       {/* Modal Overlay for QuizParticipateAlert */}
//       {isQuizAlertOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
//           <QuizParticipateAlert
//             onClose={handleAlertClose}
//             onContinue={handleAlertContinue}
//           />
//         </div>
//       )}

//       {/* Notice message */}
//       {notice && (
//         <div className="bg-orange-50 p-4 rounded-xl">
//           <div className="text-sm font-medium">
//             <div className="space-y-3">
//               {loading ? (
//                 // Loading state
//                 <div className="flex items-center justify-center py-6">
//                   <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
//                   <span className="ml-2 text-gray-600 font-medium">
//                     Loading notices...
//                   </span>
//                 </div>
//               ) : noticeData.length > 0 ? (
//                 // Data found
//                 noticeData.map((item) => (
//                   <div key={item.id}>
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-base font-medium mb-1 flex items-center gap-2">
//                         <TbExclamationCircle
//                           size={24}
//                           style={{ color: "primary" }}
//                         />
//                         Notice:
//                       </span>
//                       <button onClick={handleNotice}>
//                         <RxCross2 size={20} />
//                       </button>
//                     </div>
//                     <div>
//                       <p className="text-gray-800 font-medium">
//                         {item.notice_text}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         Last Update: {formatDateTime(item.updated_at)}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 // No data
//                 <p className="text-gray-500 text-center py-4">
//                   No announcement notices found.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Loader */}
//       {loading && (
//         <div className="flex justify-center items-center mt-6">
//           <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
//         </div>
//       )}

//       {/* Error message */}
//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 mt-4 rounded-lg text-center">
//           {error}
//         </div>
//       )}

//       {/* Banner */}
//       {!loading && !error && annRound ? (
//         <div
//           className="relative rounded-xl min-h-60 mt-2 overflow-hidden"
//           style={{
//             backgroundImage: `url(${annRound?.announcement_info?.announcement_banner})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         >
//           <div className="absolute inset-0 bg-black bg-opacity-50"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <h2 className="text-white text-4xl font-bold text-center">
//               {annRound?.announcement_info?.announcement_name}
//             </h2>
//           </div>
//         </div>
//       ) : null}

//       {/* Rounds card */}
//       {!loading && !error && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-8 gap-14 lg:gap-4">
//           {annRound?.data?.length > 0 ? (
//             annRound.data.map((round) => (
//               <div key={round.id}>
//                 <div className="flex items-center gap-2 mb-2">
//                   <h3 className="text-xl font-semibold text-black">
//                     {round.round_name}
//                   </h3>
//                   <div className="flex items-center justify-center">
//                     <div className="bg-primary text-white py-[2px] px-3 text-base font-semibold rounded-md">
//                       {round.round_status === "upcoming" ? (
//                         <CountdownTimer
//                           targetDate={round.quiz_start_date}
//                           onComplete={() => handleCountdownComplete(round.id)}
//                         />
//                       ) : (
//                         <p className="bg-primary text-white py-[2px] px-2 text-base font-semibold rounded-md ">
//                           {round.round_status}
//                         </p>
//                       )}
//                       {/* <CountdownTimer
//                         targetDate={round.quiz_start_date}
//                         onComplete={() => handleCountdownComplete(round.id)}
//                       /> */}
//                     </div>
//                   </div>
//                 </div>
//                 <StudentParticipateEventRounds
//                   layout="vertical"
//                   round={round.id}
//                   quizId={quizId}
//                   round_status={round.round_status}
//                   image={round.round_image}
//                   title={round.announcement_name}
//                   subject={round.topic_subject}
//                   exam_type={round.exam_type}
//                   start_date={round.quiz_start_date}
//                   end_Date={round.quiz_end_date}
//                   next_round_qualifier={round.next_round_qualifier}
//                   total_question={round.total_questions}
//                   duration={round.duration}
//                   is_participated={round.is_participated}
//                   onParticipate={() =>
//                     handleParticipateClick(
//                       round.toLowerCase?.().replace(" ", "-")
//                     )
//                   }
//                   isParticipateEnabled={!!enabledButtons[round.id]}
//                 />
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-red-500">No Round Available Now</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RoundAnnouncementEvent;

// import { useEffect, useState } from "react";
// import { RxCross2 } from "react-icons/rx";
// import { TbExclamationCircle } from "react-icons/tb";
// import { useNavigate, useParams } from "react-router-dom";
// import API from "../../../api/API";
// import CountdownTimer from "../../../components/CountdownTimer";
// import ParticipateModal from "./ParticipateModal";
// import QuizParticipateAlert from "./QuizParticipateAlert";
// import StudentParticipateRound from "./StudentParticipateRound";

// const RoundAnnouncementEvent = () => {
//   const [isParticipateModalOpen, setIsParticipateModalOpen] = useState(false);
//   const [isQuizAlertOpen, setIsQuizAlertOpen] = useState(false);
//   const [selectedRound, setSelectedRound] = useState(null);
//   const [annRound, setAnnRound] = useState(null);
//   const [enabledButtons, setEnabledButtons] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState(true);
//   const navigate = useNavigate();
//   const { quizId } = useParams();

//   // get announcement data
//   // useEffect(() => {
//   //   const getAnnouncement = async () => {
//   //     try {
//   //       const response = await API.get(
//   //         `/anc/student-announcement-reg-list/${quizId}`
//   //       );
//   //       console.log("getAnnouncement:", response);
//   //     } catch (err) {
//   //       console.error(err);
//   //     }
//   //   };
//   //   getAnnouncement();
//   // }, [quizId]);

//   // get round data
//   useEffect(() => {
//     const getRound = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const response = await API.get(
//           `/anc/student-announcement-round-list-anc/${quizId}`
//         );
//         setAnnRound(response?.data);
//       } catch (err) {
//         const message =
//           err?.response?.data?.message ||
//           err?.response?.data?.error ||
//           "Something went wrong while fetching round data.";
//         setError(message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getRound();
//   }, [quizId]);

//   // handle countdown timer
//   const handleCountdownComplete = (roundId) => {
//     setEnabledButtons((prev) => ({ ...prev, [roundId]: true }));
//     setAnnRound((prev) => {
//       if (!prev) return prev;
//       const next = { ...prev };
//       if (Array.isArray(next.data)) {
//         next.data = next.data.map((r) => {
//           // Only change to active if round was previously upcoming
//           if (r.id === roundId && r.round_status === "upcoming") {
//             return { ...r, round_status: "active" };
//           }
//           return r;
//         });
//       }
//       return next;
//     });
//   };

//   // const handleCountdownComplete = (roundId) => {
//   //   setEnabledButtons((prev) => ({ ...prev, [roundId]: true }));
//   //   setAnnRound((prev) => {
//   //     if (!prev) return prev;
//   //     const next = { ...prev };
//   //     if (Array.isArray(next.data)) {
//   //       next.data = next.data.map((r) =>
//   //         r.id === roundId ? { ...r, round_status: "active" } : r
//   //       );
//   //     }
//   //     return next;
//   //   });
//   // };

//   const handleParticipateClick = (round) => {
//     setSelectedRound(round);
//     setIsParticipateModalOpen(true);
//   };

//   const handleConfirm = () => {
//     setIsParticipateModalOpen(false);
//     setIsQuizAlertOpen(true);
//   };

//   const handleCancel = () => {
//     setIsParticipateModalOpen(false);
//     setSelectedRound(null);
//   };

//   const handleAlertClose = () => {
//     setIsQuizAlertOpen(false);
//     setSelectedRound(null);
//   };

//   const handleAlertContinue = () => {
//     setIsQuizAlertOpen(false);
//     navigate(`/quiz/${selectedRound}`);
//   };

//   // hanle notice popup
//   const handleNotice = () => {
//     setNotice(false);
//   };

//   return (
//     <div className="relative px-2">
//       {/* Modal Overlay for ParticipateModal */}
//       {isParticipateModalOpen && (
//         <div className="fixed inset-0 bg-black600 bg-opacity-50 z-40 flex items-center justify-center">
//           <ParticipateModal onConfirm={handleConfirm} onCancel={handleCancel} />
//         </div>
//       )}

//       {/* Modal Overlay for QuizParticipateAlert */}
//       {isQuizAlertOpen && (
//         <div className="fixed inset-0 bg-black600 bg-opacity-50 z-40 flex items-center justify-center">
//           <QuizParticipateAlert
//             onClose={handleAlertClose}
//             onContinue={handleAlertContinue}
//           />
//         </div>
//       )}

//       {/* Notice message */}
//       {notice && (
//         <div className="bg-orange200 p-4 rounded-xl">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-base font-medium mb-1 flex items-center gap-2">
//               <TbExclamationCircle size={24} style={{ color: "primary" }} />
//               Notice
//             </span>
//             <button onClick={handleNotice}>
//               <RxCross2 size={20} />
//             </button>
//           </div>
//           <p className="text-sm font-medium">
//             We're truly glad, know that you’re valued and supported every step
//             of the way. Make yourself at home, explore freely, and don’t
//             hesitate to reach out if you need anything. Once again, a heartfelt
//             welcome — we’re excited for what lies ahead!
//           </p>
//         </div>
//       )}

//       {/* Loader */}
//       {loading && (
//         <div className="flex justify-center items-center mt-6">
//           <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
//         </div>
//       )}

//       {/* Error message */}
//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 mt-4 rounded-lg">
//           {error}
//         </div>
//       )}

//       {/* Banner */}
//       {!loading && !error && annRound ? (
//         <div
//           className="relative rounded-xl min-h-60 mt-2 overflow-hidden"
//           style={{
//             backgroundImage: `url(${annRound?.announcement_info?.announcement_banner})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         >
//           <div className="absolute inset-0 bg-black600 bg-opacity-50"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <h2 className="text-white text-4xl font-bold text-center">
//               {annRound?.announcement_info?.announcement_name}
//             </h2>
//           </div>
//         </div>
//       ) : null}

//       {/* Rounds card */}
//       {!loading && !error && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-8 gap-14 lg:gap-4">
//           {annRound?.data?.length > 0 ? (
//             annRound.data.map((round) => (
//               <div key={round.id}>
//                 <div className="flex items-center gap-2 mb-2">
//                   <h3 className="text-xl font-semibold text-black600">
//                     {round.round_name}
//                   </h3>
//                   <div className="flex items-center justify-center">
//                     <div className="bg-primary text-white py-[2px] px-3 text-base font-semibold rounded-md">
//                       {round.round_status === "upcoming" && (
//                         <CountdownTimer
//                           targetDate={round.quiz_start_date}
//                           onComplete={() => handleCountdownComplete(round.id)}
//                         />
//                       )}
//                       {/* <CountdownTimer
//                         targetDate={round.quiz_start_date}
//                         onComplete={() => handleCountdownComplete(round.id)}
//                       /> */}
//                     </div>
//                   </div>
//                 </div>
//                 <StudentParticipateRound
//                   layout="vertical"
//                   round={round.id}
//                   quizId={quizId}
//                   round_status={round.round_status}
//                   image={round.round_image}
//                   title={round.announcement_name}
//                   subject={round.topic_subject}
//                   exam_type={round.exam_type}
//                   start_date={round.quiz_start_date}
//                   end_Date={round.quiz_end_date}
//                   next_round_qualifier={round.next_round_qualifier}
//                   total_question={round.total_questions}
//                   duration={round.duration}
//                   is_participated={round.is_participated}
//                   onParticipate={() =>
//                     handleParticipateClick(
//                       round.toLowerCase?.().replace(" ", "-")
//                     )
//                   }
//                   isParticipateEnabled={!!enabledButtons[round.id]}
//                 />
//               </div>
//             ))
//           ) : (
//             <p>No Data Found</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RoundAnnouncementEvent;
