import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Corrected import
import bvm from "@/assets/bvm.jpg";
import API_URL from '../config';

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.success) {
        toast.success("Login successful!");
        console.log(response);

        const { token, user } = response.data;
        const { user_id, role, email } = user;

        // Store JWT token and user info in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("role", role);
        localStorage.setItem("email", email);

        // Navigate based on role
        if (role === "Admin") {
          navigate("/admin/home");
        } else {
          navigate("/"); // Or user-specific route
        }
      }
    } catch (error) {
      // Enhanced error handling
      const errorMessage =
        error.response?.data?.message ||
        error.message || // Fallback for general errors
        "Something went wrong. Please try again.";
      toast.error(errorMessage);

      console.error("Error during login:", error); // Log error for debugging
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-white text-gray-900">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Form Section */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-20">
        {/* Branding */}
       

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto">
           <div className="flex items-center justify-center gap-2 lg:justify-start mb-10 mx-auto">
          <span className="text-xl font-bold tracking-wide mx-auto underline">
            
            BVM Alumni Association
          </span>
        </div>
          <h2 className="text-2xl font-bold mb-6 text-center lg:text-left">
            Log in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-200"
            >
              Log In
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:text-blue-500 underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="relative hidden lg:block">
        <img
          src={bvm}
          alt="Login visual"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default Login;
