import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, ResponsiveContainer
} from 'recharts';
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#845EC2",
  "#FF6F91",
];
import API_URL from "../../config";
import AdminNavbar from "./AdminNavbar";

function AdminAnalytics() {
  const [departmentData, setDepartmentData] = useState([]);
  const [graduationData, setGraduationData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/profile/all`);
        const users = Array.isArray(res.data) ? res.data : res.data.data;

        if (!Array.isArray(users)) {
          console.error("Expected an array but got:", typeof users);
          return;
        }

        // ---- Department-wise Pie Data ----
        const deptCount = users.reduce((acc, user) => {
          const dept = user.branch || "Unknown";
          acc[dept] = (acc[dept] || 0) + 1;
          return acc;
        }, {});
        const deptChartData = Object.entries(deptCount).map(
          ([name, value]) => ({ name, value })
        );

        // ---- Graduation Year Bar Data ----
        const gradCount = users.reduce((acc, user) => {
          const year = user.graduation_year || "Unknown";
          acc[year] = (acc[year] || 0) + 1;
          return acc;
        }, {});
        const gradChartData = Object.entries(gradCount).map(
          ([graduation_year, count]) => ({
            graduation_year,
            count,
          })
        );

        setDepartmentData(deptChartData);
        setGraduationData(gradChartData);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavbar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full p-4">
        {/* Pie Chart for Department */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Users by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {departmentData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <PieTooltip />
              <PieLegend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart for Graduation Year */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">
            Users by Graduation Year
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={graduationData}
              margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="graduation_year" />
              <YAxis />
              <BarTooltip />
              <Bar dataKey="count" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
