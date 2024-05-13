import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { lazy } from "react";
import Layout from "./Layout/Layout";

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Complaint = lazy(() => import("./pages/Complaint"));
const Status = lazy(() => import("./pages/Status"));

const Signup = lazy(() => import("./pages/Signup")); // Import the Signup component

export default function Router() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/Home",
          element: <Home />,
        },  
        {
          path: "/complaint",
          element: <Complaint/>,
        },
        {
          path: "/status",
          element: <Status/>,
        },

      ],
    },
    
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup", // Define a new route for the signup page
      element: <Signup />, // Use the Signup component
    },
  ]);

  return <RouterProvider router={routes} />;
}