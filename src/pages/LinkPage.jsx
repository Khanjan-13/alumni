import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import React from "react";
import Home from "./Home";
import Login from "./Login";
import Navbar from "../components/webComponents/Essentials/Navbar";
import Signup from "./Signup";
import ProtectedRoutes from "../ProtectedRoutes";
import Event from "./Event";
import Profile from "./ProfileManage/Profile";
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
    path: "/",
    element: <Format />,
    children: [
      {
        path: "/",
        element: <Home />,
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
  {
    path: "/signup",
    element: <Signup />,
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
