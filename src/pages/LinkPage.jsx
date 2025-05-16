import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import React from "react";
import Home from "./Home";
import Login from "./Login";
import Navbar from "../components/webComponents/Essentials/Navbar";
import Signup from "./Signup";
import ProtectedRoutes from "../ProtectedRoutes";
import Event from "./Event";
import Profile from "./ProfileManage/Profile";
import Feed from "./Feed/Feed";
import FeedPost from "./Feed/FeedPost";
import Dashboard from "./Admin/Dashboard";
import AdminEvent from "./Admin/AdminEvent";
import AdminAlumni from "./Admin/AdminAlumni";
import EventDetail from "./Events/EventDetail";
import ProfileHome from "@/components/webComponents/profile/ProfileHome";
import AlumniNetwork from "./AlumniNetwork";
import UserProfile from "./ProfileManage/UserProfile";
import Jobs from "./Jobs/Jobs";
import AdminProtectedRoutes from "@/AdminProtectedRoutes";
import Unauthorized from "@/Unauthorized";
import PostJobForm from "./Jobs/PostJobForm";
import MyPostings from "./Jobs/MyPostings";
import JobDescription from "./Jobs/JobDescription";
import AdminJobs from "./Admin/AdminJobs";
import MyApplication from "./Jobs/MyApplication";
import EditPosting from "./Jobs/EditPosting";
import PendingUsers from "./Admin/PendingUsers";
import RejectedUsers from "./Admin/RejectedUsers";
import AdminAnalytics from "./Admin/AdminAnalytics";
import RejectedJobs from "./Admin/RejectedJobs";
import TotalProfiles from "@/components/webComponents/AdminHome/TotalProfiles";
import MyEvents from "./Events/MyEvents";
const Format = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};
const router = createBrowserRouter([
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/admin/home",
    element: (
      <AdminProtectedRoutes>
        <Dashboard />
      </AdminProtectedRoutes>
    ),
  },
    {
    path: "/admin/total-profiles",
    element: (
      <AdminProtectedRoutes>
        <TotalProfiles />
      </AdminProtectedRoutes>
    ),
  },
  {
    path: "/admin/events",
    element: (
      <AdminProtectedRoutes>
        <AdminEvent />
      </AdminProtectedRoutes>
    ),
  },
  {
    path: "/admin/alumni",
    element: (
      <AdminProtectedRoutes>
        {" "}
        <AdminAlumni />
      </AdminProtectedRoutes>
    ),
  },
  {
    path: "/admin/pending-alumni",
    element: (
      <AdminProtectedRoutes>
        {" "}
        <PendingUsers />
      </AdminProtectedRoutes>
    ),
  },
  {
    path: "/admin/rejected-alumni",
    element: (
      <AdminProtectedRoutes>
        {" "}
        <RejectedUsers />
      </AdminProtectedRoutes>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <AdminProtectedRoutes>
        {" "}
        <AdminJobs />
      </AdminProtectedRoutes>
    ),
  },
    {
    path: "/admin/rejected-jobs",
    element: (
      <AdminProtectedRoutes>
        {" "}
        <RejectedJobs />
      </AdminProtectedRoutes>
    ),
  },
  {
    path: "/admin/analytics",
    element: (
      <AdminProtectedRoutes>
        {" "}
        <AdminAnalytics />
      </AdminProtectedRoutes>
    ),
  },
  {
    path: "/",
    element: <Format />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/events",
        element: <Event />,
      },
        {
        path: "/my-events",
        element: <MyEvents />,
      },
      {
        path: "/alumni-network",
        element: <AlumniNetwork />,
      },
      {
        path: "/events/:slug/:id",
        element: <EventDetail />,
      },
      {
        path: "/feed",
        element: (
          <ProtectedRoutes>
            <Feed />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/feed-post",
        element: (
          <ProtectedRoutes>
            <FeedPost />
          </ProtectedRoutes>
        ),
      },

      {
        path: "/profile/:user_id",
        element: <UserProfile />,
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/my-profile",
        element: (
          <ProtectedRoutes>
            <ProfileHome />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/jobs",
        element: <Jobs />,
      },
      {
        path: "/post-jobs",
        element: (
          <ProtectedRoutes>
            <PostJobForm />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/my-job-post",
        element: (
          <ProtectedRoutes>
            <MyPostings />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/job-application/:job_id",
        element: (
          <ProtectedRoutes>
            <JobDescription />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/my-application",
        element: (
          <ProtectedRoutes>
            <MyApplication />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/edit-job/:job_id",
        element: (
          <ProtectedRoutes>
            <EditPosting />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);
function LinkPage() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default LinkPage;
