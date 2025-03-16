import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Calendar, Clock, Info } from "lucide-react";

const EventDetail = () => {
  const { slug, id } = useParams(); // Get slug and event_id from the URL
  const [event, setEvent] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://alumni-backend-drab.vercel.app/api/users/events/${id}`, // Fetch event by ID
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
        if (response.data) {
          setEvent(response.data);
        } else {
          console.error("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id, token]);

  if (!event) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg mt-20">
        {/* Event Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {event.data.title}
        </h1>

        {/* Event Image */}
        <div className="w-full">
          <img
            src={event.data.media_url || "/placeholder.svg"}
            alt={event.data.title}
            className="w-full h-auto max-h-screen object-contain my-4"
          />
        </div>

        {/* Event Details */}
        <div className="mt-6 space-y-4 text-gray-700 text-lg">
          <p className="flex items-center gap-2">
            <MapPin className="text-blue-600 w-5 h-5" />
            <span className="font-semibold text-gray-900">Location:</span>{" "}
            {event.data.location}
          </p>

          <p className="flex items-center gap-2">
            <Info className="text-blue-600 w-5 h-5" />
            <span className="font-semibold text-gray-900">
              Description:
            </span>{" "}
            {event.data.description}
          </p>

          <p className="flex items-center gap-2">
            <Calendar className="text-blue-600 w-5 h-5" />
            <span className="font-semibold text-gray-900">
              Start Date:
            </span>{" "}
            {new Date(event.data.start_time).toLocaleDateString("en-GB")}
          </p>

          <p className="flex items-center gap-2">
            <Clock className="text-blue-600 w-5 h-5" />
            <span className="font-semibold text-gray-900">End Date:</span>{" "}
            {event.data.end_time
              ? new Date(event.data.end_time).toLocaleDateString("en-GB")
              : "N/A"}
          </p>
        </div>

        {/* Call to Action Button */}
        <div className="mt-8 flex justify-center">
          <button className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 transition-all">
            Register for Event
          </button>
        </div>
      </div>
    </div>
  );
};
export default EventDetail;
