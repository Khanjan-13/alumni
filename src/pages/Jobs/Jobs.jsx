import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Filter } from "lucide-react";
import { NavLink } from "react-router-dom";
const jobData = [
  {
    id: 1,
    title: "Graduate Engineer Trainee",
    company: "Hypotenuse Energy",
    location: "Ahmedabad",
    workplace: "On-site",
    experience: "Fresher",
    salary: "INR 15,000 - 22,000 / per month",
    posted: "Posted yesterday",
    applyBy: "Apply by Apr 15, 2025",
    type: "Full Time",
  },
  {
    id: 2,
    title: "Purchase Engineer",
    company: "System Protection",
    location: "Vadodara",
    workplace: "On-site",
    experience: "Not specified",
    salary: "INR 25,000 / per year",
    posted: "Posted 1 month ago",
    applyBy: "Applications closed",
    type: "Full Time",
  },
  {
    id: 3,
    title: "Software Engineer (JAVA)",
    company: "Blueberry Databases",
    location: "Vadodara",
    workplace: "On-site",
    experience: "Not specified",
    salary: "INR 400,000 / per year",
    posted: "Posted 2 weeks ago",
    applyBy: "Open",
    type: "Full Time",
  },
];

function Jobs() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Section */}
        <div className=" p-4 md:col-span-1 mt-24">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <Filter size={20} className="mr-2" /> Filters
          </h3>
          <div className="space-y-3">
            <Input
              placeholder="Search by company, title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <select className="w-full p-2 border rounded">
              <option>Opportunity Type</option>
              <option>Full Time</option>
              <option>Part Time</option>
            </select>
            <select className="w-full p-2 border rounded">
              <option>Location</option>
              <option>Ahmedabad</option>
              <option>Vadodara</option>
            </select>
            <select className="w-full p-2 border rounded">
              <option>Industry</option>
              <option>IT</option>
              <option>Engineering</option>
            </select>
            <select className="w-full p-2 border rounded">
              <option>Experience</option>
              <option>Fresher</option>
              <option>1-3 Years</option>
            </select>
          </div>
        </div>

        {/* Job Listings Section */}
        <div className="md:col-span-3 mt-24">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Opportunities</h2>
            <div className="space-x-2">
              <Button variant="outline">Preferences</Button>
              <NavLink to="/post-jobs"  className="bg-blue-600 text-white">
                + Post an Opportunity
              </NavLink>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {jobData.map((job) => (
              <Card key={job.id} className="p-4 border shadow-sm bg-white">
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                        <MapPin size={16} />
                        <span>
                          {job.location} ({job.workplace})
                        </span>
                        <Briefcase size={16} />
                        <span>{job.experience}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{job.salary}</p>
                      <Badge variant="outline" className="mt-2">
                        {job.posted}
                      </Badge>
                    </div>
                    <Badge className="self-start bg-gray-200 text-gray-700">
                      {job.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;
