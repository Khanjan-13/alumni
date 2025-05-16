import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import toast, { Toaster } from "react-hot-toast";
import API_URL from '../../../config';

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    marital_status: "",
    dob: "",
    taluka: "",
    district: "",
    postal_code: "",
    state: "",
    country: "",
    alternate_email: "",
    institution_name: "Birla Vishvakarma Mahavidyalaya",
    degree: "",
    admission_year: "",
    graduation_year: "",
    branch: "",
    current_address: "",
    office_address: "",
    contact_number: "",
    alternate_contact_number: "",
    bio: "",
    profile_image: null, // Store file object
  });
  const [previewUrl, setPreviewUrl] = useState(null); // Store image preview
  const [isProfileExists, setIsProfileExists] = useState(false);
  const [profileId, setProfileId] = useState(null); // Store profile_id

  // Cleanup function to revoke object URL when the component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_image: file, // Store the file
      }));

      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!token) {
          toast.error("Authentication token is missing. Please log in again.");
          return;
        }
        if (!userId) {
          toast.error("User ID is missing. Please log in again.");
          return;
        }
        const response = await axios.get(
          `${API_URL}/api/users/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
        if (response.status === 200 && response.data?.data) {
          const profileData = response.data.data.profileData || {};
          setFormData((prevState) => ({ ...prevState, ...profileData }));

          if (profileData.profile_id) {
            setProfileId(profileData.profile_id); // Store profile_id
            setIsProfileExists(true);
          }
        } else {
          toast.error("Failed to load profile data.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error(
          error.response?.data?.message || "Error loading profile data."
        );
      }
    };

    fetchProfileData();
  }, [token, userId]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      if (!token || !userId) {
        toast.error("Authentication token or User ID is missing.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("user_id", userId);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("marital_status", formData.marital_status);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("taluka", formData.taluka);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("postal_code", formData.postal_code);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("alternate_email", formData.alternate_email);
      formDataToSend.append("institution_name", formData.institution_name);
      formDataToSend.append("degree", formData.degree);
      formDataToSend.append("admission_year", formData.admission_year);
      formDataToSend.append("graduation_year", formData.graduation_year);
      formDataToSend.append("branch", formData.branch);
      formDataToSend.append("current_address", formData.current_address);
      formDataToSend.append("office_address", formData.office_address);
      formDataToSend.append("contact_number", formData.contact_number);
      formDataToSend.append(
        "alternate_contact_number",
        formData.alternate_contact_number
      );
      formDataToSend.append("bio", formData.bio);

      // Append profile image only if a new one is selected
      if (formData.profile_image) {
        formDataToSend.append("media", formData.profile_image); // Ensure this matches backend expectations
      }

      let response;

      if (isProfileExists && profileId) {
        // Update existing profile
        response = await axios.put(
          `${API_URL}/api/users/profile/${profileId}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            validateStatus: function (status) {
              return status >= 200 && status < 500; // Accept status codes between 200 and 499
            },
          }
        );

        if (response.status === 400) {
          throw new Error(
            response.data?.message ||
              "Bad Request - Please check your input data"
          );
        }

        console.log("Update Response:", response);
      } else {
        // Create new profile
        response = await axios.post(
          `${API_URL}/api/users/profile`,
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 201 && response.data?.data?.profile_id) {
          setProfileId(response.data.data.profile_id); // Store new profile_id
          setIsProfileExists(true);
        }
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          isProfileExists ? "Profile updated!" : "Profile created!"
        );
      } else {
        toast.error("Profile update failed.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating profile."
      );
    }
  };

  return (
    <div className="mx-auto">
      <Toaster position="top-right" />

      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <label className="block text-gray-700">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Show Image Preview if Selected */}
            {previewUrl && (
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}

            <div className="mb-4">
              <img
                src={formData.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Full Name</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            {/* <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={inputHandler}
          className="w-full p-2 border rounded-lg bg-gray-200"
        />
      </div> */}

            <div className="mb-4">
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Marital Status</label>
              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Date of Birth</label>
              <Input
                type="date"
                name="dob"
                value={formData.dob?.split("T")[0] || ""}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
                max={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18)
                  )
                    .toISOString()
                    .split("T")[0]
                } // Must be at least 18 years old
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Taluka</label>
              <Input
                type="text"
                name="taluka"
                value={formData.taluka}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">District</label>
              <Input
                type="text"
                name="district"
                value={formData.district}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Postal Code</label>
              <Input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">State</label>
              <Input
                type="text"
                name="state"
                value={formData.state}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Country</label>
              <Input
                type="text"
                name="country"
                value={formData.country}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Alternate Email</label>
              <Input
                type="text"
                name="alternate_email"
                value={formData.alternate_email}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Institution Name</label>
              <Input
                type="text"
                name="institution_name"
                value={formData.institution_name}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Degree</label>
              <Input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Admission Year</label>
              <Input
                type="number"
                name="admission_year"
                value={formData.admission_year}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Graduation Year</label>
              <Input
                type="number"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Branch</label>
              <Input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Current Address</label>
              <Input
                type="text"
                name="current_address"
                value={formData.current_address}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Office Address</label>
              <Input
                type="text"
                name="office_address"
                value={formData.office_address}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Contact Number</label>
              <Input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">
                Alternate Contact Number
              </label>
              <Input
                type="text"
                name="alternate_contact_number"
                value={formData.alternate_contact_number}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* <div className="mb-4">
        <label className="block text-gray-700">City</label>
        <Input
          type="text"
          name="city"
          value={formData.city || ""}
          onChange={inputHandler}
          className="w-full p-2 border rounded-lg"
        />
      </div> */}

            <div className="mb-4">
              <label className="block text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={inputHandler}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {isProfileExists ? "Update Profile" : "Create Profile"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
