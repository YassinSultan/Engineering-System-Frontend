// App.jsx
import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./components/layouts/MainLayout/MainLayout";
import GuestLayout from "./components/layouts/GuestLayout/GuestLayout";
import Home from "./components/pages/Home/Home";
import Login from "./components/pages/Login/Login";
import Company from "./components/pages/Company/Company";
import AddCompany from "./components/pages/Company/AddCompany";
import UpdateCompany from "./components/pages/Company/UpdateCompany";
import NotFound from "./components/pages/NotFound/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { Provider } from "react-redux";
import store from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import Forbidden from "./components/pages/Forbidden/Forbidden";
import Profile from "./components/pages/Profile/Profile";
import UpdateProfile from "./components/pages/Profile/UpdateProfile";
import ChangePassword from "./components/pages/Profile/ChangePassword";
import User from "./components/pages/User/User";
import AddUser from "./components/pages/User/AddUser";
import PermissionsUser from "./components/pages/User/PermissionsUser";
import UpdateUser from "./components/pages/User/UpdateUser";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <GuestLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/change-password",
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "company",
        element: (
          <ProtectedRoute requirePermission="companies:read">
            <Company />
          </ProtectedRoute>
        ),
      },
      {
        path: "company/new",
        element: (
          <ProtectedRoute requirePermission="companies:create">
            <AddCompany />
          </ProtectedRoute>
        ),
      },
      {
        path: "company/edit/:id",
        element: (
          <ProtectedRoute requirePermission="companies:update">
            <UpdateCompany />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requirePermission="users:read">
            <User />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/new",
        element: (
          <ProtectedRoute requirePermission="users:create">
            <AddUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/permissions/:id",
        element: (
          <ProtectedRoute requirePermission="users:updatePermissions">
            <PermissionsUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/edit/:id",
        element: (
          <ProtectedRoute requirePermission="companies:update">
            <UpdateUser />
          </ProtectedRoute>
        ),
      },

      { path: "forbidden", element: <Forbidden /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Toaster position="bottom-right" />
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </QueryClientProvider>
  );
}
