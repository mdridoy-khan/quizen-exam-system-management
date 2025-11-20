import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import QuizOpenCloseModal from "../components/modals/QuizOpenCloseModal";

const ToggleQuizOpenCloseModal = ({ id, isActive: initialIsActive }) => {
  const [isActive, setIsActive] = useState(initialIsActive);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ message: "", endpoint: "" });

  // handle toggle
  const handleToggle = () => {
    const willBeActive = !isActive;
    const message = willBeActive
      ? "Are you sure you want to open this announcement?"
      : "Are you sure you want to close this announcement?";
    const endpoint = willBeActive
      ? `/anc/open-announcement/${id}/`
      : `/anc/close-announcement/${id}/`;

    setModalConfig({ message, endpoint });
    setIsModalOpen(true);
  };

  // handle confirm function
  const handleConfirm = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <>
      <div
        onClick={handleToggle}
        className={`w-20 h-6 flex items-center rounded-full cursor-pointer px-1 transition-colors duration-300 ${
          isActive
            ? "bg-gradient-to-r from-green-400 to-emerald-600"
            : "bg-gradient-to-r from-red-400 to-rose-600"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center transform transition-transform duration-300 shadow-md ${
            isActive
              ? "bg-gradient-to-r from-green-400 to-emerald-600 translate-x-[54px] relative z-40"
              : "bg-gradient-to-r from-red-400 to-rose-600 translate-x-0 relative z-40"
          }`}
        >
          {isActive ? (
            <AiOutlineCheck className="text-white text-base" />
          ) : (
            <AiOutlineClose className="text-white text-base" />
          )}
        </div>
        {/* Text Label */}
        <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 leading-none block w-full text-center text-xs font-semibold text-white opacity-70 select-none">
          {isActive ? "Open" : "Closed"}
        </span>
      </div>
      <QuizOpenCloseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalConfig.message}
        onConfirm={handleConfirm}
        endpoint={modalConfig.endpoint}
        id={id}
      />
    </>
  );
};

export default ToggleQuizOpenCloseModal;
