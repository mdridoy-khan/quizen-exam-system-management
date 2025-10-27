import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import HeaderDashboard from "../components/HeaderDashboard";
import Sidebar from "../components/Sidebar";
import { UserLogout } from "../utils/UserLogout";

const StudentLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // handle logout
  const handleLogout = () => {
    UserLogout(navigate);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf7f0] text-[#22222a] font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] flex-col h-full bg-[#fcfcfc] border-r border-[#ececee] gap-8">
        <Sidebar
          role="student"
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-[#fcfcfc] flex flex-col gap-8 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <Sidebar
          role="student"
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Same as CommonLayout) */}
        <HeaderDashboard userRole="student" />

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#F0F0F0] px-2 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;

// import { useState } from "react";
// import { HiMenu } from "react-icons/hi";
// import { Outlet, useNavigate } from "react-router-dom";
// import HeaderDashboard from "../components/HeaderDashboard";
// import Sidebar from "../components/Sidebar";
// import { UserLogout } from "../utils/UserLogout";

// const StudentLayout = () => {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   // handle logout
//   const handleLogout = () => {
//     UserLogout(navigate);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Fixed Header */}
//       <div className="fixed top-0 left-0 w-full z-50">
//         <HeaderDashboard />
//       </div>

//       <div className="flex flex-1 pt-[64px]">
//         {/* Sidebar */}
//         {/* <div
//           className={`fixed top-[68px] md:top-[68px] left-0 h-[calc(100%-68px)] md:h-[calc(100%-68px)] bg-black600 w-64 flex flex-col justify-between py-8 px-4 transform transition-transform duration-300 z-50
//             lg:translate-x-0
//             ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
//         >
//           <div>

//             <div className="flex justify-end mb-4 lg:hidden">
//               <button onClick={toggleSidebar} className="text-white text-2xl">
//                 <IoMdClose />
//               </button>
//             </div>

//             <ul className="text-white space-y-2">
//               <li>
//                 <NavLink
//                   to="/student/dashboard"
//                   className={({ isActive }) =>
//                     `flex items-center gap-1 text-base xl:text-lg font-medium py-1 xl:py-2 px-2 w-full rounded transition ${
//                       isActive ? "bg-gray600" : "hover:bg-gray600"
//                     }`
//                   }
//                 >
//                   <GoHome size={20} /> Dashboard
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/student/all-announcement"
//                   className={({ isActive }) =>
//                     `flex items-center gap-1 text-base xl:text-lg font-medium py-1 xl:py-2 px-2 w-full rounded transition ${
//                       isActive ? "bg-gray600" : "hover:bg-gray600"
//                     }`
//                   }
//                 >
//                   <FiEdit size={20} /> All Announcement
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/student/my-announcement"
//                   className={({ isActive }) =>
//                     `flex items-center gap-1 text-base xl:text-lg font-medium py-1 xl:py-2 px-2 w-full rounded transition ${
//                       isActive ? "bg-gray600" : "hover:bg-gray600"
//                     }`
//                   }
//                 >
//                   <FiEdit size={20} /> Registared Announcement
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/student/participation-list"
//                   className={({ isActive }) =>
//                     `flex items-center gap-1 text-base xl:text-lg font-medium py-1 xl:py-2 px-2 w-full rounded transition ${
//                       isActive ? "bg-gray600" : "hover:bg-gray600"
//                     }`
//                   }
//                 >
//                   <MdNewspaper size={20} /> Your Participation
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/student/profile"
//                   className={({ isActive }) =>
//                     `flex items-center gap-1 text-base xl:text-lg font-medium py-1 xl:py-2 px-2 w-full rounded transition ${
//                       isActive ? "bg-gray600" : "hover:bg-gray600"
//                     }`
//                   }
//                 >
//                   <CgProfile size={20} /> My Profile
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/"
//                   className={({ isActive }) =>
//                     `flex items-center gap-1 text-base xl:text-lg font-medium py-1 xl:py-2 px-2 w-full rounded transition ${
//                       isActive ? "bg-gray600" : "hover:bg-gray600"
//                     }`
//                   }
//                 >
//                   <IoSettingsOutline size={20} /> Settings
//                 </NavLink>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-1 text-base xl:text-lg text-left text-white font-medium py-1 xl:py-2 px-2 w-full transition hover:bg-gray600 rounded"
//             >
//               <MdLogout size={20} /> Logout
//             </button>
//           </div>
//         </div> */}

//         <Sidebar
//           role="student"
//           isSidebarOpen={isSidebarOpen}
//           toggleSidebar={toggleSidebar}
//           handleLogout={handleLogout}
//         />

//         {/* Main Content */}
//         <main className="flex-1 lg:ml-44 mt-10 ">
//           {/* Mobile Menu Button */}
//           <div className="mb-8 lg:hidden">
//             <button onClick={toggleSidebar} className="text-2xl text-black600">
//               <HiMenu />
//             </button>
//           </div>

//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default StudentLayout;
