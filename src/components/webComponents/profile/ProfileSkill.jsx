import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import toast, { Toaster } from "react-hot-toast";
import {
  Pencil,
  Trash
} from "lucide-react";
import API_URL from '../../../config';

function ProfileSkill() {
  const [skills, setSkills] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null); // Track skill being edited
  const [formData, setFormData] = useState({
    user_id: "",
    skill_name: "",
    proficiency_level: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      setFormData((prev) => ({ ...prev, user_id: storedUserId }));
      fetchUserSkills(storedUserId);
    } else {
      toast.error("User ID not found. Please log in again.");
    }
  }, []);

  const fetchUserSkills = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/users/skills/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && Array.isArray(response.data.data)) {
        setSkills(response.data.data);
      } else {
        setSkills([]);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      setSkills([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, skill_name: e.target.value });
  };

  const handleProficiencyChange = (value) => {
    setFormData({ ...formData, proficiency_level: value });
  };

  const handleEdit = (skill) => {
    setEditingSkillId(skill.skill_id);
    setFormData({
      user_id: userId,
      skill_name: skill.skill_name,
      proficiency_level: skill.proficiency_level,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.skill_name || !formData.proficiency_level) {
      toast.error("Please fill out all fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      return;
    }

    try {
      if (editingSkillId) {
        // Update existing skill
        const response = await axios.put(
          `${API_URL}/api/users/skills/${editingSkillId}`,
          { skill_name: formData.skill_name, proficiency_level: formData.proficiency_level },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          toast.success("Skill updated successfully!");
          setSkills(
            skills.map((skill) =>
              skill.skill_id === editingSkillId
                ? { ...skill, skill_name: formData.skill_name, proficiency_level: formData.proficiency_level }
                : skill
            )
          );
          setEditingSkillId(null); // Reset editing mode
        } else {
          toast.error("Failed to update skill.");
        }
      } else {
        // Add new skill
        const response = await axios.post(
          `${API_URL}/api/users/skills`,
          { user_id: userId, skill_name: formData.skill_name, proficiency_level: formData.proficiency_level },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          toast.success("Skill added successfully!");
          setSkills([...skills, { skill_id: response.data.id, ...formData }]);
        } else {
          toast.error("Failed to add skill.");
        }
      }

      // Reset form after submission
      setFormData({ user_id: userId, skill_name: "", proficiency_level: "" });
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = async (skillId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}/api/users/skills/${skillId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Skill deleted successfully!");
        setSkills(skills.filter((skill) => skill.skill_id !== skillId));
      } else {
        toast.error("Failed to delete skill.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mx-auto">
      <Toaster position="top-right" />
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>{editingSkillId ? "Edit Skill" : "Add Your Skills"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Skill Name</label>
              <Input type="text" placeholder="Enter skill" value={formData.skill_name} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Proficiency Level</label>
              <Select onValueChange={handleProficiencyChange} value={formData.proficiency_level}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white">
              {editingSkillId ? "Update Skill" : "Add Skill"}
            </Button>
          </form>

          <Separator className="my-4" />

          <h3 className="text-lg font-semibold mb-2">Your Skills</h3>
          {skills.length === 0 ? (
            <p className="text-gray-500">No skills added yet.</p>
          ) : (
            <ul className="space-y-2">
              {skills.map((skill) => (
                <li key={skill.skill_id} className="flex justify-between items-center bg-gray-100 p-2 ">
                  <div className="space-x-2">
                    <span className="font-medium">{skill.skill_name}</span> 
                    <span className="text-sm text-gray-700 bg-gray-300 rounded-sm p-1">{skill.proficiency_level}</span>
                  </div>
                  <div className="space-x-2">
                    <Button size="sm" className="bg-color-none hover:bg-gray-200 text-gray-900" onClick={() => handleEdit(skill)}>
                    <Pencil />
                    </Button>
                    <Button size="sm" className="bg-color-none hover:bg-gray-200 text-red-900" onClick={() => handleDelete(skill.skill_id)}>
                    <Trash />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileSkill;
