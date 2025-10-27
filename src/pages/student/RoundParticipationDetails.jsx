import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/API";
import ResultTable from "./roundAnnouncement/ResultTable";
import StudentParticipateRound from "./roundAnnouncement/StudentParticipateRound";

const RoundParticipationDetails = () => {
  const [singleRound, setSingleRound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { round } = useParams();

  // get single round
  useEffect(() => {
    const getSingleRound = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const response = await API.get(
          `/anc/single-round-details-view/${round}`
        );
        setSingleRound(response?.data?.data);
      } catch (error) {
        const apiError =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong while fetching round details.";
        setErrorMsg(apiError);
      } finally {
        setLoading(false);
      }
    };
    getSingleRound();
  }, [round]);

  return (
    <div className="px-4">
      <div className="mb-20">
        <h2 className="text-2xl xl:text-4xl font-bold flex items-center gap-2 mb-6">
          ROUND PARTICIPATION STATUS
        </h2>

        {/* loading spinner */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        )}

        {/* error message */}
        {errorMsg && (
          <div className="text-red-500 font-medium mb-6 text-center">
            {errorMsg}
          </div>
        )}

        {/* round step list */}
        {!loading && !errorMsg && singleRound && (
          <>
            <div className="w-full sm:max-w-5xl mb-20">
              <StudentParticipateRound
                layout="horizontal"
                round={singleRound.round_name}
                round_status={singleRound.round_status}
                image={singleRound.study_material}
                title={singleRound.round_name}
                subject={singleRound.topic_subject}
                exam_type={singleRound.exam_type}
                start_date={singleRound.quiz_start_date}
                end_Date={singleRound.quiz_end_date}
                total_question={singleRound.total_questions}
                duration={singleRound.duration}
                is_participate={singleRound.is_participated}
                next_round_qualifier={singleRound.next_round_qualifier}
              />
            </div>

            <div>
              <ResultTable
                roundId={round}
                next_round_qualifier={singleRound.next_round_qualifier}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoundParticipationDetails;
