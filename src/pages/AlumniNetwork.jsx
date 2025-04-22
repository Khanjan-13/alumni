import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Mail, MessageCircle } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const AlumniNetwork = () => {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get(
          "https://alumni-backend-drab.vercel.app/api/users/profile/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API Response:", response.data); // Debugging log

        // Access the array inside `data`
        if (Array.isArray(response.data.data)) {
          setAlumni(response.data.data);
          setFilteredAlumni(response.data.data);
        } else {
          console.error(
            "Invalid API response: Expected an array inside 'data'"
          );
        }
      } catch (error) {
        console.error("Error fetching alumni data:", error);
      }
    };

    fetchAlumni();
  }, [token]);

  useEffect(() => {
    let filtered = alumni.filter(
      (alum) =>
        alum.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedBranch ? alum.branch === selectedBranch : true)
    );
    setFilteredAlumni(filtered);
  }, [searchQuery, selectedBranch, alumni]);

  const branches = ["Computer Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Information Technology"];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6 mt-24">
        {/* Sidebar */}
        <div className="space-y-6  p-4 ">
          <div className="fixed">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="fixed w-52">
            <h2 className="font-semibold mt-7 mb-2">Filter by Branch</h2>
            <div className="space-y-2">
              {branches.map((branch) => (
                <Button
                  key={branch}
                  variant={selectedBranch === branch ? "default" : "outline"}
                  className="w-full"
                  onClick={() =>
                    setSelectedBranch(branch === selectedBranch ? "" : branch)
                  }
                >
                  {branch}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Alumni Grid */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.length > 0 ? (
            filteredAlumni.map((alum) => (
              <Card
                key={alum.profile_id}
                className="shadow-md rounded-lg overflow-hidden border bg-white"
              >
                {/* Portrait-style image */}
                <img
                  src={alum.photo}
                  alt={alum.name}
                  className="w-full h-48 object-cover"
                />

                <CardContent className="p-4 text-center relative">
                  <h3 className="text-lg font-semibold">{alum.name}</h3>
                  <p className="text-gray-500">
                    Class of {alum.graduation_year}
                  </p>
                  <p className="text-gray-500">
                    {alum.degree}, {alum.branch}
                  </p>
                  <p className="text-gray-500">
                    {alum.district}, {alum.state}
                  </p>

                  {/* Floating Chat Icon */}
                  <div className="absolute top-0 right-2 -mt-4">
                    <div className="bg-white rounded-full p-2 shadow-md">
                      <Mail className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>

                {/* View More Button */}
                <div className="border-t p-3 text-center">
                  <NavLink to={`/profile/${alum.user_id}`}>
                    <button className="text-blue-600 font-medium flex items-center justify-center w-full">
                      View more <span className="ml-1">→</span>
                    </button>
                  </NavLink>
                </div>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No alumni found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniNetwork;
