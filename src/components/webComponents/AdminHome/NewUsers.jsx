import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Check, X, Eye } from "lucide-react";
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
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import API_URL from "../../../config";

function NewUsers() {
  const [alumni, setAlumni] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [loadingView, setLoadingView] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionUserId, setRejectionUserId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch alumni on mount
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pendingAlumni = (response.data.data || []).filter(
          (alumnus) => alumnus.status === "Pending"
        );

        setAlumni(pendingAlumni);
      } catch (error) {
        console.error("Error fetching alumni:", error);
        toast.error("Failed to load alumni!");
      }
    };

    fetchAlumni();
  }, [token]);

  // Delete alumni
  const handleDeleteAlumni = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlumni((prev) => prev.filter((alumnus) => alumnus.user_id !== id));
      toast.success("Alumni deleted successfully!");
    } catch (error) {
      console.error("Error deleting alumni:", error);
      toast.error("Failed to delete alumni!");
    }
  };

  const updateStatus = async (user_id, status, status_message = "") => {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/status`,
        {
          user_id,
          status,
          status_message, // Add this only if your backend accepts it
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  const handleViewDetails = async (email) => {
    try {
      setLoadingView(true);
      setIsDialogOpen(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/users/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setSelectedAlumni(response.data.data);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    } finally {
      setLoadingView(false);
    }
  };
  // Filter pending users and limit to 5
  const pendingAlumni = alumni
    .filter((alumnus) => alumnus.status === "Pending")
    .slice(0, 5);

  return (
    <div>
      <div className="w-full ">
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
              {pendingAlumni.length > 0 ? (
                pendingAlumni.map((alumnus, index) => (
                  <TableRow
                    key={alumnus.user_id}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-1 px-3 py-2 rounded-md transition hover:bg-blue-100 text-blue-700"
                          onClick={() => handleViewDetails(alumnus.email)} // pass the email here
                        >
                          <Eye className="h-7 w-7" />
                        </Button>
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
                          onClick={() => {
                            setRejectionUserId(alumnus.user_id);
                            setIsRejectDialogOpen(true);
                          }}
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
          {/* View More Button */}
          <NavLink to="/admin/alumni" className="flex justify-center border">
            <Button className="text-blue-600 text-md bg-color-none hover:bg-color-none">
              View More &rarr;
            </Button>
          </NavLink>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Alumni Details</DialogTitle>
                <DialogDescription>College ID & Proof</DialogDescription>
              </DialogHeader>

              {loadingView ? (
                <p className="text-center text-muted-foreground">Loading...</p>
              ) : selectedAlumni ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      College ID / Passing Year:
                    </p>
                    <p className="text-base">
                      {selectedAlumni.college_id_or_passing_year}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      ID Proof Image:
                    </p>
                    {selectedAlumni.college_proof_public_id ? (
                      <img
                        src={selectedAlumni.college_proof}
                        alt="College Proof"
                        className="w-full border rounded mt-2"
                      />
                    ) : (
                      <p className="text-muted-foreground">No image uploaded</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-red-500">No data found</p>
              )}
            </DialogContent>
          </Dialog>
          <Dialog
            open={isRejectDialogOpen}
            onOpenChange={setIsRejectDialogOpen}
          >
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Reject Alumni</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting this alumni request.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  placeholder="Enter reason for rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!rejectionReason.trim()}
                  onClick={() => {
                    if (rejectionUserId) {
                      updateStatus(
                        rejectionUserId,
                        "Rejected",
                        rejectionReason
                      );
                    }
                    setIsRejectDialogOpen(false);
                    setRejectionReason("");
                    setRejectionUserId(null);
                  }}
                >
                  Reject
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default NewUsers;
