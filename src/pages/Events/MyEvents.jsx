import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../config";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // ✅ Correct import added

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!user_id || !token) {
      console.error("User ID or token not found in localStorage.");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/api/users/events/my/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEvents(res.data?.data || []);
        console.log(res.data?.data)
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user events:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-24">My Events</h1>

      {loading ? (
        <p className="text-gray-600">Loading your events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-600">You have not created any events yet.</p>
      ) : (
        <div className="flex overflow-x-auto space-x-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pb-4">
          {events.map((event) => (
            <Card
              key={event.event_id}
              className="min-w-[320px] md:min-w-[500px] overflow-hidden rounded-lg shadow-md flex-shrink-0"
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
                        <span>{event.location || "No location specified"}</span>
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
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                          VIEW
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
