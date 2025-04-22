import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Check, X } from "lucide-react";
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

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate

function NewUsers() {
  const [alumni, setAlumni] = useState([]);
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

                    <TableCell className="px-6 py-3 text-center">
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

                        {/* Reject Button */}
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
                    No Pending Alumni Found
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
        </div>
      </div>
    </div>
  );
}

export default NewUsers;
