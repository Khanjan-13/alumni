import React, { useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import API_URL from "../../config";

function EditPosting() {
  const { job_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    description: "",
    location: "",
    job_type: "",
    deadline: "",
    income: "",
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  console.log(job_id)
  useEffect(() => {
    if (job_id) {
      fetchJobDetails();
    }
  }, [job_id]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs/${job_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const job = response.data?.data;
      console.log(response)
      if (job) {
        setFormData({
          title: job.title || "",
          company_name: job.company_name || "",
          description: job.description || "",
          location: job.location || "",
          job_type: job.job_type || "",
          deadline: job.deadline?.split("T")[0] || "", // Ensure date format for input
          income: job.income || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      toast.error("Failed to load job data");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = job_id
        ? `${API_URL}/api/jobs/${job_id}`
        : `${API_URL}/api/jobs/`;

      const method = job_id ? "put" : "post";

      const response = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(`Job ${job_id ? "updated" : "posted"} successfully!`);
        navigate("/my-job-post");
      }
    } catch (error) {
      console.error("Job submission error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-4 md:col-span-1 mt-24">
          <NavLink
            to="/my-job-post"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Back to My Postings
          </NavLink>
        </div>
        <div className="md:col-span-3 mt-24">
          <div className="bg-white shadow border border-blue-100 rounded-sm p-10">
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-10">
              {job_id ? "Edit Job Posting" : "Post a Career Opportunity"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label>Job Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Research Assistant"
                    className="rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label>Company Name</Label>
                  <Input
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="e.g. Infosys"
                    className="rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Delhi, India"
                    className="rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label>Job Type</Label>
                  <Select
                    value={formData.job_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, job_type: value })
                    }
                  >
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder="Select Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label>Income</Label>
                  <Input
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                    placeholder="e.g. ₹10,000/month"
                    className="rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label>Application Deadline</Label>
                  <Input
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="rounded-xl"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label>Job Description</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Briefly describe the role, responsibilities, qualifications, etc."
                    className="min-h-[130px] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 text-lg font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-xl py-6"
                >
                  {loading
                    ? job_id
                      ? "Updating..."
                      : "Posting..."
                    : job_id
                    ? "Update Job"
                    : "Post Job"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPosting;
