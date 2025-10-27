import { Link } from "react-router-dom";
import Logo from "../assets/logo/logo.png";
const AuthHeader = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-700 to-purple-800 mb-10">
      <div className="container mx-auto px-4 flex items-center justify-between py-4">
        <div></div>
        <div>
          <Link to="/">
            <img src={Logo} alt="site logo" className="w-[140px]" />
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <button className="text-white font-semibold lg:text-lg">En</button>
          <button className="text-white font-semibold lg:text-lg pl-1 border-l border-gray100">
            Bn
          </button>
        </div>
      </div>
    </div>
  );
};
export default AuthHeader;
