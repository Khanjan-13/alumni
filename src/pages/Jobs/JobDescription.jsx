import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Briefcase, MapPin, Calendar, ArrowLeft } from "lucide-react"; // Add icons for visuals
import API_URL from "../../config";
import { useNavigate } from "react-router-dom";

function JobDescription() {
  const { job_id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyStatus, setApplyStatus] = useState("");
  const [isVerified, setIsVerified] = useState(null);
  const [hasApplied, setHasApplied] = useState(false); // Track if the user has already applied
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch job details
    axios
      .get(`${API_URL}/api/jobs/${job_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setJob(res.data.data); // Access the job data
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching job details:", err);
        setLoading(false);
      });

    // Check if user is verified
    if (email) {
      checkUserVerification(email);
    }

    // Check if user has already applied for this job
    if (user_id) {
      checkIfAlreadyApplied();
    }
  }, [job_id, token, email, user_id]);

  const checkUserVerification = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`, // make sure token is available
        },
      });

      const user = response.data;
      if (user.data.status === "Approved") {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    } catch (err) {
      console.error("Error checking user verification status:", err);
      setIsVerified(false);
    }
  };

  const checkIfAlreadyApplied = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs/applied/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Log response to check the data structure
      console.log(response.data);

      // Assuming the response data might be wrapped in a 'data' property, adjust accordingly.
      const appliedJobs = response.data?.data || []; // Ensure it's an array

      // Check if the job_id exists in the applied jobs array
      const isAlreadyApplied = appliedJobs.some(
        (appliedJob) => appliedJob.job_id === job_id
      );

      setHasApplied(isAlreadyApplied);
    } catch (err) {
      console.error("Error checking if user has applied:", err);
    }
  };

  const handleApply = () => {
    if (isVerified) {
      axios
        .post(
          `${API_URL}/api/jobs/apply/${job_id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setApplyStatus("Applied successfully!");
          setHasApplied(true); // Mark the user as applied after a successful application
        })
        .catch((error) => {
          console.error("Error applying for job:", error);
          setApplyStatus("Error applying for job.");
        });
    } else {
      setApplyStatus("You must be verified to apply.");
    }
  };
  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date(); // true if deadline has passed
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto px-4 py-10 mt-16">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : !job ? (
          <div className="text-center text-red-500">Job not found.</div>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-8 border">
            <button
              onClick={() => navigate("/jobs")}
              className="mb-1 flex items-center text-sm text-white transition bg-blue-500 hover:bg-blue-700 p-1 rounded-xl px-3"
            >
              <ArrowLeft className="mr-1" size={18} /> Back
            </button>
            {isVerified === false && (
              <div className="bg-red-400 p-2 border border-l-4 border-red-900 rounded-md">
                <p className="text-white text-sm">
                  Your verification is pending. Please wait for admin approval.
                </p>
              </div>
            )}
            {/* Job Title and Company */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {job.title}
            </h1>
            <p className="text-lg font-semibold text-gray-700 mb-6">
              {job.company_name}
            </p>

            {/* Job Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={20} className="mr-2" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase size={20} className="mr-2" />
                <span>{job.job_type}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={20} className="mr-2" />
                <span>
                  Deadline: {new Date(job.deadline).toLocaleDateString("en-GB")}
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div className="text-gray-700 whitespace-pre-line leading-relaxed mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Job Description
              </h2>
              <p>{job.description}</p>
            </div>

            {/* Salary Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Salary</h3>
              <p className="text-gray-600">{job.income}</p>
            </div>

            {/* Apply Status and Button */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-green-600">
                  {applyStatus}
                </span>
              </div>
              <button
                onClick={handleApply}
                disabled={
                  !isVerified || hasApplied || isDeadlinePassed(job.deadline)
                }
                className={`${
                  !isVerified || hasApplied || isDeadlinePassed(job.deadline)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white px-6 py-2 rounded-xl transition duration-300`}
              >
                {!isVerified
                  ? "Verification Pending"
                  : hasApplied
                  ? "Already Applied"
                  : isDeadlinePassed(job.deadline)
                  ? "Deadline Passed"
                  : "Apply Now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDescription;
