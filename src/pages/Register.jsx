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
function Register() {
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
            "https://alumni-backend-drab.vercel.app/api/users/register",
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Toaster position="top-right" reverseOrder={false} />
          <div className="bg-white shadow-lg w-full max-w-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Create an Account
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Select
                  onValueChange={handleRoleChange}
                  value={formData.userType}
                  disabled={formData.isStudentEmail || formData.isFacultyEmail} // Disable if student or faculty
                >
                  <SelectTrigger>
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
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign Up
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline hover:text-blue-700"
              >
                Log In
              </a>
            </p>
          </div>
        </div>
      );
    }

export default Register
