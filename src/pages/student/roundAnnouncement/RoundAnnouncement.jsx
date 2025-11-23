import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { TbExclamationCircle } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/API";
import CountdownTimer from "../../../components/CountdownTimer";
import { formatDateTime } from "../../../utils/FormateDateTime";
import ParticipateModal from "./ParticipateModal";
import QuizParticipateAlert from "./QuizParticipateAlert";
import StudentParticipateRound from "./StudentParticipateRound";

const RoundAnnouncement = () => {
  const [isParticipateModalOpen, setIsParticipateModalOpen] = useState(false);
  const [isQuizAlertOpen, setIsQuizAlertOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
  const [annRound, setAnnRound] = useState(null);
  const [enabledButtons, setEnabledButtons] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(true);
  const navigate = useNavigate();
  const [noticeData, setNoticeData] = useState([]);
  const { quizId } = useParams();

  // get announcement data
  // useEffect(() => {
  //   const getAnnouncement = async () => {
  //     try {
  //       const response = await API.get(
  //         `/anc/student-announcement-reg-list/${quizId}`
  //       );
  //       console.log("getAnnouncement:", response);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   getAnnouncement();
  // }, [quizId]);

  // get round data
  useEffect(() => {
    const getRound = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await API.get(
          `/anc/student-announcement-round-list-anc/${quizId}`
        );
        setAnnRound(response?.data);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Something went wrong while fetching round data.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    getRound();
  }, [quizId]);

  // handle countdown timer
  const handleCountdownComplete = (roundId) => {
    setEnabledButtons((prev) => ({ ...prev, [roundId]: true }));
    setAnnRound((prev) => {
      if (!prev) return prev;
      const next = { ...prev };
      if (Array.isArray(next.data)) {
        next.data = next.data.map((r) => {
          // Only change to active if round was previously upcoming
          if (r.id === roundId && r.round_status === "upcoming") {
            return { ...r, round_status: "active" };
          }
          return r;
        });
      }
      return next;
    });
  };

  // fetch notice data
  useEffect(() => {
    const getNotice = async () => {
      setLoading(true);
      try {
        const response = await API.get(
          `/anc/view-announcement-notice-anc/${quizId}/`
        );
        console.log("get notice response:", response.data);

        if (response.data.status) {
          setNoticeData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching notice:", err);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) getNotice();
  }, [quizId]);

  // const handleCountdownComplete = (roundId) => {
  //   setEnabledButtons((prev) => ({ ...prev, [roundId]: true }));
  //   setAnnRound((prev) => {
  //     if (!prev) return prev;
  //     const next = { ...prev };
  //     if (Array.isArray(next.data)) {
  //       next.data = next.data.map((r) =>
  //         r.id === roundId ? { ...r, round_status: "active" } : r
  //       );
  //     }
  //     return next;
  //   });
  // };

  const handleParticipateClick = (round) => {
    setSelectedRound(round);
    setIsParticipateModalOpen(true);
  };

  const handleConfirm = () => {
    setIsParticipateModalOpen(false);
    setIsQuizAlertOpen(true);
  };

  const handleCancel = () => {
    setIsParticipateModalOpen(false);
    setSelectedRound(null);
  };

  const handleAlertClose = () => {
    setIsQuizAlertOpen(false);
    setSelectedRound(null);
  };

  const handleAlertContinue = () => {
    setIsQuizAlertOpen(false);
    navigate(`/quiz/${selectedRound}`);
  };

  // hanle notice popup
  const handleNotice = () => {
    setNotice(false);
  };

  return (
    <div className="relative px-2">
      {/* Modal Overlay for ParticipateModal */}
      {isParticipateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <ParticipateModal onConfirm={handleConfirm} onCancel={handleCancel} />
        </div>
      )}

      {/* Modal Overlay for QuizParticipateAlert */}
      {isQuizAlertOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <QuizParticipateAlert
            onClose={handleAlertClose}
            onContinue={handleAlertContinue}
          />
        </div>
      )}

      {/* Notice message */}
      {notice && (
        <div className="bg-orange-50 p-4 rounded-xl">
          <div className="text-sm font-medium">
            <div className="space-y-3">
              {loading ? (
                // Loading state
                <div className="flex items-center justify-center py-6">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-600 font-medium">
                    Loading notices...
                  </span>
                </div>
              ) : noticeData.length > 0 ? (
                // Data found
                noticeData.map((item) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-medium mb-1 flex items-center gap-2">
                        <TbExclamationCircle
                          size={24}
                          style={{ color: "primary" }}
                        />
                        Notice:
                      </span>
                      <button onClick={handleNotice}>
                        <RxCross2 size={20} />
                      </button>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">
                        {item.notice_text}
                      </p>
                      <p className="text-sm text-gray-500">
                        Last Update: {formatDateTime(item.updated_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                // No data
                <p className="text-gray-500 text-center py-4">
                  No announcement notices found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center mt-6">
          <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mt-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Banner */}
      {!loading && !error && annRound ? (
        <div
          className="relative rounded-xl min-h-60 mt-2 overflow-hidden"
          style={{
            backgroundImage: `url(${annRound?.announcement_info?.announcement_banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-white text-4xl font-bold text-center">
              {annRound?.announcement_info?.announcement_name}
            </h2>
          </div>
        </div>
      ) : null}

      {/* Rounds card */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-8 gap-14 lg:gap-4">
          {annRound?.data?.length > 0 ? (
            annRound.data.map((round) => (
              <div key={round.id}>
                <div className="flex items-center gap-2 mb-2">
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
                <StudentParticipateRound
                  layout="vertical"
                  round={round.id}
                  quizId={quizId}
                  round_status={round.round_status}
                  image={round.round_image}
                  title={round.announcement_name}
                  subject={round.topic_subject}
                  exam_type={round.exam_type}
                  start_date={round.quiz_start_date}
                  end_Date={round.quiz_end_date}
                  next_round_qualifier={round.next_round_qualifier}
                  total_question={round.total_questions}
                  duration={round.duration}
                  is_participated={round.is_participated}
                  onParticipate={() =>
                    handleParticipateClick(
                      round.toLowerCase?.().replace(" ", "-")
                    )
                  }
                  isParticipateEnabled={!!enabledButtons[round.id]}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-red-500">No Round Available Now</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoundAnnouncement;

// import { useEffect, useState } from "react";
// import { RxCross2 } from "react-icons/rx";
// import { TbExclamationCircle } from "react-icons/tb";
// import { useNavigate, useParams } from "react-router-dom";
// import API from "../../../api/API";
// import CountdownTimer from "../../../components/CountdownTimer";
// import ParticipateModal from "./ParticipateModal";
// import QuizParticipateAlert from "./QuizParticipateAlert";
// import StudentParticipateRound from "./StudentParticipateRound";

// const RoundAnnouncement = () => {
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

// export default RoundAnnouncement;
