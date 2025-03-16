import React from "react";
import { useState,useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function AdminAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAlumni, setNewAlumni] = useState({
    name: "",
    graduationYear: "",
    email: "",
    major: "",
  });

  const token = localStorage.getItem("token");

  // Fetch alumni on mount
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get(
          "https://alumni-backend-drab.vercel.app/api/users/profile/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data.data)
        setAlumni(response.data.data || []);
      } catch (error) {
        console.error("Error fetching alumni:", error);
        toast.error("Failed to load alumni!");
      }
    };

    fetchAlumni();
  }, [token]);

  // Handle input change
  const handleChange = (e) => {
    setNewAlumni({ ...newAlumni, [e.target.name]: e.target.value });
  };

  // Add new alumni
  const handleAddAlumni = async () => {
    if (!newAlumni.name || !newAlumni.graduationYear || !newAlumni.email || !newAlumni.major) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "https://alumni-backend-drab.vercel.app/api/users/profile",
        newAlumni,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        setAlumni((prev) => [...prev, response.data.data]);
        toast.success("Alumni added successfully!");
        setIsAddDialogOpen(false);
        setNewAlumni({ name: "", graduationYear: "", email: "", major: "" });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error adding alumni:", error);
      toast.error("Failed to add alumni!");
    }
  };

  // Delete alumni
  const handleDeleteAlumni = async (id) => {
    try {
      await axios.delete(
        `https://alumni-backend-drab.vercel.app/api/users/profile/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAlumni((prev) => prev.filter((alumnus) => alumnus.id !== id));
      toast.success("Alumni deleted successfully!");
    } catch (error) {
      console.error("Error deleting alumni:", error);
      toast.error("Failed to delete alumni!");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavbar />
      <div className="flex flex-col items-center w-full p-6 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6 w-full">
          <h1 className="text-2xl font-bold">Alumni Management</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Alumni
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Alumni</DialogTitle>
                <DialogDescription>Enter the details of the new alumni member here.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {["name", "graduationYear", "email", "major"].map((field) => (
                  <div key={field} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={field} className="text-right capitalize">{field}</Label>
                    <Input id={field} name={field} value={newAlumni[field]} onChange={handleChange} className="col-span-3" />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddAlumni}>
                  Add Alumni
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex w-full px-12 pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Graduation Year</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alumni.length > 0 ? (
                alumni.map((alumnus) => (
                  <TableRow key={alumnus.id}>
                    <TableCell>{alumnus.name}</TableCell>
                    <TableCell>{alumnus.graduationYear}</TableCell>
                    <TableCell>{alumnus.email}</TableCell>
                    <TableCell>{alumnus.major}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAlumni(alumnus.profile_id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">No Alumni Found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default AdminAlumni;
