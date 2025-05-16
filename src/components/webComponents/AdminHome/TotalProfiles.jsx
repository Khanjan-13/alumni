import React,{useState, useEffect} from "react";
import AdminNavbar from "../../../pages/Admin/AdminNavbar";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import API_URL from "../../../config";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  Eye,
} from "lucide-react";
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


function TotalProfiles() {
  const [alumni, setAlumni] = useState([]);

  const [newAlumni, setNewAlumni] = useState({
    role: "",
    email: "",
  });
 
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(alumni.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAlumni = alumni.slice(
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
      const response = await axios.get(`${API_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assuming response.data.data.recentActivity is an array of arrays
      const allActivities = (response.data.data.recentActivity || []).flat();

      // Filter only 'profile' activity types
      const profileActivities = allActivities.filter(
        (activity) => activity.activity_type === "profile"
      );

      // Optionally sort by created_at if available
      profileActivities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      console.log("Filtered Profile Activities:", profileActivities);
      setAlumni(profileActivities);
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
  return (
    <div className="flex min-h-screen bg-background">
      <Toaster position="top-right" reverseOrder={false} />

      <AdminNavbar />
      <div className="flex flex-col items-center w-full p-6 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6 w-full">
          <h1 className="text-2xl font-bold">Alumni Management</h1>
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

export default TotalProfiles;
