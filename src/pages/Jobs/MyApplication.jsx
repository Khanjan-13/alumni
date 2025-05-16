import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Briefcase, Filter } from "lucide-react";
import { NavLink } from "react-router-dom";
import API_URL from '../../config';

function MyApplication() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  useEffect(() => {
    axios
      .get(`${API_URL}/api/jobs/applied/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setApplications(response.data?.data || []); // Use .data.data if wrapped
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 mt-24">
        My Job Applications
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="text-center text-gray-600">
          You haven't applied to any jobs yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {applications.map((app, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold text-indigo-700 mb-1">
                {app.title}
              </h2>
              <p className="text-gray-700 mb-1">{app.company_name}</p>
              <p className="text-sm text-gray-500 mb-2">
                Applied on:{" "}
                {new Date(app.applied_at).toLocaleDateString("en-GB")}
              </p>
              <p className="text-gray-600 line-clamp-3">
                
                <span className="flex items-center gap-2"><Briefcase size={16} /> {app.job_type}</span>
              </p>
              <p className="text-sm text-gray-700 mt-1"><strong>Salary:</strong> {app.income}</p>
              <div className="mt-4 flex justify-end">
                <NavLink
                  to={`/job-application/${app.job_id}`}
                
                  rel="noopener noreferrer"
                  className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition"
                >
                  View Job
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplication;
