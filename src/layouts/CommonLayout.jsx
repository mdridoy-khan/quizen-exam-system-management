// App.jsx
import { useEffect, useState } from "react";
import {
  FaBars,
  FaBell,
  FaChevronDown,
  FaCog,
  FaEdit,
  FaSearch,
  FaThLarge,
} from "react-icons/fa";

function CommonLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [recentOpen, setRecentOpen] = useState({}); // track open/close state per recent section

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const recentQuizzes = [
    { name: "Winter Announcement", count: 150 },
    { name: "World Environment Day", count: 89 },
    { name: "Public Holiday", count: 76 },
  ];

  const toggleRecent = (index) => {
    setRecentOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[hsl(42,50%,96%)] text-[hsl(240,10%,15%)] font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] flex-col h-full bg-[hsl(0,0%,99%)] border-r border-[hsl(240,6%,93%)] p-4 gap-8">
        <Logo />
        <UserProfile />
        <NavMenu />
        <RecentSection
          recentQuizzes={recentQuizzes}
          recentOpen={recentOpen}
          toggleRecent={toggleRecent}
        />
      </aside>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-[hsl(0,0%,99%)] p-4 flex flex-col gap-8 transform transition-transform duration-300 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <Logo />
        <UserProfile />
        <NavMenu />
        <RecentSection
          recentQuizzes={recentQuizzes}
          recentOpen={recentOpen}
          toggleRecent={toggleRecent}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-[hsl(42,50%,96%)] to-[hsl(48,100%,98%)] p-6 lg:p-8">
          <ProfileContent />
        </main>
      </div>
    </div>
  );
}

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-[hsl(243,75%,59%)] text-white flex items-center justify-center rounded-md font-bold text-lg">
      Q
    </div>
    <span className="text-2xl font-bold">QUIZEN</span>
  </div>
);

const UserProfile = () => (
  <div className="flex items-center gap-3 p-4 bg-[hsl(243,50%,96%)] rounded-xl">
    <div className="w-12 h-12 bg-[hsl(243,75%,59%)] text-white flex items-center justify-center rounded-full font-semibold text-sm">
      ST
    </div>
    <div className="flex flex-col gap-1 min-w-0">
      <span className="font-semibold text-sm truncate">Mr. Sanket Trivedi</span>
      <span className="text-xs text-[hsl(240,4%,46%)] truncate">
        Sanket@gmail.com
      </span>
    </div>
  </div>
);

const NavMenu = () => (
  <nav className="flex flex-col gap-1">
    <NavItem icon={<FaThLarge />} label="Dashboard" active />
    <NavItem icon={<FaCog />} label="Settings" badge={5} />
  </nav>
);

const NavItem = ({ icon, label, badge, active }) => (
  <a
    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-[hsl(243,75%,59%)] text-white"
        : "text-[hsl(240,4%,46%)] hover:bg-[hsl(243,50%,96%)] hover:text-[hsl(240,10%,15%)]"
    } relative`}
    href="#"
  >
    {icon}
    <span>{label}</span>
    {badge && (
      <span
        className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${
          active
            ? "bg-white/20 text-white"
            : "bg-[hsl(243,60%,95%)] text-[hsl(243,75%,59%)]"
        }`}
      >
        {badge}
      </span>
    )}
  </a>
);

const RecentSection = ({ recentQuizzes, recentOpen, toggleRecent }) => (
  <div className="flex flex-col gap-2">
    <button
      className="flex items-center justify-between w-full px-4 py-3 text-xs font-semibold text-[hsl(240,4%,46%)] rounded-lg hover:bg-[hsl(243,50%,96%)]"
      onClick={() => toggleRecent(0)}
    >
      <span>Recently Published Quizzes</span>
      <FaChevronDown
        className={`transition-transform ${
          recentOpen[0] ? "rotate-0" : "-rotate-90"
        }`}
      />
    </button>
    <div
      className={`flex flex-col gap-1 pl-2 ${
        recentOpen[0] ? "flex" : "hidden"
      }`}
    >
      {recentQuizzes.map((quiz, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-[hsl(243,50%,96%)]"
        >
          <span className="text-xs">{quiz.name}</span>
          <span className="text-[12px] font-semibold text-[hsl(240,4%,46%)]">
            {quiz.count}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const Header = ({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  activeTab,
  setActiveTab,
}) => (
  <header className="flex items-center gap-6 px-6 h-16 bg-white border-b border-[hsl(240,6%,90%)]">
    <button
      className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[hsl(240,5%,96%)]"
      onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
    >
      <FaBars />
    </button>
    <div className="relative flex-1 max-w-xs">
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(240,4%,46%)] text-sm" />
      <input
        type="text"
        placeholder="Search for Quizzes"
        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[hsl(240,6%,90%)] focus:border-[hsl(243,75%,59%)] focus:ring-[hsl(243,75%,59%)] focus:ring-1 outline-none bg-[rgba(0,0,0,0.02)]"
      />
    </div>

    <div className="hidden lg:flex gap-1">
      {["Dashboard", "Winter Announcement", "Closed Quiz"].map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            activeTab === tab
              ? "text-[hsl(240,10%,15%)]"
              : "text-[hsl(240,4%,46%)]"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>

    <div className="ml-auto flex items-center gap-4">
      <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[hsl(240,5%,96%)]">
        <FaBell />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[hsl(0,84%,60%)]"></span>
      </button>
      <div className="w-9 h-9 bg-[hsl(243,75%,59%)] text-white flex items-center justify-center rounded-full font-semibold text-sm">
        ST
      </div>
    </div>
  </header>
);

const ProfileContent = () => (
  <div className="flex flex-col">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
      <h1 className="text-2xl lg:text-3xl font-bold">Profile</h1>
      <button className="flex items-center gap-2 px-4 py-2 bg-[hsl(243,75%,59%)] text-white rounded-lg font-medium hover:bg-[hsl(243,75%,55%)]">
        <span>Edit Profile</span>
        <FaEdit />
      </button>
    </div>
    <div className="flex justify-center items-center min-h-[400px] text-[hsl(240,4%,46%)] text-center">
      <svg
        className="w-12 h-12 mx-auto mb-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M7 2L2 7l5 5 3-3-2-2 4-4z" />
        <path d="M17 2l5 5-5 5-3-3 2-2-4-4z" />
        <path d="M12 7l-3 3 3 3 3-3z" />
        <path d="M7 17l-5 5 5 5 3-3-2-2 4-4z" />
        <path d="M17 17l5 5-5 5-3-3 2-2-4-4z" />
      </svg>
      <p className="text-sm">Profile content goes here</p>
    </div>
  </div>
);

export default CommonLayout;
