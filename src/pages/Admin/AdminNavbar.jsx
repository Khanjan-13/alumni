import React from 'react'
import { useState } from "react"
import { BarChart3, Calendar, Cog, GraduationCap, Home, Mail, Menu, MessageSquare, Users } from "lucide-react"
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button"
function AdminNavbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    
  return (
    <div>
       {/* Sidebar */}
       <div className={`${isSidebarOpen ? "w-64" : "w-16"} bg-card border-r transition-all duration-300 flex flex-col sticky top-0 left-0 h-screen`}>
        <div className="p-4 border-b flex items-center justify-between text-blue-600">
          {isSidebarOpen && <h2 className="font-bold text-xl">Alumni Admin</h2>}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 p-2">
        <ul className="space-y-1 font-semibold text-base ">
          {[
            { to: "/admin/home", label: "Dashboard", icon: <Home className="h-5 w-5 mr-2" /> },
            { to: "/admin/alumni", label: "Alumni", icon: <GraduationCap className="h-5 w-5 mr-2" /> },
            { to: "/admin/events", label: "Events", icon: <Calendar className="h-5 w-5 mr-2" /> },
            { to: "/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5 mr-2" /> },
            { to: "/newsletters", label: "Newsletters", icon: <Mail className="h-5 w-5 mr-2" /> },
            { to: "/analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5 mr-2" /> },
            { to: "/users", label: "Users", icon: <Users className="h-5 w-5 mr-2" /> },
            { to: "/settings", label: "Settings", icon: <Cog className="h-5 w-5 mr-2" /> }
          ].map((item) => (
            <li key={item.to}>
              <NavLink 
                to={item.to} 
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md w-full text-left transition ${
                    isActive ? "bg-blue-100 text-blue-600 font-bold" : "text-gray-950 hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                {isSidebarOpen && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      </div>
    </div>
  )
}

export default AdminNavbar
