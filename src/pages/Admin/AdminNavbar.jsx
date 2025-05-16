import React from "react";
import { useState } from "react";
import {
  Home,
  Users,
  Calendar,
  Mail,
  BarChart3,
  Cog,
  MessageSquare,
  FileText,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Menu,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
function AdminNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({
    contents: false,
    jobs: false,
  });
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("../login");
  };
  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <>
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-card bg-gray-50 border-r transition-all duration-300 flex flex-col sticky top-0 left-0 h-screen`}
      >
        <div className="p-4 border-b flex items-center justify-between text-blue-600">
          {isSidebarOpen && <h2 className="font-bold text-xl">Alumni Admin</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 p-2">
          <ul className="space-y-1 font-semibold text-base">
            <li>
              <NavLink
                to="/admin/home"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md w-full text-left transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-bold"
                      : "text-gray-950 hover:bg-gray-100"
                  }`
                }
              >
                <Home className="h-5 w-5 mr-2" />
                {isSidebarOpen && <span>Dashboard</span>}
              </NavLink>
            </li>


            {/* Manage Contents Dropdown */}
            <li>
              <button
                onClick={() => toggleDropdown("contents")}
                className="flex items-center px-3 py-2 rounded-md w-full text-left hover:bg-gray-100 transition text-gray-950"
              >
                <Users className="h-5 w-5 mr-2" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1">Manage Users</span>
                    {openDropdowns.contents ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </>
                )}
              </button>
              {openDropdowns.contents && isSidebarOpen && (
                <ul className="ml-8 space-y-1 mt-1">
                  <li>
                    <NavLink
                      to="/admin/alumni"
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-md w-full text-left transition ${
                          isActive
                            ? "bg-blue-100 text-blue-600 font-bold"
                            : "text-gray-950 hover:bg-gray-100"
                        }`
                      }
                    >
                      All Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/pending-alumni"
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-md w-full text-left transition ${
                          isActive
                            ? "bg-blue-100 text-blue-600 font-bold"
                            : "text-gray-950 hover:bg-gray-100"
                        }`
                      }
                    >
                      Pending Auth Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/rejected-alumni"
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-md w-full text-left transition ${
                          isActive
                            ? "bg-blue-100 text-blue-600 font-bold"
                            : "text-gray-950 hover:bg-gray-100"
                        }`
                      }
                    >
                      Rejected Users
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            {/* <li>
              <NavLink
                to="/admin/memberships"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md w-full text-left transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-bold"
                      : "text-gray-950 hover:bg-gray-100"
                  }`
                }
              >
                <Mail className="h-5 w-5 mr-2" />
                {isSidebarOpen && <span>Memberships</span>}
              </NavLink>
            </li> */}

            <li>
              <NavLink
                to="/admin/events"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md w-full text-left transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-bold"
                      : "text-gray-950 hover:bg-gray-100"
                  }`
                }
              >
                <Calendar className="h-5 w-5 mr-2" />
                {isSidebarOpen && <span>Events</span>}
              </NavLink>
            </li>

            {/* Jobs Dropdown */}
            <li>
              <button
                onClick={() => toggleDropdown("jobs")}
                className="flex items-center px-3 py-2 rounded-md w-full text-left hover:bg-gray-100 transition text-gray-950"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1">Jobs</span>
                    {openDropdowns.jobs ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </>
                )}
              </button>
              {openDropdowns.jobs && isSidebarOpen && (
                <ul className="ml-8 space-y-1 mt-1">
                  <li>
                    <NavLink
                      to="/admin/jobs"
                      className="block px-2 py-1 text-sm text-gray-700 hover:text-blue-600"
                    >
                      Posted Jobs
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/rejected-jobs"
                      className="block px-2 py-1 text-sm text-gray-700 hover:text-blue-600"
                    >
                      Rejected Jobs
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md w-full text-left transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-bold"
                      : "text-gray-950 hover:bg-gray-100"
                  }`
                }
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                {isSidebarOpen && <span>Analytics</span>}
              </NavLink>
            </li>

            <li>
              <Button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md w-full text-left bg-blue-900 hover:bg-blue-800 transition-colors duration-200 text-white"
              >
                <LogOut className="h-5 w-5 mr-2" />
                {isSidebarOpen && <span>Logout</span>}
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default AdminNavbar;
