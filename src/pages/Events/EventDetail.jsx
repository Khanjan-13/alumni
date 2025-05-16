import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Calendar, Clock, Info } from "lucide-react";
import API_URL from "../../config";

const EventDetail = () => {
  const { id } = useParams(); // event_id from the URL
  const [event, setEvent] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id"); // Make sure user_id is stored at login
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
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data) setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    const checkRegistration = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/users/events/${id}/registrations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const registeredUsers = response.data?.data || []; // 👈 get array safely

        // Assuming user ID is stored in localStorage
        const user_id = localStorage.getItem("user_id");

        if (Array.isArray(registeredUsers)) {
          const isUserRegistered = registeredUsers.some(
            (user) => user.user_id === user_id
          );
          setIsRegistered(isUserRegistered);
        } else {
          console.warn("Registered users is not an array:", registeredUsers);
        }
      } catch (err) {
        console.error("Error checking registration:", err);
        if (err.response) {
          console.error("Status:", err.response.status);
          console.error("Data:", err.response.data);
        } else {
          console.error("No response received from server.");
        }
      }
    };

    fetchEvent();
    checkRegistration();
  }, [id, token, user_id]);

  const isEventOver =
    event &&
    new Date(event.data.end_time || event.data.start_time) < new Date();

  const handleRegister = async () => {
    setIsRegistering(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/users/events/${id}/register`,
        {
          event_id: id,
          user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Registration successful:", response.data);
      setIsRegistered(true);
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (!event) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg mt-20">
        {isVerified === false && (
          <div className="bg-red-400 p-2 border border-l-4 border-red-900 ">
            <p className="text-white text-sm">
              Your verification is pending. Please wait for admin approval.
            </p>
          </div>
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {event.data.title}
        </h1>

        <div className="w-full">
          <img
            src={event.data.media_url || "/placeholder.svg"}
            alt={event.data.title}
            className="w-full h-auto max-h-screen object-contain my-4"
          />
        </div>

        <div className="mt-6 space-y-4 text-gray-700 text-lg">
          <p className="flex items-center gap-2">
            <MapPin className="text-blue-600 w-5 h-5" />
            <span className="font-semibold text-gray-900">Location:</span>{" "}
            {event.data.location}
          </p>

          <p className="flex items-start gap-2">
            <span className="w-5 h-5 flex-shrink-0 items-center text-blue-600">
              <Info className="w-5 h-5" />
            </span>{" "}
            <span className="font-semibold text-gray-900">Description:</span>{" "}
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

        {/* Registration Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleRegister}
            disabled={
              !isVerified || isEventOver || isRegistering || isRegistered
            }
            className={`px-6 py-3 text-lg font-medium rounded-md shadow transition-all ${
              !isVerified || isEventOver || isRegistered
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {!isVerified
              ? "Verification Pending"
              : isEventOver
              ? "Event Ended"
              : isRegistered
              ? "Registered"
              : isRegistering
              ? "Registering..."
              : "Register for Event"}
          </button>
        </div>

        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default EventDetail;
