import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import API_URL from '../../../config';

function ProfileWork() {
  const [formData, setFormData] = useState({
    company_name: "",
    position: "",
    start_date: "",
    end_date: "",
    responsibilities: "",
  });

  const [experiences, setExperiences] = useState([]);

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchExperiences = async () => {
      if (!userId || !token) {
        console.error("User ID or token is missing. Cannot fetch experiences.");
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/users/experience/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetched experiences:", response.data);

        if (response.data?.success && Array.isArray(response.data.data)) {
          setExperiences(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
          toast.error("Failed to fetch experiences.");
          setExperiences([]);
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
        toast.error("An error occurred while fetching experiences.");
        setExperiences([]);
      }
    };

    fetchExperiences();
  }, [userId, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !token) {
      toast.error("User authentication is missing. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/users/experience`,
        { ...formData, user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setExperiences((prev) => [...prev, response.data.data]);
        setFormData({
          company_name: "",
          position: "",
          start_date: "",
          end_date: "",
          responsibilities: "",
        });
        toast.success("Work experience added successfully!");
      } else {
        toast.error("Failed to add experience. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting experience:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Toaster position="top-right" reverseOrder={false} />
      <Card className="shadow-md border rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Add Your Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="company_name"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleChange}
              required
            />
            <Input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
            <Input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="responsibilities"
              placeholder="Responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
            >
              Add Experience
            </Button>
          </form>

          <Separator className="my-4" />
          <h3 className="text-lg font-semibold mb-2">Your Work Experiences</h3>
          {experiences.length === 0 ? (
            <p className="text-gray-500">No experiences added yet.</p>
          ) : (
            <ul className="space-y-4">
              {experiences.map((exp, index) => (
                <li
                  key={index}
                  className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <strong className="text-lg text-gray-800">
                        {exp.company_name}
                      </strong>
                      <span className="block text-gray-600">
                        {exp.position}
                      </span>
                    </div>
                    <span className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-md">
                      {new Date(exp.start_date).toLocaleDateString("en-GB")} -
                      {exp.end_date
                        ? new Date(exp.end_date).toLocaleDateString("en-GB")
                        : "Present"}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700 text-sm leading-relaxed border-t pt-2">
                    {exp.responsibilities}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileWork;
