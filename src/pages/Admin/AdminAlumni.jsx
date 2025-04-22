import React from "react";
import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Check, X, Search } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [alumni, setAlumni] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAlumni, setNewAlumni] = useState({
    role: "",
    email: "",
  });
  const filteredAlumni = alumni.filter((alumnus) =>
    `${alumnus?.name ?? ""} ${alumnus?.email ?? ""} ${alumnus?.role ?? ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(alumni.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAlumni = filteredAlumni.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const token = localStorage.getItem("token");

  // Fetch alumni on mount
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get(
          "https://alumni-backend-drab.vercel.app/api/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data.data);
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
    if (!newAlumni.name || !newAlumni.email) {
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
        setNewAlumni({ name: "", email: "" });
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
        `https://alumni-backend-drab.vercel.app/api/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAlumni((prev) => prev.filter((alumnus) => alumnus.user_id !== id));
      toast.success("Alumni deleted successfully!");
    } catch (error) {
      console.error("Error deleting alumni:", error);
      toast.error("Failed to delete alumni!");
    }
  };

  const updateStatus = async (user_id, status) => {
    try {
      const response = await axios.post(
        "https://alumni-backend-drab.vercel.app/api/users/status",
        {
          user_id,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // if required
          },
        }
      );
      console.log("Status updated:", response.data);
      toast.success(
        `User ${status === "Approved" ? "approved" : "rejected"} successfully!`
      );

      setAlumni((prevAlumni) =>
        prevAlumni.map((alumnus) =>
          alumnus.user_id === user_id ? { ...alumnus, status } : alumnus
        )
      );
    } catch (err) {
      console.error(
        "Failed to update status:",
        err.response?.data || err.message
      );
    }
  };

  const handleApprove = (user_id) => {
    updateStatus(user_id, "Approved");
  };

  const handleReject = (user_id) => {
    updateStatus(user_id, "Rejected");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Toaster position="top-right" reverseOrder={false} />

      <AdminNavbar />
      <div className="flex flex-col items-center w-full p-6 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6 w-full">
          <h1 className="text-2xl font-bold">Alumni Management</h1>
          <div className=" max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by email..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
                <DialogDescription>
                  Enter the details of the new alumni member here.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {["name", "graduationYear", "email", "major"].map((field) => (
                  <div
                    key={field}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label htmlFor={field} className="text-right capitalize">
                      {field}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      value={newAlumni[field]}
                      onChange={handleChange}
                      className="col-span-3"
                    />
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
        <div className="w-full px-12 ">
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-blue-900 to-blue-800">
                <TableRow>
                  <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                    Email
                  </TableHead>
                  <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                    Role
                  </TableHead>
                  <TableHead className="text-white font-semibold text-[13px] px-6 py-4 text-center uppercase tracking-wide">
                    Actions
                  </TableHead>
                  <TableHead className="text-white font-semibold text-[13px] px-6 py-4 text-center uppercase tracking-wide">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentAlumni.length > 0 ? (
                  currentAlumni.map((alumnus, index) => (
                    <TableRow
                      key={alumnus.id}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-blue-50 transition-all duration-300"
                          : "bg-gray-50 hover:bg-blue-50 transition-all duration-300"
                      }
                    >
                      <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">
                        {alumnus.email}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-700">
                        {alumnus.role}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-center text-gray-700">
                        <span
                          className={`p-1 px-2  rounded-lg font-medium text-black ${
                            alumnus.status === "Approved"
                              ? " bg-green-200"
                              : alumnus.status === "Rejected"
                              ? " bg-red-300"
                              : "  bg-yellow-200"
                          }`}
                        >
                          {alumnus.status}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-3">
                          {/* Approve Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={alumnus.status === "Approved"}
                            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${
                              alumnus.status === "Approved"
                                ? "bg-green-200 text-green-900 cursor-not-allowed"
                                : "hover:bg-green-100 text-green-700"
                            }`}
                            onClick={() => handleApprove(alumnus.user_id)}
                          >
                            <Check className="h-4 w-4" />
                            <span>Approve</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={alumnus.status === "Rejected"}
                            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${
                              alumnus.status === "Rejected"
                                ? "bg-red-200 text-red-700 cursor-not-allowed"
                                : "hover:bg-red-100 text-red-600"
                            }`}
                            onClick={() => handleReject(alumnus.user_id)}
                          >
                            <X className="h-4 w-4" />
                            <span>Reject</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-red-100 p-2 rounded-full transition"
                            onClick={() => {
                              const confirmed = window.confirm(
                                "Are you sure you want to delete this alumni?"
                              );
                              if (confirmed) {
                                handleDeleteAlumni(alumnus.user_id);
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
                      colSpan={3}
                      className="text-center py-6 text-sm text-gray-500"
                    >
                      No Alumni Found
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
      </div>
    </div>
  );
}

export default AdminAlumni;
