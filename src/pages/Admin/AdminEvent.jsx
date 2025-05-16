import { useState, useEffect } from "react";
import axios from "axios";

import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import AdminNavbar from "./AdminNavbar";
import API_URL from "../../config";

function AdminEvent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    created_by: "",
  });

  const [editEvent, setEditEvent] = useState(null);
  const [eventImage, setEventImage] = useState(null);

  //Pagination
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = events.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [registrationCounts, setRegistrationCounts] = useState({});

  const checkRegistration = async (event_id) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/users/events/${event_id}/registration-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const count = response.data?.data || 0;
      console.log(count);
      setRegistrationCounts((prev) => ({
        ...prev,
        [event_id]: count,
      }));
    } catch (err) {
      console.error(`Error fetching registrations for event ${event_id}:`, err);
      setRegistrationCounts((prev) => ({
        ...prev,
        [event_id]: "Error",
      }));
    }
  };
  useEffect(() => {
    events.forEach((event) => {
      checkRegistration(event.event_id);
    });
  }, [events]);

  //Date
  const [currentDateTime, setCurrentDateTime] = useState("");
  useEffect(() => {
    const now = new Date();
    const localISOTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16); // "YYYY-MM-DDTHH:MM"
    setCurrentDateTime(localISOTime);
  }, []);

  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/events/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Events:", response.data);
        setEvents(response.data.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events!");
      }
    };

    fetchEvents();
  }, []);

  // Function to handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImage(file);
    }
  };

  // Function to add event
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start_time || !newEvent.end_time) {
      toast.error("Title, Start Time, and End Time are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("description", newEvent.description);
    formData.append("location", newEvent.location);
    formData.append("start_time", newEvent.start_time);
    formData.append("end_time", newEvent.end_time);
    formData.append("created_by", user_id); // Replace with dynamic user data

    // Append image using correct key
    if (eventImage) {
      formData.append("media", eventImage);
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/users/events`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error("Invalid response format");
      }

      const addedEvent = response.data.data;

      // Convert event time to UTC
      addedEvent.start_time = new Date(addedEvent.start_time).toISOString();
      addedEvent.end_time = new Date(addedEvent.end_time).toISOString();

      // Add new event to state
      setEvents((prevEvents) => [...prevEvents, addedEvent]);

      toast.success("Event added successfully!");
      setIsAddDialogOpen(false);

      // Reset input fields
      setNewEvent({
        title: "",
        description: "",
        location: "",
        start_time: "",
        end_time: "",
      });

      setEventImage(null); // Reset image state
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add event!");
    }
  };

  const handleEditClick = (event) => {
    setEditEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleEditEvent = async () => {
    if (
      !editEvent ||
      !editEvent.title ||
      !editEvent.start_time ||
      !editEvent.end_time
    ) {
      toast.error("Title, Start Time, and End Time are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", editEvent.title);
    formData.append("description", editEvent.description);
    formData.append("location", editEvent.location);
    formData.append("start_time", editEvent.start_time);
    formData.append("end_time", editEvent.end_time);

    if (eventImage) {
      formData.append("media", eventImage);
    }

    console.log("Sending FormData:", [...formData.entries()]);

    try {
      const response = await axios.put(
        `${API_URL}/api/users/events/${editEvent.event_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update Response:", response.data);

      if (response.status === 200) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.event_id === editEvent.event_id ? response.data.data : event
          )
        );

        toast.success("Event updated successfully!");
        setIsEditDialogOpen(false);
        setEditEvent(null);
        setEventImage(null);
      }
    } catch (error) {
      console.error("Error updating event:", error.response?.data || error);
      toast.error("Failed to update event!");
    }
  };

  // Function to delete event
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`${API_URL}/api/users/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.event_id !== eventId)
      );
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event!");
    }
  };

  const today = new Date().toISOString().slice(0, 16); // format: "YYYY-MM-DDTHH:MM"
  const formatForDateTimeInput = (dateString) => {
    const date = new Date(dateString);
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavbar />

      <div className="flex flex-col items-center w-full p-6 flex-1 overflow-auto">
        <div className="flex justify-between w-full">
          <h1 className="text-2xl font-bold">Event Management</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Enter event details below.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <Label>Title</Label>
                <Input
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />

                <Label>Description</Label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />

                <Label>Location</Label>
                <Input
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                />

                <Label>Start Time</Label>
                <Input
                  type="datetime-local"
                  min={currentDateTime}
                  value={newEvent.start_time}
                  onChange={(e) => {
                    const selectedStart = e.target.value;
                    setNewEvent((prev) => ({
                      ...prev,
                      start_time: selectedStart,
                      // Auto-correct end_time if it's earlier than new start_time
                      end_time:
                        prev.end_time && prev.end_time < selectedStart
                          ? selectedStart
                          : prev.end_time,
                    }));
                  }}
                />

                <Label>End Time</Label>
                <Input
                  type="datetime-local"
                  min={newEvent.start_time || currentDateTime}
                  value={newEvent.end_time}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      end_time: e.target.value,
                    }))
                  }
                />

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Upload Image
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange} // This correctly updates eventImage state
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleAddEvent}>Add Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Events Table */}
        <div className="rounded-sm mt-7 border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gradient-to-r from-blue-900 to-blue-800">
              <TableRow>
                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                  Sr No
                </TableHead>
                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                  Image
                </TableHead>
                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                  Title
                </TableHead>
                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                  Start Time
                </TableHead>
                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                  End Time
                </TableHead>
                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                  Location
                </TableHead>
                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                  No. of Attendees
                </TableHead>
                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 text-center uppercase tracking-wide">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentEvents.length > 0 ? (
                currentEvents.map((event, index) => (
                  <TableRow
                    key={event.event_id}
                    className={
                      index % 2 === 0
                        ? "bg-white hover:bg-blue-50 transition-all duration-300"
                        : "bg-gray-50 hover:bg-blue-50 transition-all duration-300"
                    }
                  >
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {event.media_url && (
                        <img
                          src={event.media_url}
                          alt="Event"
                          className="w-16 h-16 rounded object-cover shadow"
                        />
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-700">
                      {event.title}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600">
                      {new Date(event.start_time).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600">
                      {new Date(event.end_time).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-700">
                      {event.location}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-700">
                      {registrationCounts[event.event_id] ?? "Loading..."}
                    </TableCell>

                    <TableCell className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-blue-100 p-2 rounded-full transition"
                          onClick={() => handleEditClick(event)}
                        >
                          <Pencil className="h-4 w-4 text-blue-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-100 p-2 rounded-full transition"
                          onClick={() => {
                            const confirmed = window.confirm(
                              "Are you sure you want to delete this event?"
                            );
                            if (confirmed) {
                              handleDeleteEvent(event.event_id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-sm text-gray-500"
                  >
                    No Events Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &larr;
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              className={
                currentPage === page
                  ? "bg-blue-900 text-white"
                  : "text-blue-500"
              }
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            &rarr;
          </Button>
        </div>
      </div>

      {/* Edit Event Dialog */}
      {editEvent && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <Label>Title</Label>
              <Input
                value={editEvent.title}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, title: e.target.value })
                }
              />
            </div>
            <Label>Description</Label>
            <Textarea
              value={editEvent.description}
              onChange={(e) =>
                setEditEvent({ ...editEvent, description: e.target.value })
              }
            />

            <Label>Location</Label>
            <Input
              value={editEvent.location}
              onChange={(e) =>
                setEditEvent({ ...editEvent, location: e.target.value })
              }
            />

            <Label>Start Time</Label>
            <Input
              type="datetime-local"
              min={currentDateTime}
              value={formatForDateTimeInput(editEvent.start_time)}
              onChange={(e) => {
                const selectedStart = e.target.value;
                setEditEvent((prev) => ({
                  ...prev,
                  start_time: selectedStart,
                  end_time:
                    prev.end_time && prev.end_time < selectedStart
                      ? selectedStart
                      : prev.end_time,
                }));
              }}
            />

            <Label>End Time</Label>
            <Input
              type="datetime-local"
              min={editEvent.start_time || currentDateTime} // End time can't be before start time
              value={formatForDateTimeInput(editEvent.end_time)}
              onChange={(e) =>
                setEditEvent({ ...editEvent, end_time: e.target.value })
              }
            />

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Upload Image
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange} // This correctly updates eventImage state
                className="col-span-3"
              />
            </div>

            <DialogFooter>
              <Button onClick={handleEditEvent}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default AdminEvent;
