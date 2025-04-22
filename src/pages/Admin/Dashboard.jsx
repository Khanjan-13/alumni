import { useState, useEffect } from "react";
import { Users, BarChart2, Mail, UploadCloud } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "./AdminNavbar";
import NewUsers from "@/components/webComponents/AdminHome/NewUsers";

export default function Dashboard() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token"); // or sessionStorage.getItem("token")

      if (!token) {
        console.error("No token found. User might not be authenticated.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "https://alumni-backend-drab.vercel.app/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res);
        setCounts(res.data.data.counts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cardData = counts
    ? [
        {
          count: counts.total_users,
          label: "Total Users",
          action: "View",
        },
        {
          count: counts.total_profiles,
          label: "Total Profiles",
          action: "Check",
        },
        {
          count: counts.users_last_month,
          label: "New Users Last Month",
          action: "Review",
        },
        {
          count: counts.profiles_updated_last_month,
          label: "Profiles Updated Last Month",
          action: "Inspect",
        },
        {
          count: counts.memberships_last_month,
          label: "New Memberships Last Month",
          action: "Manage",
        },
      ]
    : [];

  const handleActionClick = (action) => {
    switch (action) {
      case "View":
        navigate("/admin/alumni");
        break;
      case "Check":
        navigate("/admin/profiles");
        break;
      case "Review":
        navigate("/admin/new-users");
        break;
      case "Inspect":
        navigate("/admin/updated-profiles");
        break;
      case "Manage":
        navigate("/admin/memberships");
        break;
      default:
        break;
    }
  };
  return (
    <div className="flex min-h-screen bg-background bg-gray-100 ">
      {/* Sidebar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-8">
        {/* Top Actions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Important actions to complete
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cardData.map(({ count, label, action }, i) => {
              const colors = [
                "bg-red-100 text-red-800",
                "bg-pink-100 text-pink-800",
                "bg-yellow-100 text-yellow-800",
                "bg-orange-100 text-orange-800",
                "bg-blue-100 text-blue-800",
              ];
              const color = colors[i % colors.length];

              return (
                <div
                  key={i}
                  className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 p-4 rounded-xl text-left border border-gray-200"
                >
                  <div
                    className={`inline-block px-3 py-1 rounded-md font-bold mb-2 text-2xl ${color}`}
                  >
                    {count}
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{label}</p>
                  <button
                    onClick={() => handleActionClick(action)}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
                  >
                    {action}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Pending for Authentication </h2>
          <NewUsers />
        </section>
        {/* Analytics */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Top analytics of this month
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Profile Records", value: 32889 },
              { title: "New Profiles", value: 25 },
              { title: "Mails Sent", value: 1901 },
              { title: "Profiles Updated", value: 105 },
              { title: "Visitors", value: 464 },
              { title: "Time Spent", value: "107.99h" },
            ].map(({ title, value }, i) => (
              <div
                key={i}
                className="bg-white shadow-md p-4 rounded-md text-center"
              >
                <h3 className="text-xl font-bold text-blue-800">{value}</h3>
                <p className="text-gray-600">{title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fast Access */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Fast Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Users />, label: "View Directory" },
              { icon: <BarChart2 />, label: "Start a Campaign" },
              { icon: <Mail />, label: "Send Mail" },
              { icon: <UploadCloud />, label: "Upload Photos" },
            ].map(({ icon, label }, i) => (
              <div
                key={i}
                className="bg-white shadow-md p-4 rounded-md flex flex-col items-center hover:bg-blue-50 transition"
              >
                <div className="text-blue-700 mb-2">{icon}</div>
                <p className="text-sm text-center text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
