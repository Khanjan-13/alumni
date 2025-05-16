import React, { useState } from "react";
import axios from "axios";
import API_URL from "../../../config"; // Make sure this exports your API base URL

export default function IdentityVerificationPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [college_id_or_passing_year, setcollege_id_or_passing_year] =
    useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user_id = localStorage.getItem("user_id");
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("college_id_or_passing_year", college_id_or_passing_year);
      formData.append("media", image); // ✅ correct key name for image

      const response = await axios.post(
        `${API_URL}/api/users/add-additional-info`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server response:", response.data);
      onClose(); // close popup on success
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Alumni Identity Verification
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* College ID or Passing Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College ID / Passing Year
            </label>
            <input
              type="text"
              required
              value={college_id_or_passing_year}
              onChange={(e) => setcollege_id_or_passing_year(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="e.g. 22IT407 or 2023"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm  text-gray-700 mb-1">
              <span className="font-medium">Upload ID Proof Image</span> <span className="text-sm ">(Eg. Marksheet, Id card, Fee Receipt, etc.)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
