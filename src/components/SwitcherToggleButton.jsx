import { useEffect, useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import API from "../api/API";
import { API_ENDPOINS } from "../api/ApiEndpoints";

const SwitcherToggleButton = ({ id, isActive: initialIsActive }) => {
  const [isActive, setIsActive] = useState(initialIsActive);
  const [userToggled, setUserToggled] = useState(false);

  const handleToggle = () => {
    setIsActive((prev) => !prev);
    setUserToggled(true);
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
        //  Only show toast if user manually toggled
        if (userToggled) {
          toast.success(
            isActive
              ? "Announcement activated successfully"
              : "Announcement deactivated successfully"
          );
        }
      } catch (err) {
        console.error("Error updating visibility:", err);
        if (userToggled)
          toast.error("Something went wrong while updating status!");
      }
    };

    // Run only after user toggles, not on initial render
    if (id && userToggled) {
      updateVisibility();
    }
  }, [isActive, id, userToggled]);

  return (
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
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
};

export default SwitcherToggleButton;

// import { useEffect, useState } from "react";
// import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
// import API from "../api/API";
// import { API_ENDPOINS } from "../api/ApiEndpoints";

// const SwitcherToggleButton = ({ id, isActive: initialIsActive }) => {
//   // Added id prop
//   const [isActive, setIsActive] = useState(initialIsActive);

//   const handleToggle = () => {
//     setIsActive((prev) => !prev);
//   };

//   useEffect(() => {
//     const updateVisibility = async () => {
//       try {
//         const endpoint = isActive
//           ? `${API_ENDPOINS.QUIZCARD_ACTIVE}${id}/`
//           : `${API_ENDPOINS.QUIZCARD_INACTIVE}${id}/`;
//         const response = await API.post(endpoint);
//         console.log(
//           `Switcher button ${isActive ? "active" : "inactive"} for ID ${id}:`,
//           response
//         );
//       } catch (err) {
//         console.log("Error updating visibility:", err);
//       }
//     };

//     if (id) {
//       updateVisibility();
//     }
//   }, [isActive, id]);

//   return (
//     <div
//       onClick={handleToggle}
//       className={`w-16 h-6 flex items-center rounded-full cursor-pointer px-1 transition-colors duration-300 ${
//         isActive
//           ? "bg-gradient-to-r from-green400 to-emerald-600"
//           : "bg-gradient-to-r from-red400 to-rose-600"
//       }`}
//     >
//       <div
//         className={`w-5 h-5 rounded-full flex items-center justify-center transform transition-transform duration-300 shadow-md ${
//           isActive
//             ? "bg-gradient-to-r from-green-400 to-emerald-600"
//             : "bg-gradient-to-r from-red400 to-rose-600"
//         } ${isActive ? "translate-x-10" : "translate-x-0"}`}
//       >
//         {isActive ? (
//           <AiOutlineCheck className="text-white text-base" />
//         ) : (
//           <AiOutlineClose className="text-white text-base" />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SwitcherToggleButton;
