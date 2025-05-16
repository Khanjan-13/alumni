import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Filter } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import API_URL from '../../config';
function Jobs() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [locationSearch, setLocationSearch] = useState(""); // New state
  const token = localStorage.getItem("token");

  // Fetch job data from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/jobs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("RESPONSE:", response);
        setJobs(response.data.data); // 👈 set the actual job array here
      } catch (error) {
        console.error("ERROR RESPONSE:", error.response);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company_name.toLowerCase().includes(search.toLowerCase());

    const matchesJobType = jobType === "" || job.job_type === jobType;
    const matchesLocation =
      location === "" ||
      job.location.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesJobType && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Section */}
        <div className="p-4 md:col-span-1 mt-24">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <Filter size={20} className="mr-2" /> Filters
          </h3>
          <div className="space-y-3">
            <Input
              placeholder="Search by company, title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />

            <Select
              value={jobType}
              onValueChange={(value) =>
                setJobType(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full rounded">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-Time">Full-Time</SelectItem>
                <SelectItem value="Part-Time">Part-Time</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>

          
                <Input
                  placeholder="Search by Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full"
                />
              
          </div>
        </div>

        {/* Job Listings Section */}
        <div className="md:col-span-3 mt-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Opportunities</h2>
            <div className="space-x-2">
              <NavLink
                to="/my-application"
                className="bg-gray-50 px-4 py-2 rounded border font-medium"
              >
                My Applications
              </NavLink>
              <NavLink
                to="/post-jobs"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                + Post an Opportunity
              </NavLink>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {loading ? (
              <p>Loading jobs...</p>
            ) : filteredJobs.length === 0 ? (
              <p>No jobs found.</p>
            ) : (
              filteredJobs.map((job, index) => (
                <Card key={index} className="p-4 border shadow-sm bg-white">
                  <CardContent>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-gray-600">{job.company_name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                          <MapPin size={16} />
                          <span>{job.location}</span>
                          <Briefcase size={16} />
                          <span>{job.job_type}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          {job.income}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline">
                            Deadline:{" "}
                            {new Date(job.deadline).toLocaleDateString("en-GB")}
                          </Badge>
                        </div>
                      </div>

                      <NavLink
                        to={`/job-application/${job.job_id}`}
                        className="bg-blue-900 hover:bg-blue-700 text-white px-4 py-1 rounded"
                      >
                        View
                      </NavLink>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;
