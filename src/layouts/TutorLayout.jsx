import { useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import HeaderDashboard from "../components/HeaderDashboard";
import Sidebar from "../components/Sidebar";
import { UserLogout } from "../utils/UserLogout";

const TutorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navigate = useNavigate();

  // handle logout
  const handleLogout = () => {
    UserLogout(navigate);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1 text-base xl:text-lg font-medium py-1 xl:py-2 px-2 w-full transition rounded ${
      isActive
        ? "bg-gray-600 text-white"
        : "text-white hover:bg-gray-600 hover:text-white"
    }`;

  return (
    <div>
      <div className="flex h-screen overflow-hidden bg-[#faf7f0] text-[#22222a] font-sans">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-[280px] flex-col h-full bg-[#fcfcfc] border-r border-[#ececee] gap-8">
          <Sidebar
            role="tutor"
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
            role="tutor"
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            handleLogout={handleLogout}
          />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header (Same as CommonLayout) */}
          <HeaderDashboard userRole="tutor" />

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-[#F0F0F0] px-4 xl:px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default TutorLayout;
