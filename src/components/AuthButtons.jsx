import { FaUser } from "react-icons/fa";
import { GiFlowerEmblem, GiPodiumWinner } from "react-icons/gi";
import { RiEyeCloseFill } from "react-icons/ri";
import { Link } from "react-router-dom";
const AuthButtons = ({ onParticipateClick }) => {
  return (
    <div className="flex flex-col gap-[0.5px] fixed top-1/2 right-0 -translate-y-1/2 z-40">
      <Link
        to="/login"
        className="auth_single_btn flex items-center bg-black600 w-44 outline-0 gap-4 "
      >
        <span className="text-white p-3 leading-none bg-[#9A32E0]">
          <FaUser size={16} />
        </span>
        <span className="text-white leading-none">Login</span>
      </Link>
      <Link
        to="/login"
        className="auth_single_btn flex items-center bg-black600 w-44 outline-0 gap-4"
      >
        <span className="text-white p-3 leading-none bg-[#9A32E0]">
          <GiFlowerEmblem size={16} />
        </span>
        <span className="text-white leading-none">My Account</span>
      </Link>
      <Link
        to="/winners"
        className="auth_single_btn large_btn flex items-center bg-black600 w-44 outline-0 gap-4"
      >
        <span className="text-white p-3 leading-none bg-[#9A32E0]">
          <GiPodiumWinner size={16} />
        </span>
        <span className="text-white leading-none">Winner Announcement</span>
      </Link>
      <button
        onClick={onParticipateClick}
        className="auth_single_btn flex bg-black600 w-44 outline-0 gap-4"
      >
        <span className="text-white p-3 leading-none bg-[#9A32E0]">
          <RiEyeCloseFill size={16} />
        </span>
        <span className="text-white leading-none text-left">
          Live Announcement
        </span>
      </button>
    </div>
  );
};
export default AuthButtons;
