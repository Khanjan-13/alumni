import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const PostJobForm = () => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://alumni-backend-drab.vercel.app/api/jobs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Job posted successfully!");
        setFormData({
          title: "",
          company_name: "",
          description: "",
          location: "",
          job_type: "",
          deadline: "",
          income: "",
        });
      }
    } catch (error) {
      toast.error("Error posting job.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
          Post a Job Opportunity
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Job Title</Label>
            <Input
              name="title"
              placeholder="e.g. Software Engineer"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Company Name</Label>
            <Input
              name="company_name"
              placeholder="e.g. Google"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              name="location"
              placeholder="e.g. Bangalore, India"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Job Type</Label>
            <Input
              name="job_type"
              placeholder="e.g. Full-Time, Internship"
              value={formData.job_type}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Income</Label>
            <Input
              name="income"
              placeholder="e.g. ₹6,00,000/year"
              value={formData.income}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Deadline</Label>
            <Input
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              placeholder="Describe the job role and responsibilities..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Job"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostJobForm;
