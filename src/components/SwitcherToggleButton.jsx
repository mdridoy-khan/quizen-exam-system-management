import { useEffect, useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import API from "../api/API";
import { API_ENDPOINS } from "../api/ApiEndpoints";

const SwitcherToggleButton = ({ id, isActive: initialIsActive }) => {
  // Added id prop
  const [isActive, setIsActive] = useState(initialIsActive);

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    const updateVisibility = async () => {
      try {
        const endpoint = isActive
          ? `${API_ENDPOINS.QUIZCARD_ACTIVE}${id}/`
          : `${API_ENDPOINS.QUIZCARD_INACTIVE}${id}/`;
        const response = await API.post(endpoint);
        console.log(
          `Switcher button ${isActive ? "active" : "inactive"} for ID ${id}:`,
          response
        );
      } catch (err) {
        console.log("Error updating visibility:", err);
      }
    };

    if (id) {
      updateVisibility();
    }
  }, [isActive, id]);

  return (
    <div
      onClick={handleToggle}
      className={`w-16 h-6 flex items-center rounded-full cursor-pointer px-1 transition-colors duration-300 ${
        isActive
          ? "bg-gradient-to-r from-green400 to-emerald-600"
          : "bg-gradient-to-r from-red400 to-rose-600"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center transform transition-transform duration-300 shadow-md ${
          isActive
            ? "bg-gradient-to-r from-green-400 to-emerald-600"
            : "bg-gradient-to-r from-red400 to-rose-600"
        } ${isActive ? "translate-x-10" : "translate-x-0"}`}
      >
        {isActive ? (
          <AiOutlineCheck className="text-white text-base" />
        ) : (
          <AiOutlineClose className="text-white text-base" />
        )}
      </div>
    </div>
  );
};

export default SwitcherToggleButton;
