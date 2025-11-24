import { CgProfile } from "react-icons/cg";
import { FiEdit } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { GrAnnounce } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { MdLogout, MdNewspaper } from "react-icons/md";
import { TbRosetteDiscountCheck } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/logo/logo-blue.png";

const Sidebar = ({ role, isSidebarOpen, toggleSidebar, handleLogout }) => {
  // menu configuration based on role
  const menuItems = {
    student: [
      // {
      //   to: "/student/dashboard",
      //   icon: <GoHome size={18} />,
      //   label: "Dashboard",
      // },
      {
        to: "/student/events",
        icon: <GoHome size={18} />,
        label: "Events",
      },
      // {
      //   to: "/student/all-announcement",
      //   icon: <GrAnnounce size={18} />,
      //   label: "All Announcement",
      // },
      // {
      //   to: "/student/my-announcement",
      //   icon: <GrAnnounce size={18} />,
      //   label: "Registered Announcement",
      // },
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
    ],
    president: [
      // {
      //   to: "/president/dashboard",
      //   icon: <FiEdit size={18} />,
      //   label: "Dashboard",
      // },
      {
        to: "/president/events",
        icon: <FiEdit size={18} />,
        label: "Events",
      },
      {
        to: "/president/profile",
        icon: <GoHome size={18} />,
        label: "Profile",
      },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] text-[#22222a] font-sans">
      {/* Logo Section */}
      <div className="">
        <div className="font-bold text-lg h-16 2xl:h-20 p-4 border-b border-[#e4e4e7]">
          <Link to="/" className="inline-block">
            <img
              src={Logo}
              alt="Site Logo"
              className="w-28 transition-all duration-300 relative -top-3"
            />
          </Link>
        </div>
      </div>

      {/* Mobile Close Button */}
      <div className="flex justify-end mb-2 lg:hidden p-4">
        <button
          onClick={toggleSidebar}
          className="text-[#22222a] text-2xl hover:text-gradientStart"
        >
          <IoMdClose />
        </button>
      </div>

      {/* Menu List */}
      <nav className="flex-1 mt-6 flex flex-col gap-1 p-4">
        {items.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-[#71717a] hover:bg-[#f0f0fa] hover:text-[#22222a]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`text-lg ${
                    isActive ? "text-white" : "text-primary"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-4">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#71717a] hover:bg-[#f0f0fa] hover:text-[#22222a] transition-colors w-full text-left"
        >
          <MdLogout
            size={18}
            className="text-gradientStart group-hover:text-[#22222a] transition-colors"
          />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

// import { CgProfile } from "react-icons/cg";
// import { FiEdit } from "react-icons/fi";
// import { GoHome } from "react-icons/go";
// import { GrAnnounce } from "react-icons/gr";
// import { IoMdClose } from "react-icons/io";
// import { MdLogout, MdNewspaper } from "react-icons/md";
// import { TbRosetteDiscountCheck } from "react-icons/tb";
// import { Link, NavLink } from "react-router-dom";
// import Logo from "../assets/logo/logo-blue.svg";

// const Sidebar = ({ role, isSidebarOpen, toggleSidebar, handleLogout }) => {
//   // menu configuration based on role
//   const menuItems = {
//     student: [
//       {
//         to: "/student/dashboard",
//         icon: <GoHome size={18} />,
//         label: "Dashboard",
//       },
//       {
//         to: "/student/events",
//         icon: <GoHome size={18} />,
//         label: "Events",
//       },
//       {
//         to: "/student/all-announcement",
//         icon: <GrAnnounce size={18} />,
//         label: "All Announcement",
//       },
//       {
//         to: "/student/my-announcement",
//         icon: <GrAnnounce size={18} />,
//         label: "Registered Announcement",
//       },
//       {
//         to: "/student/participation-list",
//         icon: <TbRosetteDiscountCheck size={18} />,
//         label: "Your Participation",
//       },
//       {
//         to: "/student/profile",
//         icon: <CgProfile size={18} />,
//         label: "My Profile",
//       },
//     ],
//     tutor: [
//       {
//         to: "/tutor/dashboard",
//         icon: <MdNewspaper size={18} />,
//         label: "Dashboard",
//       },
//       {
//         to: "/tutor/share-questions",
//         icon: <GrAnnounce size={18} />,
//         label: "Shared Question",
//       },
//       {
//         to: "/tutor/profile",
//         icon: <CgProfile size={18} />,
//         label: "Your Profile",
//       },
//     ],
//     president: [
//       {
//         to: "/president/dashboard",
//         icon: <FiEdit size={18} />,
//         label: "Dashboard",
//       },
//       {
//         to: "/president/events",
//         icon: <FiEdit size={18} />,
//         label: "Events",
//       },
//       {
//         to: "/president/profile",
//         icon: <GoHome size={18} />,
//         label: "Profile",
//       },
//     ],
//   };

//   const items = menuItems[role] || [];

//   return (
//     <div className="flex flex-col h-full bg-[#fcfcfc] text-[#22222a] font-sans">
//       {/* Logo Section */}
//       <div className="">
//         <div className="font-bold text-lg h-16 2xl:h-20 p-4 border-b border-[#e4e4e7]">
//           <Link to="/" className="inline-block">
//             <img
//               src={Logo}
//               alt="Site Logo"
//               className="w-28 lg:w-32 transition-all duration-300"
//             />
//           </Link>
//         </div>
//       </div>

//       {/* Mobile Close Button */}
//       <div className="flex justify-end mb-2 lg:hidden p-4">
//         <button
//           onClick={toggleSidebar}
//           className="text-[#22222a] text-2xl hover:text-gradientStart"
//         >
//           <IoMdClose />
//         </button>
//       </div>

//       {/* Menu List */}
//       <nav className="flex-1 mt-6 flex flex-col gap-1 p-4">
//         {items.map((item, index) => (
//           <NavLink
//             key={index}
//             to={item.to}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
//                 isActive
//                   ? "bg-primary text-white"
//                   : "text-[#71717a] hover:bg-[#f0f0fa] hover:text-[#22222a]"
//               }`
//             }
//           >
//             {({ isActive }) => (
//               <>
//                 <span
//                   className={`text-lg ${
//                     isActive ? "text-white" : "text-primary"
//                   }`}
//                 >
//                   {item.icon}
//                 </span>
//                 <span>{item.label}</span>
//               </>
//             )}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Logout Button */}
//       <div className="mt-auto p-4">
//         <button
//           onClick={handleLogout}
//           className="group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#71717a] hover:bg-[#f0f0fa] hover:text-[#22222a] transition-colors w-full text-left"
//         >
//           <MdLogout
//             size={18}
//             className="text-gradientStart group-hover:text-[#22222a] transition-colors"
//           />
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// import { CgProfile } from "react-icons/cg";
// import { FiEdit } from "react-icons/fi";
// import { GoHome } from "react-icons/go";
// import { IoMdClose } from "react-icons/io";
// import { IoSettingsOutline } from "react-icons/io5";
// import { MdLogout, MdNewspaper } from "react-icons/md";
// import { Link, NavLink } from "react-router-dom";
// import Logo from "../assets/logo/logo-blue.svg";

// const Sidebar = ({ role, isSidebarOpen, toggleSidebar, handleLogout }) => {
//   // menu configuration based on role
//   const menuItems = {
//     student: [
//       {
//         to: "/student/dashboard",
//         icon: <GoHome size={20} />,
//         label: "Dashboard",
//       },
//       {
//         to: "/student/all-announcement",
//         icon: <FiEdit size={20} />,
//         label: "All Announcement",
//       },
//       {
//         to: "/student/my-announcement",
//         icon: <FiEdit size={20} />,
//         label: "Registered Announcement",
//       },
//       {
//         to: "/student/participation-list",
//         icon: <MdNewspaper size={20} />,
//         label: "Your Participation",
//       },
//       {
//         to: "/student/profile",
//         icon: <CgProfile size={20} />,
//         label: "My Profile",
//       },
//       { to: "/", icon: <IoSettingsOutline size={20} />, label: "Settings" },
//     ],
//     tutor: [
//       {
//         to: "/tutor/dashboard",
//         icon: <MdNewspaper size={20} />,
//         label: "Dashboard",
//       },
//       {
//         to: "/tutor/share-questions",
//         icon: <MdNewspaper size={20} />,
//         label: "Shared Question",
//       },
//       {
//         to: "/tutor/profile",
//         icon: <CgProfile size={20} />,
//         label: "Your Profile",
//       },
//       { to: "", icon: <IoSettingsOutline size={20} />, label: "Settings" },
//     ],
//     president: [
//       {
//         to: "/president/dashboard",
//         icon: <FiEdit size={20} />,
//         label: "Dashboard",
//       },
//       {
//         to: "/president/profile",
//         icon: <GoHome size={20} />,
//         label: "Profile",
//       },
//       { to: "", icon: <IoSettingsOutline size={20} />, label: "Settings" },
//     ],
//   };

//   // role based menu select
//   const items = menuItems[role] || [];

//   // dynamic top height
//   // const topHeight =
//   //   role === "tutor"
//   //     ? "top-[110px] bottom-[60px]"
//   //     : "top-[68px] md:top-[68px] h-[calc(100%-68px)] md:h-[calc(100%-68px)]";

//   return (
//     <div
//     // className={`fixed ${topHeight} left-0 w-64 flex flex-col justify-between py-8 px-4 transform transition-transform duration-300 z-50 lg:translate-x-0 ${
//     //   isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//     // }`}
//     >
//       {/* logo */}
//       <div className="flex items-center gap-3">
//         <div className="flex items-center justify-center rounded-md font-bold text-lg">
//           <Link to="/" className="inline-block">
//             <img
//               src={Logo}
//               alt="Site Logo"
//               className="w-24 sm:w-28 lg:w-32 transition-all duration-300"
//             />
//           </Link>
//         </div>
//       </div>
//       <div>
//         {/* Mobile Close Button */}
//         <div className="flex justify-end mb-4 lg:hidden">
//           <button onClick={toggleSidebar} className="text-white text-2xl">
//             <IoMdClose />
//           </button>
//         </div>

//         {/* Menu List */}
//         <ul className="text-white space-y-2">
//           {items.map((item, index) => (
//             <li key={index}>
//               {role === "president" ? (
//                 <Link
//                   to={item.to}
//                   className={`flex items-center gap-1 text-base xl:text-lg font-medium py-1 xl:py-2 px-2 w-full rounded transition hover:bg-gray600`}
//                 >
//                   {item.icon} {item.label}
//                 </Link>
//               ) : (
//                 <NavLink
//                   to={item.to}
//                   className={({ isActive }) =>
//                     `flex items-center gap-1 text-base xl:text-lg font-medium py-1 xl:py-2 px-2 w-full rounded transition ${
//                       isActive ? "bg-gray600" : "hover:bg-gray600"
//                     }`
//                   }
//                 >
//                   {item.icon} {item.label}
//                 </NavLink>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Logout Button */}
//       <div>
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-1 text-base xl:text-lg text-left text-white font-medium py-1 xl:py-2 px-2 w-full transition hover:bg-gray600 rounded"
//         >
//           <MdLogout size={20} /> Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
