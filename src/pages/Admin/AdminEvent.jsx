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

  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://alumni-backend-drab.vercel.app/api/users/events/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
        "https://alumni-backend-drab.vercel.app/api/users/events",
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
  if (!editEvent || !editEvent.title || !editEvent.start_time || !editEvent.end_time) {
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
    formData.append("image", eventImage);
  }

  console.log("Sending FormData:", [...formData.entries()]);

  try {
    const response = await axios.put(
      `https://alumni-backend-drab.vercel.app/api/users/events/${editEvent.event_id}`,
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
      await axios.delete(
        `https://alumni-backend-drab.vercel.app/api/users/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.event_id !== eventId)
      );
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event!");
    }
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
                  value={newEvent.start_time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start_time: e.target.value })
                  }
                />

                <Label>End Time</Label>
                <Input
                  type="datetime-local"
                  value={newEvent.end_time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end_time: e.target.value })
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr No</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event, index) => (
              <TableRow key={event.event_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {event.media_url && (
                    <img
                      src={event.media_url}
                      alt="Event"
                      className="w-16 h-16"
                    />
                  )}
                </TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell>
                  {new Date(event.start_time).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(event.end_time).toLocaleString()}
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEditClick(event)}
                    className="text-blue-500 bg-color-none hover:bg-gray-300"
                  >
                    <Pencil />
                  </Button>{" "}
                  <Button
                    onClick={() => handleDeleteEvent(event.event_id)}
                    className="text-red-500 bg-color-none hover:bg-gray-300"
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
              value={editEvent.start_time}
              onChange={(e) =>
                setEditEvent({ ...editEvent, start_time: e.target.value })
              }
            />

            <Label>End Time</Label>
            <Input
              type="datetime-local"
              value={editEvent.end_time}
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
