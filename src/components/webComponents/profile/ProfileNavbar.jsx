import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import PersonalInfo from "@/components/webComponents/profile/ProfileDetails";
import ProfileSkill from "./ProfileSkill";
import ProfileWork from "./ProfileWork";
import ProfileEducation from "./ProfileEducation";

function ProfileNavbar() {
  const [activeSection, setActiveSection] = useState("Profile Details");

  return (
    <>
      <nav className="space-y-2 max-h-max bg-white border p-4 shadow-sm sticky top-0">
        <ul className="space-y-1">
          {[
           
            "Profile Details",
            "Work Experience",
            "Education",
            "Skills",
          ].map((item) => (
            <li key={item}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-left font-medium hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
                  activeSection === item
                    ? "bg-blue-100 rounded-sm text-blue-700"
                    : ""
                }`}
                onClick={() => setActiveSection(item)}
              >
                {item}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* {activeSection === "Profile Photo" && <ProfilePhoto />} */}
        {activeSection === "Profile Details" && <PersonalInfo />}
        {activeSection === "Work Experience" && <ProfileWork />}
        {activeSection === "Education" && <ProfileEducation />}
        {activeSection === "Skills" && <ProfileSkill />}
      </div>
    </>
  );
}

export default ProfileNavbar;
// Dummy Components (Replace with actual components)
const ProfilePhoto = () => (
  <h2 className="text-lg font-semibold">Profile Photo Section</h2>
);

const WorkExperience = () => (
  <h2 className="text-lg font-semibold">Work Experience Section</h2>
);
const Education = () => (
  <h2 className="text-lg font-semibold">Education Section</h2>
);
const AccountSettings = () => (
  <h2 className="text-lg font-semibold">Account & Password Section</h2>
);
