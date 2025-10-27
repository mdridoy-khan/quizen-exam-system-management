import { Link } from "react-router-dom";

const Card = ({ text, buttonText, type }) => {
  let path = "/register";

  let userType = "student";
  if (type === "tutor") {
    userType = "tutor";
  }

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
      {/* Text Section */}
      <p className="text-gray-700 text-base mb-4">{text}</p>

      {/* Button */}
      <Link
        to={path}
        state={{ userType }}
        className="inline-block px-6 py-2 text-white font-medium rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default Card;
