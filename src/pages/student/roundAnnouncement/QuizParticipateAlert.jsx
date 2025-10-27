import { IoMdClose } from "react-icons/io";
import WarningIcon from "../../../assets/icons/warning.svg";

const QuizParticipateAlert = ({ onClose, onContinue }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-[#FFFDF4] rounded-lg shadow-lg p-6 w-[500px]">
        {/* Close Button */}
        <div className="flex justify-end mb-2">
          <button onClick={onClose}>
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center rounded-full">
              <img src={WarningIcon} alt="warning icon" width={60} />
            </div>
          </div>

          <h3 className="text-black600 text-xl xl:text-2xl font-semibold text-center">
            Please read the instructions before starting the quiz
          </h3>

          <ul className="list-decimal pl-8 space-y-2 text-gray700 font-medium">
            <li className="text-sm">Do not refresh your browser</li>
            <li className="text-sm">Do not minimize your browser</li>
            <li className="text-sm">Ensure a stable internet connection</li>
            <li className="text-sm">
              Answer all questions within the time limit
            </li>
            <li className="text-sm">Take your seat on time</li>
            <li className="text-sm">Keep an eye on the timer</li>
          </ul>
        </div>

        {/* Continue Button */}
        <div className="flex items-center justify-center mt-8">
          <button
            className="w-1/2 bg-gradient-to-r from-gradientEnd to-gradientStart text-white py-2 px-6 rounded font-semibold transition hover:opacity-90"
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizParticipateAlert;
