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
import Register from "./Register";
import Dashboard from "./Admin/Dashboard";
import AdminEvent from "./Admin/AdminEvent";
import AdminAlumni from "./Admin/AdminAlumni";
import EventDetail from "./Events/EventDetail";
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
    path:"/register",
    element:<Login />,
  },
  {
    path:"/admin/home",
    element:<Dashboard />
  }, 
  {
    path:"/admin/events",
    element:<AdminEvent />
  },
  {
    path:"/admin/alumni",
    element:<AdminAlumni />
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
        path: "/settings",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
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
