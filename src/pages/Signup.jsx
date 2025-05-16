import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import bvm from "@/assets/bvm.jpg";
import API_URL from '../config';

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    isStudentEmail: false,
    isFacultyEmail: false,
  });

  // Function to check email format
  const checkEmailFormat = (email) => {
    const studentMatch = email.match(
      /^(\d{2}[a-zA-Z]{2}\d{3})@bvmengineering\.ac\.in$/
    );
    const facultyMatch = email.match(
      /^([a-zA-Z]+\.[a-zA-Z]+)@bvmengineering\.ac\.in$/
    );

    if (studentMatch)
      return { userType: "student", isStudent: true, isFaculty: false };
    if (facultyMatch)
      return { userType: "faculty", isStudent: false, isFaculty: true };
    return { userType: "", isStudent: false, isFaculty: false };
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      const { userType, isStudent, isFaculty } = checkEmailFormat(value);
      setFormData({
        ...formData,
        email: value,
        userType,
        isStudentEmail: isStudent,
        isFacultyEmail: isFaculty,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle role change manually (only if NOT student or faculty email)
  const handleRoleChange = (value) => {
    if (!formData.isStudentEmail && !formData.isFacultyEmail) {
      setFormData({ ...formData, userType: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/users/register`,
        {
          email: formData.email,
          password: formData.password,
          user_type: formData.userType,
        }
      );

      if (response.data.success) {
        toast.success("Registration successful!");
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          userType: "",
          isStudentEmail: false,
        });
      } else {
        toast.error(response.data.message || "Failed to register.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
 <div className="grid min-h-screen lg:grid-cols-2 bg-white text-gray-900">
  <Toaster position="top-center" reverseOrder={false} />

  {/* Left Form Section */}
   <div className="relative hidden lg:block">
    <img
      src={bvm}
      alt="Sign up visual"
      className="absolute inset-0 h-full w-full object-cover"
    />
  </div>

   {/* Right Side Image */}
  <div className="flex flex-col justify-center px-6 py-12 lg:px-20">
  

    {/* Form Container */}
    <div className="w-full max-w-md mx-auto">
        {/* Branding */}
    <div className="flex items-center justify-center gap-2 lg:justify-start mb-10">
      <span className="text-xl font-semibold tracking-wide mx-auto">
        BVM Alumni Association
      </span>
    </div>
      <h2 className="text-2xl font-bold mb-6 text-center lg:text-left">
        Create your account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <Select
            onValueChange={handleRoleChange}
            value={formData.userType}
            disabled={formData.isStudentEmail || formData.isFacultyEmail}
          >
            <SelectTrigger className="bg-white text-gray-900 border border-gray-300">
              <SelectValue placeholder={formData.userType || "Select Role"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alumni">Alumni</SelectItem>
              <SelectItem value="faculty" disabled={formData.isFacultyEmail}>
                Faculty {formData.isFacultyEmail ? "(Auto-Selected)" : ""}
              </SelectItem>
              <SelectItem value="alumni-faculty">Alumni/Faculty</SelectItem>
              <SelectItem value="student" disabled={formData.isStudentEmail}>
                Student {formData.isStudentEmail ? "(Auto-Selected)" : ""}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            Confirm Password
          </label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-200"
        >
          Sign Up
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:text-blue-500 underline">
          Log In
        </a>
      </p>
    </div>
  </div>

 
 
</div>


  );
}

export default Signup;
