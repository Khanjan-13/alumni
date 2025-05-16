import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Calendar, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import API_URL from "../config";
function Event() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const [isVerified, setIsVerified] = useState(null);
  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email) {
      checkUserVerification(email);
    }
  }, []);

  const checkUserVerification = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`, // make sure token is available
        },
      });

      const user = response.data;
      console.log(user);
      if (user.data.status === "Approved") {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    } catch (err) {
      console.error("Error checking user verification status:", err);
      setIsVerified(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/events/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data.data); // Assuming API response contains { data: [...] }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  // Filter events based on search query
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mt-24">
          {/* Sidebar */}
          <div className="space-y-6 md:col-span-1 ">
            {/* <Button
              className="bg-blue-900 hover:bg-blue-700 fixed"
              onClick={() => navigate("/my-events")}
            >
              {" "}
              <CalendarDays className="h-4 w-4" />
              My Events
            </Button> */}
            <div className=" max-w-md mx-auto fixed">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by title..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6 mt-10 md:mt-0">
            {isVerified === false && (
              <div className="bg-red-400 p-2 border border-l-4 border-red-900 ">
                <p className="text-white text-sm">
                  Your verification is pending. Please wait for admin approval.
                </p>
              </div>
            )}
            {loading ? (
              <p>Loading events...</p>
            ) : filteredEvents.length === 0 ? (
              <p>No events found.</p>
            ) : (
              filteredEvents.map((event) => (
                <Card
                  key={event.event_id}
                  className="overflow-hidden rounded-lg shadow-md"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Event Image */}
                      <div className="w-full md:w-1/3 h-40 md:h-52">
                        <img
                          src={event.media_url || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover rounded-t-lg md:rounded-none md:rounded-l-lg"
                        />
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-semibold">
                          {event.title}
                        </h3>
                        <div className="space-y-2 text-gray-600 text-sm md:text-base mt-2">
                          {/* Start & End Date */}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span>
                              Starts:{" "}
                              {new Date(event.start_time).toLocaleDateString(
                                "en-GB"
                              )}
                              {event.end_time &&
                                ` • Ends: ${new Date(
                                  event.end_time
                                ).toLocaleDateString("en-GB")}`}
                            </span>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-500" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        {/* Status & View Button */}
                        <div className="flex justify-between items-center mt-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              new Date(event.end_time) < new Date()
                                ? "bg-gray-300 text-gray-700"
                                : "bg-green-200 text-green-700"
                            }`}
                          >
                            {new Date(event.end_time) < new Date()
                              ? "Past Event"
                              : "Upcoming Event"}
                          </span>

                          <Link
                            to={`/events/${event.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}/${event.event_id}`}
                          >
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2">
                              VIEW
                            </Button>
                          </Link>
                        </div>
                      </div>
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

export default Event;
