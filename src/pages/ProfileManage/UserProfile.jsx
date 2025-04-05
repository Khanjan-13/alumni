import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import bvm from "@/assets/bvm.jpg";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user_id } = useParams(); // Get user_id from URL params
  console.log(user_id);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user_id) return; // Prevent API call if user_id is undefined

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://alumni-backend-drab.vercel.app/api/users/profile/all-data/${user_id}`
        );
        console.log(response);
        if (response.status === 200 && response.data?.data) {
          setProfile({
            ...response.data.data?.profileData,
            skills: response.data.data.skills || [],
            user: response.data.data.user || {},
            education: response.data.data.education || [],
            experience: response.data.data.experience || [],
          });
        } else {
          throw new Error("Profile not found");
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user_id]); // ✅ Add user_id as a dependency
  if (loading) return <p className="text-center mt-4">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  return (
    <>
      <section
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bvm})` }}>
        <div className="absolute inset-0 bg-blue-700 bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
          <h1 className="text-5xl font-bold mt-2">Profile</h1>
        </div>
      </section>
      <div className="min-h-screen bg-gray-50 px-4 lg:px-8 ">
        <div className="max-w-5xl mx-auto p-4 grid md:gap-8 md:grid-cols-[350px_1fr] ">
          {/* Profile Section */}
          <Card className="p-8 flex flex-col items-center md:items-start gap-6  bg-white rounded-sm">
            <div className="relative">
              <div className="w-32 h-32 flex items-center justify-center text-3xl font-bold rounded-full">
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
             
            </div>

            {/* Profile Information */}
            <div className="flex flex-col text-center md:text-left">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                {profile.gender && (
                  <span className="text-sm text-blue-700 font-medium bg-blue-100 px-3 py-1 rounded-full">
                    {profile.gender}
                  </span>
                )}
              </div>

              <p className="text-lg text-gray-600 mt-1">
                {profile.degree}, {profile.branch}
              </p>
              <p className="text-gray-500">{profile.institution_name}</p>
              <p className="text-blue-400">{profile.bio}</p>

             
            </div>
          </Card>

          {/* Contact Information */}
          <Card className=" p-4 rounded-sm">
            <div className="flex justify-between">
              <h3 className="font-semibold">Contact Information</h3>
             
            </div>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                <p className="text-gray-700">{profile.user?.email}</p>
                <p className="text-gray-700">{profile.alternate_email}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900">Contact</h4>
                <p className="text-gray-700">
                  {profile.contact_number || "No contact available"}
                </p>
                <p className="text-blue-500 underline">
                  {profile.profile_link}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900">Address</h4>
                <p className="text-gray-700">
                  {profile.current_address || "No address provided"}
                </p>
                <p className="text-gray-700">
                  {profile.taluka + ","} {profile.district + ","}{" "}
                  {profile.state + ","} {profile.country + ","} -{" "}
                  {profile.postal_code}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="mt-4 p-6 rounded-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Education</h3>
              
            </div>
            <CardContent className="space-y-4">
              <div className="">
                <p className="font-semibold text-gray-900">
                  {profile.institution_name}
                </p>
                <p className="text-gray-700 text-sm">
                  {profile.degree}, {profile.branch}
                </p>
                <p className="text-xs text-gray-500">
                  {profile.admission_year} - {profile.graduation_year}
                </p>
              </div>
              <hr />

              {Array.isArray(profile?.education) &&
                profile.education.length > 0 && (
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <div key={edu.education_id}>
                        <p className="font-semibold text-gray-900">
                          {edu.institution_name}
                        </p>
                        <p className="text-gray-700 text-sm">
                          {edu.degree}, {edu.branch}
                        </p>
                        <p className="text-xs text-gray-500">
                          {edu.admission_year} - {edu.graduation_year}
                        </p>
                        <hr className="mt-4" />
                      </div>
                    ))}
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card className="mt-4 p-6 rounded-sm border border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-gray-900">
                Work Experience
              </h3>
             
            </div>
            <CardContent>
              {Array.isArray(profile?.experience) &&
              profile.experience.length > 0 ? (
                <div className="space-y-4">
                  {profile.experience.map((exp) => (
                    <div key={exp.work_id}>
                      <h4 className="font-semibold text-lg text-gray-900">
                        {exp.company_name}
                      </h4>
                      <p className="text-sm text-blue-600 font-medium">
                        {exp.position || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500 ">
                        {new Date(exp.start_date).toLocaleDateString("en-GB")} -
                        {exp.end_date
                          ? new Date(exp.end_date).toLocaleDateString("en-GB")
                          : "Present"}
                      </p>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                        {exp.responsibilities}
                      </p>
                      <hr className="mt-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center text-sm">
                  No work experience added yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Membership */}
          <Card className="mt-4 p-4 rounded-sm">
            <h3 className="font-semibold">Membership</h3>
            <CardContent>
              <p className="text-blue-500">{profile.membership || "N/A"}</p>
            </CardContent>
          </Card>

          <Card className="mt-4 p-4 rounded-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Skills</h3>
             
            </div>
            <CardContent>
              {Array.isArray(profile?.skills) && profile.skills.length > 0 ? (
                <div className="space-y-2">
                  {profile.skills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="p-2 border border-gray-200 rounded-lg flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-800">
                        {skill.skill_name}
                      </span>
                      <span className="text-sm text-blue-600 px-2 py-1 bg-blue-100 rounded-md">
                        {skill.proficiency_level || "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center text-sm">
                  No skills added yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
