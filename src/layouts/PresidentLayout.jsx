import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import HeaderDashboard from "../components/HeaderDashboard";
import Sidebar from "../components/Sidebar";
import { UserLogout } from "../utils/UserLogout";

const PresidentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // const navigate = useNavigate();
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const isActive = (path) => location.pathname === path;

  // logout function
  // async function handleLogout() {
  //   try {
  //     const refresh = localStorage.getItem("refresh");
  //     console.log("refresh", refresh);
  //     if (refresh) {
  //       await API.post("/auth/logout/", { refresh: refresh });
  //     }
  //     localStorage.removeItem("accessToken");
  //     localStorage.removeItem("refresh");
  //     localStorage.removeItem("userData");

  //     navigate("/login");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  const handleLogout = () => {
    UserLogout(navigate);
  };

  return (
    <div>
      <div className="flex h-screen overflow-hidden bg-[#faf7f0] text-[#22222a] font-sans">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-[280px] flex-col h-full bg-[#fcfcfc] border-r border-[#ececee] gap-8">
          <Sidebar
            role="president"
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
            role="president"
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            handleLogout={handleLogout}
          />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header (Same as CommonLayout) */}
          <HeaderDashboard userRole="president" />

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-[#F0F0F0] px-4 xl:px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default PresidentLayout;
