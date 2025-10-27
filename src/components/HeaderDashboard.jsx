import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaBars, FaBell } from "react-icons/fa";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { GrAnnounce } from "react-icons/gr";
import { MdNewspaper } from "react-icons/md";
import { TbRosetteDiscountCheck } from "react-icons/tb";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import API from "../api/API";
import { formatDateTime } from "../utils/FormateDateTime";
import { UserLogout } from "../utils/UserLogout";

const menuItems = {
  student: [
    {
      to: "/student/dashboard",
      icon: <GoHome size={18} />,
      label: "Dashboard",
    },
    {
      to: "/student/all-announcement",
      icon: <GrAnnounce size={18} />,
      label: "All Announcement",
    },
    {
      to: "/student/my-announcement",
      icon: <GrAnnounce size={18} />,
      label: "Registered Announcement",
    },
    {
      to: "/student/participation-list",
      icon: <TbRosetteDiscountCheck size={18} />,
      label: "Your Participation",
    },
    {
      to: "/student/profile",
      icon: <CgProfile size={18} />,
      label: "My Profile",
    },
    // { to: "/", icon: <IoSettingsOutline size={18} />, label: "Settings" },
  ],
  tutor: [
    {
      to: "/tutor/dashboard",
      icon: <MdNewspaper size={18} />,
      label: "Dashboard",
    },
    {
      to: "/tutor/share-questions",
      icon: <GrAnnounce size={18} />,
      label: "Shared Question",
    },
    {
      to: "/tutor/profile",
      icon: <CgProfile size={18} />,
      label: "Your Profile",
    },
    // { to: "", icon: <IoSettingsOutline size={18} />, label: "Settings" },
  ],
  president: [
    {
      to: "/president/dashboard",
      icon: <FiEdit size={18} />,
      label: "Dashboard",
    },
    {
      to: "/president/profile",
      icon: <GoHome size={18} />,
      label: "Profile",
    },
    // { to: "", icon: <IoSettingsOutline size={18} />, label: "Settings" },
  ],
};

