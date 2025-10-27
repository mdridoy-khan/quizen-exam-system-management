import { useState } from "react";
import { TbListDetails } from "react-icons/tb";
import { useParams } from "react-router-dom";
import RoundQualifyList from "../../../components/RoundQualifyList";

const RoundDetails = () => {
  const [selectedNextRound, setSelectedNextRound] = useState(null);
  const [selectedRoundId, setSelectedRoundId] = useState(null);
  const { id } = useParams(); // ✅ route থেকে id ধরছে

  //     const handleParticipate = (roundId, nextRoundQualifier) => {
  //     setSelectedRoundId((prev) => (prev === roundId ? null : roundId));
  //     setSelectedNextRound(nextRoundQualifier);
  //   };

  console.log("round details id", id);
  //   const [roundData, setRoundData] = useState(null);

  //   useEffect(() => {
  //     const rounds = [
  //       { id: 1, title: "Round 1: Preliminary" },
  //       { id: 2, title: "Round 2: Quarter Final" },
  //       { id: 3, title: "Round 3: Semi Final" },
  //       { id: 4, title: "Round 4: Final" },
  //     ];

  //     const selectedRound = rounds.find((round) => round.id === parseInt(id));
  //     setRoundData(selectedRound);
  //   }, [id]);

  //   if (!roundData) {
  //     return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  //   }

  return (
    <div className="px-4">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">
        Round Details
      </h1>

      {/* Single Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between max-w-sm mx-auto hover:shadow-lg transition">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4"></h2>

        <button
          className="self-start flex items-center justify-center gap-2 transition bg-secondary hover:bg-primary rounded-lg py-2 px-1 text-white text-[12px] sm:text-sm font-semibold"
          // onClick={() =>
          //   handleParticipate(round.id, round.next_round_qualifier)
          // }
        >
          View Participants <TbListDetails size={20} />
        </button>
        {selectedRoundId && selectedNextRound && (
          <div className="mt-10">
            <RoundQualifyList
              roundId={selectedRoundId}
              nextRoundQualifier={selectedNextRound}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoundDetails;
