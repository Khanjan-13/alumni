import { useState, useEffect } from "react";
import axios from "axios";

import { Trash2, Eye, X, Check } from "lucide-react";
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
import toast, { Toaster } from "react-hot-toast";
import AdminNavbar from "./AdminNavbar";
import API_URL from "../../config";

function RejectedJobs() {
  const [events, setEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingView, setLoadingView] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionUserId, setRejectionUserId] = useState(null);

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

  const checkRegistration = async (job_id) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/jobs/count/applications/${job_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const count = response.data?.data?.application_count || 0;
      console.log(`Job ID: ${job_id}, Count: ${count}`);
      setRegistrationCounts((prev) => ({
        ...prev,
        [job_id]: count,
      }));
    } catch (err) {
      console.error(`Error fetching registrations for job ${job_id}:`, err);
      setRegistrationCounts((prev) => ({
        ...prev,
        [job_id]: "Error",
      }));
    }
  };

  useEffect(() => {
    if (events && events.length > 0) {
      events.forEach((event) => {
        checkRegistration(event.job_id);
      });
    }
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
  const fetchRejectedJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter only Rejected jobs
      const rejectedJobs = (response.data.data || []).filter(
        (job) => job.status === "Rejected"
      );

      console.log("Rejected Jobs:", rejectedJobs);
      setEvents(rejectedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load rejected jobs!");
    }
  };

  fetchRejectedJobs();
}, [token]);



  // Function to delete event
  const handleDeleteEvent = async (jobId) => {
    try {
      await axios.delete(`${API_URL}/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.job_id !== jobId)
      );
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event!");
    }
  };
  const updateStatus = async (job_id, status, status_message = "") => {
    try {
      const response = await axios.post(
        `${API_URL}/api/jobs/status`,
        {
          job_id,
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

      setEvents((prevAlumni) =>
        prevAlumni.map((job) =>
          job.job_id === job_id ? { ...job, status } : job
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

  const handleViewDetails = async (job_id) => {
    try {
      setLoadingView(true);
      setIsDialogOpen(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/jobs/${job_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setSelectedJob(response.data.data);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    } finally {
      setLoadingView(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavbar />

      <div className="flex flex-col items-center w-full p-6 flex-1 overflow-auto">
        {/* Jobs Table */}
        <div className="flex justify-between items-center mb-6 w-full">
          <h1 className="text-2xl font-bold">Rejected Jobs Status</h1>
          
        </div>

        <div className="rounded-sm mt-7 border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gradient-to-r from-blue-900 to-blue-800">
              <TableRow>
                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                  Sr No
                </TableHead>
                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                  Title
                </TableHead>
                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                  Company
                </TableHead>

                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                  Actions
                </TableHead>

                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 uppercase tracking-wide">
                  Reason
                </TableHead>
                <TableHead className="text-white font-semibold text-[13px] px-6 py-4 text-center uppercase tracking-wide">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentEvents.length > 0 ? (
                currentEvents.map((job, index) => (
                  <TableRow
                    key={job.job_id}
                    className={
                      index % 2 === 0
                        ? "bg-white hover:bg-blue-50 transition-all duration-300"
                        : "bg-gray-50 hover:bg-blue-50 transition-all duration-300"
                    }
                  >
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-4">{job.title}</TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-700">
                      {job.company_name}
                    </TableCell>

                    <TableCell className="px-6 py-4 text-sm text-center text-gray-700">
                      <span
                        className={`p-1 px-2  rounded-lg font-medium text-black ${
                          job.status === "Approved"
                            ? " bg-green-200"
                            : job.status === "Rejected"
                            ? " bg-red-300"
                            : "  bg-yellow-200"
                        }`}
                      >
                        {job.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-700">
                        {job.status_message}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-1 px-3 py-2 rounded-md transition hover:bg-blue-100 text-blue-700"
                          onClick={() => handleViewDetails(job.job_id)} // pass the email here
                        >
                          <Eye className="h-7 w-7" />
                        </Button>
                        {/* Approve Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={job.status === "Approved"}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${
                            job.status === "Approved"
                              ? "bg-green-200 text-green-900 cursor-not-allowed"
                              : "hover:bg-green-100 text-green-700"
                          }`}
                          onClick={() => handleApprove(job.job_id)}
                        >
                          <Check className="h-4 w-4" />
                          <span>Approve</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={job.status === "Rejected"}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${
                            job.status === "Rejected"
                              ? "bg-red-200 text-red-700 cursor-not-allowed"
                              : "hover:bg-red-100 text-red-600"
                          }`}
                          onClick={() => {
                            setRejectionUserId(job.job_id);
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
                              "Are you sure you want to delete this event?"
                            );
                            if (confirmed) {
                              handleDeleteEvent(job.job_id);
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
                    colSpan={8}
                    className="text-center py-6 text-sm text-gray-500"
                  >
                    No Events Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Job Details</DialogTitle>
              <DialogDescription>
                Information about the selected job
              </DialogDescription>
            </DialogHeader>

            {loadingView ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : selectedJob ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Job Title:
                  </p>
                  <p className="text-base">{selectedJob.title}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Company Name:
                  </p>
                  <p className="text-base">{selectedJob.company_name}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Location:
                  </p>
                  <p className="text-base">{selectedJob.location}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Job Type:
                  </p>
                  <p className="text-base">{selectedJob.job_type}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Income:
                  </p>
                  <p className="text-base">{selectedJob.income}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Application Deadline:
                  </p>
                  <p className="text-base">
                    {new Date(selectedJob.deadline).toLocaleDateString("en-GB")}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Job Description:
                  </p>
                  <p className="text-base whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-red-500">No data found</p>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
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
                    updateStatus(rejectionUserId, "Rejected", rejectionReason);
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
  );
}

export default RejectedJobs;
