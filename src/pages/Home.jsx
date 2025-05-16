import React, { useState, useEffect } from "react";
import {
  Calendar,
  GraduationCap,
  MapPin,
  Newspaper,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "@/components/webComponents/Essentials/Footer";
import NotableAlumni from "@/components/webComponents/Home/NotableAlumni";
import IdentityVerificationPopup from "@/components/webComponents/Home/IdentityVerificationPopup";
import axios from "axios";
import API_URL from "../config"; // Make sure this exports your API base URL

const images = ["/bvm.jpg", "/1.jpg", "/3.jpg", "/4.jpg"];
function Home() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const token = localStorage.getItem("token");
  const [showPopup, setShowPopup] = useState(false);
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

  useEffect(() => {
    const fetchUserAndCheckIdentityFields = async () => {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("token");

      if (email && token) {
        try {
          const response = await axios.get(`${API_URL}/api/users/${email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user = response.data?.data;

          const isAnyFieldMissing =
            !user?.college_proof ||
            !user?.college_id_or_passing_year ||
            !user?.college_proof_public_id;

          console.log("Show popup:", isAnyFieldMissing);

          setShowPopup(isAnyFieldMissing); // ✅ true if any field is missing
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Optional fallback: show popup on fetch error
          // setShowPopup(true);
        }
      }
    };

    fetchUserAndCheckIdentityFields();
  }, []);

  return (
    <>
      {/* Show popup if true */}
      <IdentityVerificationPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      />
      <div className="pt-24">
        <section className="relative text-center  overflow-hidden shadow-xl">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop
            className="w-full h-[500px]"
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        <NotableAlumni />
      </div>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="mx-auto max-w-6xl ">
          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            {/* Hero Section */}

            {/* Upcoming Events */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Upcoming Events
              </h2>

              {loading ? (
                <p className="text-center text-gray-500">Loading events...</p>
              ) : events.length === 0 ? (
                <p className="text-center text-gray-500">No events found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <Card
                      key={event.event_id}
                      className="rounded-md overflow-hidden shadow-md"
                    >
                      {/* Image on top */}
                      <img
                        src={event.media_url || "/placeholder.svg"}
                        alt={event.title || "Event"}
                        className="w-full h-48 object-cover"
                      />

                      {/* Event Content */}
                      <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>

                          <div className="space-y-2 text-sm text-gray-600">
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
                        </div>

                        {/* Status & View Button */}
                        <div className="flex justify-between items-center mt-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              new Date(event.end_time) < new Date()
                                ? "bg-gray-200 text-gray-700"
                                : "bg-green-100 text-green-700"
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
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md">
                              VIEW
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
           
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
