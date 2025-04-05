import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Corrected import

import bvm from "@/assets/bvm.jpg";


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
        "https://alumni-backend-drab.vercel.app/api/users/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );
  
      if (response.data.success) {
        toast.success("Login successful!");
        console.log(response);
  
        // Store the JWT token and user_id in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", response.data.user.user_id);
  
        navigate("/"); // Redirect user to the dashboard or home page
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
    <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
    style={{
      backgroundImage: `url(${bvm})`,
    }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-blue-900 opacity-50 z-0" />

    {/* React Hot Toast */}
    <Toaster position="top-center" reverseOrder={false} />

    {/* Login Card */}
    <div className="relative z-10 bg-white/20 backdrop-blur-lg shadow-xl rounded-xl w-full max-w-md p-8 border border-white/30">
      <h2 className="text-3xl font-bold text-white text-center mb-6">
        Log In to Your Account
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-white/40 text-white bg-white/10 rounded-lg placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-white/40 text-white bg-white/10 rounded-lg placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Log In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white">
        Don&apos;t have an account?{" "}
        <a
          href="/signup"
          className="text-blue-300 hover:underline hover:text-blue-200"
        >
          Sign Up
        </a>
      </p>
    </div>
  </div>

  );
}

export default Login;