const HeaderDashboard = ({ userRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [language, setLanguage] = useState("En");
  const [notification, setNotification] = useState([]);
  const [notificationData, setNotificationData] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = localStorage.getItem("accessToken");

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Handle scroll for header styling (kept but not used in UI to match Header)
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 0) {
  //       setIsScrolled(true);
  //     } else {
  //       setIsScrolled(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // Handle logout
  const handleLogout = () => {
    UserLogout(navigate);
    setSidebarOpen(false);
  };

  // Get user type safely
  const userData = localStorage.getItem("UserData");
  const parsedData = userData ? JSON.parse(userData) : null;
  const userType = parsedData?.user_type || null;

  // Fetch notifications
  useEffect(() => {
    if (!isLogin) return;
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/noti/notifications-list");
        setNotification(res?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, [isLogin]);

  // Handle notifications box
  const handleNotifications = () => {
    setNotificationData((prev) => !prev);
  };

  const items = menuItems[userRole] || [];
  return (
    <header className="flex items-center justify-between gap-6 px-6 h-16 2xl:h-20 bg-white border-b border-[#e4e4e7] relative z-30">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f4f4f5]"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars />
      </button>

      {/* Search Bar */}
      {/* <div className="relative flex-1 max-w-xs">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#71717a] text-sm" />
        <input
          type="text"
          placeholder="Search for Quizzes"
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#e4e4e7] focus:border-gradientStart outline-none bg-[rgba(0,0,0,0.02)]"
        />
        <TbArrowRightToArc className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#71717a] text-sm" />
      </div> */}

      {/* Desktop Navigation Tabs */}
      <div className="hidden lg:flex gap-1">
        {["Home", "Winner Announcement", "Closed Quiz"].map((tab) => (
          <NavLink
            key={tab}
            to={
              tab === "Home" ? "/" : `/${tab.toLowerCase().replace(" ", "-")}`
            }
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? "text-[#22222a]"
                  : "text-[#71717a] hover:text-[#22222a]"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            {tab}
          </NavLink>
        ))}
      </div>

      {/* User/Notification Section */}
      <div className="flex items-center gap-4">
        {isLogin && (
          <div className="relative">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f4f4f5]"
              onClick={handleNotifications}
            >
              <FaBell />
              {notification.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span>
              )}
            </button>
            {notificationData && (
              <div className="w-80 sm:w-96 h-[500px] bg-white shadow-lg rounded-2xl p-4 absolute top-[43px] right-0 border border-[#e4e4e7] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-2 mb-3">
                  <h2 className="text-lg font-semibold text-[#22222a]">
                    Notifications
                  </h2>
                  <span className="text-sm text-[#71717a]">
                    {notification.length} new
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {notification.length > 0 ? (
                    notification.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/notifications/${item.id}`)}
                        className="flex items-start gap-3 bg-[#f4f4f5] hover:bg-[hsl(243,75%,59%,0.1)] transition rounded-lg p-3 cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#e4e4e7] flex-shrink-0">
                          <img
                            src={
                              item.from_user_profile_picture ||
                              "/default-avatar.png"
                            }
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-[#22222a] text-sm leading-snug">
                            {item.message}
                          </p>
                          <span className="text-xs text-[#71717a]">
                            {formatDateTime(item.created_at)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-[#71717a] mt-10">
                      No notifications yet
                    </p>
                  )}
                </div>
                {/* <div className="border-t border-[#e4e4e7] pt-3 mt-3 flex justify-center">
                  <button
                    onClick={() => navigate("/notifications")}
                    className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-[hsl(243,75%,59%,0.9)] transition"
                  >
                    Show All Notifications
                  </button>
                </div> */}
              </div>
            )}
          </div>
        )}

        <div className="relative group">
          {isLogin ? (
            <>
              <button className="w-9 h-9 bg-primary text-white flex items-center justify-center rounded-full font-semibold text-sm">
                {parsedData?.username?.slice(0, 2).toUpperCase() || "U"}
              </button>
              <ul className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 border border-[#e4e4e7] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <li>
                  <Link
                    to={`/${userType}/dashboard`}
                    className="block px-4 py-2 text-[#22222a] text-sm hover:bg-[#f4f4f5]"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${userType}/profile`}
                    className="block px-4 py-2 text-[#22222a] text-sm hover:bg-[#f4f4f5]"
                    onClick={() => setSidebarOpen(false)}
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-[#22222a] text-sm hover:bg-[hsl(0,84%,60%,0.1)] hover:text-primary"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary"
                onClick={() => setSidebarOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-[#f4f4f5] text-[#22222a] hover:bg-primary hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0 opacity-100 visible w-64 sm:w-72 lg:w-80 h-full"
            : "-translate-x-full opacity-0 invisible w-0 h-full overflow-hidden"
        } lg:hidden`}
      >
        {/* Sidebar Header */}
        {/* <div className="flex justify-between items-center px-4 py-3 border-b border-[#e4e4e7] bg-white">
          <Link to="/" className="inline-block">
            <img src={Logo} alt="Site Logo" className="w-28 lg:w-32" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f4f4f5]"
          >
            <IoClose size={20} />
          </button>
        </div> */}

        {/* Profile/Login Section */}
        <li className="border-b border-[#e4e4e7] pt-4 pb-4">
          {isLogin ? (
            <>
              {/* My Account Header */}
              <div
                className="flex items-center gap-3 px-4 cursor-pointer"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-9 h-9 bg-primary text-white flex items-center justify-center rounded-full font-semibold text-sm">
                  {parsedData?.username?.slice(0, 2).toUpperCase() || "U"}
                </div>
                <span className="font-medium text-[#22222a] text-sm">
                  My Account
                </span>
                <span className="ml-auto text-sm">
                  {isDropdownOpen ? (
                    <FaAngleDown size={14} />
                  ) : (
                    <FaAngleUp size={14} />
                  )}
                </span>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <ul className="mt-2">
                  <li>
                    <Link
                      to={`/${userType}/dashboard`}
                      className="block px-4 py-2 text-[#22222a] text-sm hover:bg-[#f4f4f5]"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/${userType}/profile`}
                      className="block px-4 py-2 text-[#22222a] text-sm hover:bg-[#f4f4f5]"
                      onClick={() => setSidebarOpen(false)}
                    >
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-[#22222a] text-sm hover:bg-[hsl(0,84%,60%,0.1)] hover:text-primary"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </>
          ) : (
            <li className="mt-4 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="block px-4 py-2 text-sm font-medium text-center rounded-lg bg-primary text-white hover:bg-primary"
                onClick={() => setSidebarOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-sm font-medium text-center rounded-lg bg-[#f4f4f5] text-[#22222a] hover:bg-primary hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                Sign Up
              </Link>
            </li>
          )}
        </li>

        {/* Sidebar Menu Items */}
        <ul className="flex flex-col p-4 gap-2">
          {["Home", "Winner Announcement", "Closed Quiz"].map((tab) => (
            <li key={tab}>
              <NavLink
                to={
                  tab === "Home"
                    ? "/"
                    : `/${tab.toLowerCase().replace(" ", "-")}`
                }
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-[#f4f4f5] text-[#22222a]"
                      : "text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#22222a]"
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                {tab}
              </NavLink>
            </li>
          ))}

          {/* user role base menu item visible */}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            {items.length > 0 ? (
              items.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-primary bg-opacity-5 text-secondary"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No menu available</p>
            )}
          </div>

          {/* Social Media Icons */}
          {/* <li className="mt-4 border-t border-[#e4e4e7] pt-4">
            <div className="flex gap-3">
              <a
                href="https://facebook.com/fleekbangladesh"
                target="_blank"
                className="p-2 rounded-lg hover:bg-[#f4f4f5] transition"
              >
                <img src={facebook} alt="facebook icon" width={20} />
              </a>
              <a
                href="https://m.me/fleekbangladesh"
                target="_blank"
                className="p-2 rounded-lg hover:bg-[#f4f4f5] transition"
              >
                <img src={messanger} alt="messanger icon" width={20} />
              </a>
              <a
                href="https://wa.me/8801717362597"
                target="_blank"
                className="p-2 rounded-lg hover:bg-[#f4f4f5] transition"
              >
                <img src={whatsapp} alt="whatsapp icon" width={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/fleekbangladesh/"
                target="_blank"
                className="p-2 rounded-lg hover:bg-[#f4f4f5] transition"
              >
                <img src={linkedin} alt="linkedin icon" width={20} />
              </a>
            </div>
          </li> */}

          {/* {isLogin ? (
            <li className="mt-4 border-t border-[#e4e4e7] pt-4">
              <div className="flex items-center gap-3 px-4">
                <div className="w-9 h-9 bg-primary text-white flex items-center justify-center rounded-full font-semibold text-sm">
                  {parsedData?.username?.slice(0, 2).toUpperCase() || "U"}
                </div>
                <span className="font-medium text-[#22222a] text-sm">
                  My Account
                </span>
              </div>
              <ul className="mt-2">
                <li>
                  <Link
                    to={`/${userType}/dashboard`}
                    className="block px-4 py-2 text-[#22222a] text-sm hover:bg-[#f4f4f5]"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${userType}/profile`}
                    className="block px-4 py-2 text-[#22222a] text-sm hover:bg-[#f4f4f5]"
                    onClick={() => setSidebarOpen(false)}
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-[#22222a] text-sm hover:bg-[hsl(0,84%,60%,0.1)] hover:text-primary"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            <li className="mt-4 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="block px-4 py-2 text-sm font-medium text-center rounded-lg bg-primary text-white hover:bg-[hsl(243,75%,59%,0.9)]"
                onClick={() => setSidebarOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-sm font-medium text-center rounded-lg bg-[#f4f4f5] text-[#22222a] hover:bg-primary hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                Sign Up
              </Link>
            </li>
          )} */}
        </ul>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default HeaderDashboard;

// import { useEffect, useRef, useState } from "react";
// import { FiMenu, FiX } from "react-icons/fi";
// import { IoNotifications } from "react-icons/io5";
// import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import API from "../api/API";
// import facebook from "../assets/icons/facebook.svg";
// import linkedin from "../assets/icons/linkedin.svg";
// import messanger from "../assets/icons/messanger.svg";
// import whatsapp from "../assets/icons/whatsapp.svg";
// import Logo from "../assets/logo/logo-blue.svg";
// import { formatDateTime } from "../utils/FormateDateTime";
// import { UserLogout } from "../utils/UserLogout";

// const HeaderDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const sidebarRef = useRef(null);
//   const [language, setLanguage] = useState("En");
//   const [notification, setNotification] = useState([]);
//   const [notificationData, setNotificationData] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isLogin = localStorage.getItem("accessToken");

//   // Handle click outside to close sidebar
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
//         setSidebarOpen(false);
//       }
//     };

//     if (sidebarOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [sidebarOpen]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 0) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Handle logout
//   const handleLogout = () => {
//     UserLogout(navigate);
//     setSidebarOpen(false);
//   };

//   // Get user type safely
//   const userData = localStorage.getItem("UserData");
//   const parsedData = userData ? JSON.parse(userData) : null;
//   const userType = parsedData?.user_type || null;

//   // Fetch notifications
//   useEffect(() => {
//     if (!isLogin) return;
//     const fetchNotifications = async () => {
//       try {
//         const res = await API.get("/noti/notifications-list");
//         setNotification(res?.data || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchNotifications();
//   }, [isLogin]);

//   // Handle notifications box
//   const handleNotifications = () => {
//     setNotificationData((prev) => !prev);
//   };

//   return (
//     <header
//       className={`sticky top-0 z-50 transition-all duration-500 ${
//         isScrolled
//           ? "bg-gradient-to-r from-[#FCE7F3] via-[#FEF9C2] to-[#DBEAFE] shadow-lg backdrop-blur-lg"
//           : "bg-transparent"
//       }`}
//     >
//       <div className="container mx-auto px-4">
//         {/* Mobile to lg Header (visible below 2xl) */}
//         <div className="flex items-center justify-between py-1 sm:py-2 lg:hidden">
//           {/* Logo (Left) */}
//           <Link to="/" className="inline-block">
//             <img
//               src={Logo}
//               alt="Site Logo"
//               className="w-24 sm:w-28 lg:w-32 transition-all duration-300"
//             />
//           </Link>

//           {/* Search Bar (Center) */}
//           {/* <div className="relative rounded-lg p-[1px] bg-gradient-to-r from-gradientStart to-gradientEnd">
//             <div className="flex items-center bg-[#FFF5EE] rounded-md px-2 py-1 w-40 sm:w-48 lg:w-64 xl:w-80">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-full bg-transparent text-gradientStart placeholder:text-gradientEnd text-sm lg:text-base font-semibold focus:outline-none"
//               />
//               <button className="text-gradientEnd text-base lg:text-lg hover:scale-110 transition-transform">
//                 <FiSearch />
//               </button>
//             </div>
//           </div> */}

//           {/* Hamburger Menu (Right) */}
//           <button
//             className="text-primary text-xl p-2 rounded-lg hover:bg-indigo-50 transition-all duration-300"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <FiMenu size={24} className="lg:size-6" />
//           </button>
//         </div>

//         {/* Desktop Header (visible 2xl and above) */}
//         <nav className="hidden lg:flex items-center justify-between py-2">
//           <div>
//             <Link to="/" className="inline-block">
//               <img
//                 src={Logo}
//                 alt="Site Logo"
//                 className="w-28 lg:w-32 xl:w-[160px] transition-all duration-300"
//               />
//             </Link>
//           </div>

//           <ul className="flex items-center justify-between flex-wrap gap-2">
//             <li>
//               <NavLink
//                 to="/"
//                 className="group relative py-5 px-3 lg:px-5 inline-flex font-medium transition-all duration-300 rounded-lg overflow-hidden"
//               >
//                 {({ isActive }) => (
//                   <>
//                     <span
//                       className={`relative z-10 ${
//                         isActive
//                           ? "text-primary"
//                           : "text-secondary group-hover:text-primary"
//                       }`}
//                     >
//                       Home
//                     </span>
//                     <span
//                       className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gradientEnd to-gradientStart transform transition-transform duration-300 origin-left ${
//                         isActive
//                           ? "scale-x-100"
//                           : "scale-x-0 group-hover:scale-x-100"
//                       }`}
//                     ></span>
//                   </>
//                 )}
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/winners"
//                 className="group relative py-5 px-3 lg:px-5 inline-flex font-medium transition-all duration-300 rounded-lg overflow-hidden"
//               >
//                 {({ isActive }) => (
//                   <>
//                     <span
//                       className={`relative z-10 ${
//                         isActive
//                           ? "text-primary"
//                           : "text-secondary group-hover:text-primary"
//                       }`}
//                     >
//                       Winner Announcement
//                     </span>
//                     <span
//                       className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gradientEnd to-gradientStart transform transition-transform duration-300 origin-left ${
//                         isActive
//                           ? "scale-x-100"
//                           : "scale-x-0 group-hover:scale-x-100"
//                       }`}
//                     ></span>
//                   </>
//                 )}
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/closed-quiz"
//                 className="group relative py-5 px-3 lg:px-5 inline-flex font-medium transition-all duration-300 rounded-lg overflow-hidden"
//               >
//                 {({ isActive }) => (
//                   <>
//                     <span
//                       className={`relative z-10 ${
//                         isActive
//                           ? "text-primary"
//                           : "text-secondary group-hover:text-primary"
//                       }`}
//                     >
//                       Closed Quiz
//                     </span>
//                     <span
//                       className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gradientEnd to-gradientStart transform transition-transform duration-300 origin-left ${
//                         isActive
//                           ? "scale-x-100"
//                           : "scale-x-0 group-hover:scale-x-100"
//                       }`}
//                     ></span>
//                   </>
//                 )}
//               </NavLink>
//             </li>
//           </ul>

//           {/* Desktop Search Box */}
//           {/* <div className="relative rounded-xl p-[2px] bg-gradient-to-r from-gradientStart to-gradientEnd">
//             <div className="flex items-center bg-[#FFF5EE] rounded-lg px-4 py-2 w-72 md:w-96">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-full bg-transparent text-gradientStart placeholder:text-gradientEnd font-semibold focus:outline-none"
//               />
//               <button className="text-gradientEnd text-xl hover:scale-110 transition-transform">
//                 <FiSearch />
//               </button>
//             </div>
//           </div> */}

//           {/* Desktop Language and Icons */}
//           <div className="flex items-center justify-center gap-2">
//             {/* <button
//               onClick={() =>
//                 setLanguage((prev) => (prev === "En" ? "Bn" : "En"))
//               }
//               className="text-white font-medium text-sm bg-gradient-to-r from-gradientEnd to-gradientStart px-2 py-1 rounded hover:text-indigo-200 transition duration-300"
//             >
//               {language}
//             </button> */}

//             {isLogin && (
//               <div className="relative">
//                 <button
//                   className="text-gray-700 flex items-center justify-center transition-colors duration-300"
//                   onClick={handleNotifications}
//                 >
//                   <IoNotifications size={18} />
//                 </button>
//                 {notification.length > 0 && (
//                   <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-red-500 shadow-lg text-[10px] font-medium flex items-center justify-center">
//                     {notification.length}
//                   </span>
//                 )}
//                 {notificationData && (
//                   <div className="w-80 sm:w-96 h-[500px] bg-white shadow-lg rounded-2xl p-4 absolute top-[43px] right-0 border border-gray-200 flex flex-col overflow-hidden">
//                     <div className="flex items-center justify-between border-b pb-2 mb-3">
//                       <h2 className="text-lg font-semibold text-gray-800">
//                         Notifications
//                       </h2>
//                       <span className="text-sm text-gray-500">
//                         {notification.length} new
//                       </span>
//                     </div>
//                     <div className="flex-1 overflow-y-auto space-y-3 scrollbar-none">
//                       {notification.length > 0 ? (
//                         notification.map((item) => (
//                           <div
//                             key={item.id}
//                             onClick={() =>
//                               navigate(`/notifications/${item.id}`)
//                             }
//                             className="flex items-start gap-3 bg-gray-50 hover:bg-blue-50 transition rounded-lg p-3 cursor-pointer"
//                           >
//                             <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 flex-shrink-0">
//                               <img
//                                 src={
//                                   item.from_user_profile_picture ||
//                                   "/default-avatar.png"
//                                 }
//                                 alt="User"
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <p className="text-gray-700 text-sm leading-snug">
//                                 {item.message}
//                               </p>
//                               <span className="text-xs text-gray-400">
//                                 {formatDateTime(item.created_at)}
//                               </span>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-center text-gray-500 mt-10">
//                           No notifications yet
//                         </p>
//                       )}
//                     </div>
//                     <div className="border-t pt-3 mt-3 flex justify-center">
//                       <button
//                         onClick={() => navigate("/notifications")}
//                         className="w-full bg-gradient-to-r from-gradientEnd to-gradientStart text-white py-2 rounded-lg font-medium transition"
//                       >
//                         Show All Notifications
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* language change button and social icons */}
//             {/* <div className="relative group">
//               <button className="text-gray-700 flex items-center justify-center transition-colors duration-300">
//                 <FaUserPlus size={18} />
//               </button>
//               <ul className="absolute right-0 bg-white p-2 z-50 grid grid-cols-3 w-[132px] shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
//                 <li>
//                   <a
//                     href="https://facebook.com/fleekbangladesh"
//                     target="_blank"
//                     className="p-2 inline-flex transition ease-in-out duration-300 hover:bg-indigo-50 rounded-lg"
//                   >
//                     <img src={facebook} alt="facebook icon" width={20} />
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="https://m.me/fleekbangladesh"
//                     target="_blank"
//                     className="p-2 inline-flex transition ease-in-out duration-300 hover:bg-indigo-50 rounded-lg"
//                   >
//                     <img src={messanger} alt="messanger icon" width={20} />
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="https://wa.me/8801717362597"
//                     target="_blank"
//                     className="p-2 inline-flex transition ease-in-out duration-300 hover:bg-indigo-50 rounded-lg"
//                   >
//                     <img src={whatsapp} alt="whatsapp icon" width={20} />
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="https://www.linkedin.com/in/fleekbangladesh/"
//                     target="_blank"
//                     className="p-2 inline-flex transition ease-in-out duration-300 hover:bg-indigo-50 rounded-lg"
//                   >
//                     <img src={linkedin} alt="linkedin icon" width={20} />
//                   </a>
//                 </li>
//               </ul>
//             </div> */}

//             {isLogin ? (
//               <div className="group relative">
//                 <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-600">
//                   <img
//                     src="https://i.pravatar.cc/100"
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//                 <ul className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
//                   <li>
//                     <Link
//                       to={`/${userType}/dashboard`}
//                       className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-gradientEnd"
//                       onClick={() => setSidebarOpen(false)}
//                     >
//                       Dashboard
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to={`/${userType}/profile`}
//                       className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-gradientEnd"
//                       onClick={() => setSidebarOpen(false)}
//                     >
//                       My Profile
//                     </Link>
//                   </li>
//                   <li>
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
//                     >
//                       Logout
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <Link
//                   to="/login"
//                   className="px-5 py-2 text-center font-medium rounded-lg bg-indigo-100 bg-gradient-to-r from-gradientStart to-gradientEnd text-white"
//                   onClick={() => setSidebarOpen(false)}
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="px-5 py-2 text-center font-medium rounded-lg transition bg-indigo-100 text-gradientStart hover:bg-gradient-to-r hover:from-gradientStart hover:to-gradientEnd hover:text-white"
//                   onClick={() => setSidebarOpen(false)}
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>
//         </nav>
//       </div>

//       {/* Mobile Sidebar (visible below 2xl) */}
//       <div
//         ref={sidebarRef}
//         className={`fixed top-0 right-0 bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
//           sidebarOpen
//             ? "translate-x-0 opacity-100 visible w-64 sm:w-72 lg:w-80 h-full"
//             : "translate-x-full opacity-0 invisible w-0 h-full overflow-hidden"
//         } 2xl:hidden`}
//       >
//         {/* Sidebar Header */}
//         <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gradientStart to-gradientEnd">
//           <span className="font-semibold text-lg text-white tracking-wide">
//             Menu
//           </span>
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="text-white p-2 rounded-full hover:bg-gradientEnd transition-colors duration-300"
//           >
//             <FiX size={20} className="lg:size-6" />
//           </button>
//         </div>

//         {/* Sidebar Menu Items */}
//         <ul className="flex flex-col p-4 gap-2 lg:gap-3">
//           <li>
//             <Link
//               to="/"
//               className={`block px-4 py-2 rounded-lg font-medium text-sm lg:text-base transition-all duration-300 ${
//                 location.pathname === "/"
//                   ? "bg-indigo-100 text-gradientEnd"
//                   : "text-gray-700 hover:bg-indigo-50 hover:text-gradientEnd"
//               }`}
//               onClick={() => setSidebarOpen(false)}
//             >
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/winners"
//               className={`block px-4 py-2 rounded-lg font-medium text-sm lg:text-base transition-all duration-300 ${
//                 location.pathname === "/winners"
//                   ? "bg-indigo-100 text-gradientEnd"
//                   : "text-gray-700 hover:bg-indigo-50 hover:text-gradientEnd"
//               }`}
//               onClick={() => setSidebarOpen(false)}
//             >
//               Winner Announcement
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/closed-quiz"
//               className={`block px-4 py-2 rounded-lg font-medium text-sm lg:text-base transition-all duration-300 ${
//                 location.pathname === "/closed-quiz"
//                   ? "bg-indigo-100 text-gradientEnd"
//                   : "text-gray-700 hover:bg-indigo-50 hover:text-gradientEnd"
//               }`}
//               onClick={() => setSidebarOpen(false)}
//             >
//               Closed Quiz
//             </Link>
//           </li>

//           {/* Social Media Icons */}
//           <li className="mt-4 border-t border-gray-200 pt-4">
//             <div className="flex gap-3">
//               <a
//                 href="https://facebook.com/fleekbangladesh"
//                 target="_blank"
//                 className="p-2 rounded-lg hover:bg-indigo-50 transition"
//               >
//                 <img
//                   src={facebook}
//                   alt="facebook icon"
//                   width={20}
//                   className="lg:w-6"
//                 />
//               </a>
//               <a
//                 href="https://m.me/fleekbangladesh"
//                 target="_blank"
//                 className="p-2 rounded-lg hover:bg-indigo-50 transition"
//               >
//                 <img
//                   src={messanger}
//                   alt="messanger icon"
//                   width={20}
//                   className="lg:w-6"
//                 />
//               </a>
//               <a
//                 href="https://wa.me/8801717362597"
//                 target="_blank"
//                 className="p-2 rounded-lg hover:bg-indigo-50 transition"
//               >
//                 <img
//                   src={whatsapp}
//                   alt="whatsapp icon"
//                   width={20}
//                   className="lg:w-6"
//                 />
//               </a>
//               <a
//                 href="https://www.linkedin.com/in/fleekbangladesh/"
//                 target="_blank"
//                 className="p-2 rounded-lg hover:bg-indigo-50 transition"
//               >
//                 <img
//                   src={linkedin}
//                   alt="linkedin icon"
//                   width={20}
//                   className="lg:w-6"
//                 />
//               </a>
//             </div>
//           </li>

//           {/* Language Switcher */}
//           {/* <li className="mt-2">
//             <button
//               onClick={() =>
//                 setLanguage((prev) => (prev === "En" ? "Bn" : "En"))
//               }
//               className="w-full text-left px-4 py-2 text-gray-700 font-medium text-sm lg:text-base rounded-lg hover:bg-indigo-50 hover:text-gradientEnd"
//             >
//               Language: {language}
//             </button>
//           </li> */}

//           {/* Profile/Login Section */}
//           {isLogin ? (
//             <li className="mt-2 border-t border-gray-200 pt-4">
//               <div className="flex items-center gap-3 px-4">
//                 <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-indigo-600">
//                   <img
//                     src="https://i.pravatar.cc/100"
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <span className="font-medium text-gray-700 text-sm lg:text-base">
//                   My Account
//                 </span>
//               </div>
//               <ul className="mt-2">
//                 <li>
//                   <Link
//                     to={`/${userType}/dashboard`}
//                     className="block px-4 py-2 text-gray-700 text-sm lg:text-base hover:bg-indigo-50 hover:text-gradientEnd"
//                     onClick={() => setSidebarOpen(false)}
//                   >
//                     Dashboard
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to={`/${userType}/profile`}
//                     className="block px-4 py-2 text-gray-700 text-sm lg:text-base hover:bg-indigo-50 hover:text-gradientEnd"
//                     onClick={() => setSidebarOpen(false)}
//                   >
//                     My Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-gray-700 text-sm lg:text-base hover:bg-red-50 hover:text-red-600"
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </ul>
//             </li>
//           ) : (
//             <li className="mt-4 grid grid-cols-2 gap-2">
//               <Link
//                 to="/login"
//                 className="block px-4 py-2 text-center text-white font-medium text-sm lg:text-base bg-gradient-to-r from-gradientStart to-gradientEnd rounded-lg hover:shadow-lg transition"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 Sign In
//               </Link>
//               <Link
//                 to="/register"
//                 className="block px-4 py-2 text-center text-white font-medium text-sm lg:text-base bg-gradient-to-r from-gradientStart to-gradientEnd rounded-lg hover:shadow-lg transition"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 Sign Up
//               </Link>
//             </li>
//           )}
//         </ul>
//       </div>

//       {/* Overlay for Mobile Sidebar (visible below 2xl) */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 2xl:hidden"
//           onClick={() => setSidebarOpen(false)}
//         ></div>
//       )}
//     </header>
//   );
// };

// export default HeaderDashboard;
