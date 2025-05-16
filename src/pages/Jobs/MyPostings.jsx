import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Pencil, Trash2, ArrowLeft } from "lucide-react";
import API_URL from "../../config";
import axios from "axios";

function MyPostings() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const fetchJobs = () => {
    axios
      .get(`${API_URL}/api/jobs/my/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setApplications(response.data?.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        // toast.error("Failed to load job postings");
        setLoading(false);
      });
  };

  const handleEdit = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  const handleDelete = (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;

    axios
      .delete(`${API_URL}/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Job deleted successfully");
        fetchJobs(); // Refresh list
      })
      .catch((error) => {
        console.error("Delete error:", error);
        // toast.error("Failed to delete job");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-5xl mx-auto mt-24">
        {/* Back Button */}
        <button
          onClick={() => navigate("/post-jobs")}
          className="mb-6 flex items-center text-sm text-white transition bg-blue-500 hover:bg-blue-700 p-1 rounded-xl px-3"
        >
          <ArrowLeft className="mr-1" size={18} /> Back
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          My Job Postings
        </h1>

        {/* Job List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <p className="text-center text-gray-500">No job postings found.</p>
        ) : (
          <div className="grid gap-4">
            {applications.map((job) => (
              <Card key={job.job_id} className="border shadow-sm bg-white transition hover:shadow-md">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    {/* Left Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {job.title}
                      </h3>
                      <p className="text-gray-600">{job.company}</p>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
                        <span className="flex items-center">
                          <MapPin size={16} className="mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Briefcase size={16} className="mr-1" />
                          {job.job_type}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm mt-2">
                        {job.description?.substring(0, 120)}...
                      </p>

                      <Badge variant="outline" className="mt-3">
                        Deadline:{" "}
                        {new Date(job.deadline).toLocaleDateString("en-GB")}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col justify-between items-end space-y-2">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(job.job_id)}
                          className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-800 text-sm border border-blue-100 rounded-md transition"
                        >
                          <Pencil size={16} className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job.job_id)}
                          className="flex items-center px-3 py-1 text-red-600 hover:text-red-800 text-sm border border-red-100 rounded-md transition"
                        >
                          <Trash2 size={16} className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPostings;
