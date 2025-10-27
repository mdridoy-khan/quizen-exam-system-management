import { Link } from "react-router-dom";

const WinnersCard = ({ winnerInfo }) => {
  return (
    <div className="space-y-6">
      {winnerInfo.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-2xl rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden relative"
        >
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Left Side */}
            <div className="space-y-3 lg:w-1/2">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[28px] font-bold text-gray-900 text-center lg:text-left">
                {item.announcement_name}
              </h3>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-700 text-center lg:text-left">
                  Department Name : {item.department_name}
                </h4>
                <h4 className="text-lg sm:text-lg font-bold text-gray-700 text-center lg:text-left">
                  Subject Name : {item.subject}
                </h4>
              </div>
              <div className="space-y-1 text-center lg:text-left">
                <span className="block text-sm sm:text-base font-medium text-gray-600">
                  Total Participants: {item.total_participants}
                </span>
                <span className="block text-sm sm:text-base font-medium text-gray-600">
                  Round Number: {item.round_number} | Total Days:{" "}
                  {item.total_days}
                </span>
                <span className="text-sm font-semibold text-gray-600 rounded-full inline-block mb-2">
                  Organizer: {item.organizer_name}
                </span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <Link
                  to="/winners-details"
                  className="mt-2 text-sm sm:text-base font-semibold bg-gradient-to-r from-primary to-secondary py-1.5 px-4 rounded inline-block text-white transition-colors duration-300 text-center lg:text-left"
                >
                  {" "}
                  View Details{" "}
                </Link>
              </div>
            </div>

            {/* Right Side - Winners */}
            <div className="lg:w-1/2">
              <ul className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8">
                {item.winner_list.slice(0, 3).map((winner, index) => (
                  <li
                    key={winner.user_id}
                    className="flex flex-col items-center justify-center"
                  >
                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">
                      {winner.position}
                    </h4>
                    <div
                      className={`${
                        index === 0
                          ? "w-24 sm:w-28 h-24 sm:h-28"
                          : index === 1
                          ? "w-20 sm:w-24 h-20 sm:h-24"
                          : "w-16 sm:w-20 h-16 sm:h-20"
                      } mb-3 rounded-full overflow-hidden border-4 border-primary shadow-lg relative group`}
                    >
                      <img
                        src={winner.profile_picture}
                        alt={`${winner.position} winner`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-gray-800">
                      {winner.name}
                    </span>
                  </li>
                ))}

                {/* Show extra winners count if more than 3 */}
                {item.winner_list.length > 3 && (
                  <li className="flex flex-col items-center justify-center">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Others
                    </h4>
                    <div className="w-16 sm:w-20 h-16 sm:h-20 mb-9 rounded-full bg-gray-300 text-primary flex items-center justify-center text-sm sm:text-lg lg:text-2xl font-medium border-4 border-primary">
                      {item.winner_list.length - 3}+
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WinnersCard;
