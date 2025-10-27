import { useState } from "react";
import { useParams } from "react-router-dom";
import MixAiQuesitonsMaker from "./MixAiQuesitonsMaker";
import TutorQuestionsListTable from "./TutorQuestionsListTable";

const CreateMixQuestion = () => {
  // const location = useLocation();
  // const { roundId, annId } = location.state || {};
  // console.log("Received roundId:", roundId, "announcement:", annId);
  const { roundId, annId } = useParams();
  const [questionsIds, setQuestionsIds] = useState([]);

  console.log("questionIds", questionsIds);

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 my-10">
        <MixAiQuesitonsMaker
          roundId={roundId}
          annId={annId}
          questionsIds={questionsIds}
          setQuestionsIds={setQuestionsIds}
        />

        <div className="xl:border-l xl:border-gray300 xl:pl-4">
          <TutorQuestionsListTable
            roundId={roundId}
            annId={annId}
            setQuestionsIds={setQuestionsIds}
          />
        </div>
      </div>
    </>
  );
};
export default CreateMixQuestion;
