import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import { NavLink } from "react-router-dom";
import API_URL from "../../../config";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

const ProfileHome = () => {
  const handleDownload = () => {
    const card = document.getElementById("membership-id-card");
    html2canvas(card, { useCORS: true }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${profile.name}_ID_Card.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/users/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
        if (response.status === 200 && response.data?.data) {
          setProfile({
            ...response.data.data?.profileData, // Spread all user data
            skills: response.data.data.skills || [], // Ensure skills are an array
            user: response.data.data.user || [], // Ensure work_experience are an array
            education: response.data.data.education || [], // Ensure work_experience are an array
            experience: response.data.data.experience || [], // Ensure work_experience are an array
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
  }, [userId]);

  if (loading) return <p className="text-center mt-4">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <section
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: "url('bvm.jpg')" }}
      >
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
              <Button
                size="icon"
                className="absolute bottom-2 right-2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition" 
                      onClick={() => navigate("/settings")}
              >
                <Pencil size={18} className="text-gray-700" />
              </Button>
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

              {/* Alumni Card Button */}
              {/* <Button
                variant="outline"
                className="mt-4 text-blue-600 border-blue-600 hover:bg-blue-50 transition"
              >
                + Request Alumni Card
              </Button> */}
            </div>
          </Card>

          {/* Contact Information */}
          <Card className=" p-4 rounded-sm">
            <div className="flex justify-between">
              <h3 className="font-semibold">Contact Information</h3>
              <NavLink
                to="/settings"
                variant="ghost "
                className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
              >
                Edit <Pencil size={16} className="ml-2" />
              </NavLink>
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
              <NavLink
                to="/settings"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
              >
                <PlusCircle size={16} /> Add Education
              </NavLink>
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
              <NavLink
                to="/settings"
                variant="ghost "
                className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
              >
                <PlusCircle size={18} className="ml-2" />
                Add Work
              </NavLink>
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

          {/* Card */}
          <Card className="mt-6 p-6 rounded-md shadow-lg">
            <div
              id="membership-id-card"
              className="relative w-full max-w-md mx-auto p-6 border border-blue-200 rounded-md bg-white shadow-lg"
              style={{
                backgroundImage: "url('/bvm.jpg')", // BVM image from the public folder
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay to make the background lighter and allow content to pop */}
              <div className="absolute inset-0 bg-white opacity-80 rounded-md"></div>

              {/* Card Content */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <img
                  src={profile.photo || "/profile.jpg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/profile.jpg";
                  }}
                />
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-gray-600 font-bold">
                  {profile.degree || "Department"}
                </p>
                <p className="text-gray-600 font-bold">
                  {profile.branch || "Branch"}
                </p>
                <p className="text-gray-600 font-bold">
                  {profile.graduation_year || "Year"}
                </p>
                {/* Alumni ID Field */}
                <div className="mt-2 text-[10px] text-gray-700">
                  Alumni ID: {profile.user_id}
                </div>
                {profile.membership && (
                  <span className="mt-2 text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                    {profile.membership}
                  </span>
                )}
              </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download size={16} />
                Download ID
              </Button>
            </div>
          </Card>

          <Card className="mt-4 p-4 rounded-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Skills</h3>
              <NavLink
                to="/settings"
                variant="ghost "
                className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
              >
                <PlusCircle size={16} className="ml-2" />
                Add Skills
              </NavLink>
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
};

export default ProfileHome;
