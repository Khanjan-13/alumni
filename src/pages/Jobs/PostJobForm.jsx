import React, { useEffect, useState } from "react";
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
import { NavLink } from "react-router-dom";
import API_URL from "../../config";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(null);
  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email) {
      checkUserVerification(email);
    }
  }, []);

  const checkUserVerification = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`, // make sure token is available
        },
      });

      const user = response.data;
      console.log(user);
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
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_URL}/api/jobs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Job posted successfully!");
        console.log(response);
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
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 ">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-4 md:col-span-1 mt-24">
          {/* Back Button */}
          <button
            onClick={() => navigate("/jobs")}
            className="mb-5 flex items-center text-sm text-white transition bg-blue-500 hover:bg-blue-700 p-1 rounded-xl px-3"
          >
            <ArrowLeft className="mr-1" size={18} /> Back
          </button>
          <NavLink
            to="/my-job-post"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            My Postings
          </NavLink>
        </div>
        <div className="md:col-span-3 mt-24">
          <div className=" mx-auto  bg-white shadow border border-blue-100 rounded-sm p-10">
            <Toaster position="top-center" reverseOrder={false} />

            {isVerified === false && (
              <div className="bg-red-400 p-2 border border-l-4 border-red-900 ">
                <p className="text-white text-sm">
                  Your verification is pending. Please wait for admin approval.
                </p>
              </div>
            )}
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-7">
              Post a Career Opportunity
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-700">Job Title</Label>
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
                  <Label className="text-sm text-gray-700">Company Name</Label>
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
                  <Label className="text-sm text-gray-700">Location</Label>
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
                  <Label className="text-sm text-gray-700 mb-1 block">
                    Job Type
                  </Label>
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
                  <Label className="text-sm text-gray-700">Income</Label>
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
                  <Label className="text-sm text-gray-700">
                    Application Deadline
                  </Label>
                  <Input
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="rounded-xl"
                    required
                    min={new Date().toISOString().split("T")[0]} // Set min date as today
                  />
                </div>

                <div>
                  <Label className="text-sm text-gray-700">
                    Job Description
                  </Label>
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

              {/* Button Section (Full Width) */}
              <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
                <Button
                  type="submit"
                  disabled={loading || !isVerified}
                  className="w-1/2 text-lg font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-xl py-6"
                >
                  {loading
                    ? "Posting..."
                    : !isVerified
                    ? "Verification Pending"
                    : "Post Job"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobForm;
