import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import toast, { Toaster } from "react-hot-toast";

function ProfileEducation() {
  const [educationList, setEducationList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [formData, setFormData] = useState({
    institution_name: "",
    degree: "",
    admission_year: "",
    graduation_year: "",
    branch: "",
    description: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserEducation(storedUserId);
    } else {
      toast.error("User ID not found. Please log in again.");
    }
  }, []);

  const fetchUserEducation = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        return;
      }

      const response = await axios.get(
        `https://alumni-backend-drab.vercel.app/api/users/education/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && Array.isArray(response.data.data)) {
        setEducationList(response.data.data);
      } else {
        setEducationList([]);
      }
    } catch (error) {
      toast.error("Error fetching education records.");
      setEducationList([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (education) => {
    setEditingEducationId(education.education_id);
    setFormData({
      institution_name: education.institution_name,
      degree: education.degree,
      admission_year: education.admission_year,
      graduation_year: education.graduation_year,
      branch: education.branch,
      description: education.description || "",
    });
  };

  const handleDelete = async (educationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this education record?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        return;
      }

      const response = await axios.delete(
        `https://alumni-backend-drab.vercel.app/api/users/education/${educationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Education deleted successfully!");
        setEducationList(
          educationList.filter((edu) => edu.education_id !== educationId)
        );
      } else {
        toast.error("Failed to delete education record.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.institution_name ||
      !formData.degree ||
      !formData.branch ||
      !formData.admission_year ||
      !formData.graduation_year
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }
    console.log("done");
    if (
      parseInt(formData.admission_year) > parseInt(formData.graduation_year)
    ) {
      toast.error("Start year cannot be later than end year.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      return;
    }

    try {
      let response;
      if (editingEducationId) {
        response = await axios.put(
          `https://alumni-backend-drab.vercel.app/api/users/education/${editingEducationId}`,
          { user_id: userId, ...formData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "https://alumni-backend-drab.vercel.app/api/users/education",
          { user_id: userId, ...formData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        toast.success(
          editingEducationId
            ? "Education updated successfully!"
            : "Education added successfully!"
        );
        fetchUserEducation(userId);
        setEditingEducationId(null);
        setFormData({
          institution_name: "",
          degree: "",
          admission_year: "",
          graduation_year: "",
          branch: "",
          description: "",
        });
      } else {
        toast.error("Failed to save education.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mx-auto">
      <Toaster position="top-right" />
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>
            {editingEducationId ? "Edit Education" : "Add Your Education"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="institution_name"
              placeholder="Institution Name"
              value={formData.institution_name}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="degree"
              placeholder="Degree"
              value={formData.degree}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                name="admission_year"
                placeholder="Start Year"
                value={formData.admission_year}
                onChange={handleChange}
                required
              />
              <Input
                type="number"
                name="graduation_year"
                placeholder="End Year"
                value={formData.graduation_year}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              type="text"
              name="branch"
              placeholder="Branch"
              value={formData.branch}
              onChange={handleChange}
              required
            />

            <Input
              type="text"
              name="description"
              placeholder="Description (Optional)"
              value={formData.description}
              onChange={handleChange}
            />

            <Button type="submit">
              {editingEducationId ? "Update Education" : "Add Education"}
            </Button>
          </form>

          <Separator className="my-4" />

          <h3 className="text-lg font-semibold mb-2">Your Education</h3>
          {educationList.map((edu) => (
            <div
              key={edu.education_id}
              className="flex justify-between bg-gray-100 p-2 rounded-md"
            >
              <div>
                {edu.institution_name} - {edu.degree} ({edu.branch})
              </div>
              <div>
                <Button size="sm" onClick={() => handleEdit(edu)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDelete(edu.education_id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileEducation;
