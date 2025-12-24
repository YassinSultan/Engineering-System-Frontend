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
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
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
import SpecificCompany from "./components/pages/Company/SpecificCompany";
import OrganizationUnits from "./components/pages/OrganizationUnits/OrganizationUnits";
import AddOrganizationUnits from "./components/pages/OrganizationUnits/AddOrganizationUnits";
import AddProject from "./components/pages/Project/AddProject";
import Project from "./components/pages/Project/Project";
import SpecificUser from "./components/pages/User/SpecificUser";

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
        path: "organization-units",
        element: (
          <ProtectedRoute>
            <OrganizationUnits />
          </ProtectedRoute>
        ),
      },
      {
        path: "organization-units/new",
        element: (
          <ProtectedRoute>
            <AddOrganizationUnits />
          </ProtectedRoute>
        ),
      },
      {
        path: "companies",
        element: (
          <ProtectedRoute requirePermissions={["companies:read"]}>
            <Company />
          </ProtectedRoute>
        ),
      },
      {
        path: "companies/create",
        element: (
          <ProtectedRoute requirePermissions={["companies:create"]}>
            <AddCompany />
          </ProtectedRoute>
        ),
      },
      {
        path: "companies/update/:id",
        element: (
          <ProtectedRoute requirePermissions={["companies:update"]}>
            <UpdateCompany />
          </ProtectedRoute>
        ),
      },
      {
        path: "/companies/read/:id",
        element: (
          <ProtectedRoute requirePermissions={["companies:read"]}>
            <SpecificCompany />
          </ProtectedRoute>
        ),
      },
      {
        path: "projects",
        element: (
          <ProtectedRoute requirePermissions={["projects:read"]}>
            <Project />
          </ProtectedRoute>
        ),
      },
      {
        path: "projects/create",
        element: (
          <ProtectedRoute requirePermissions={["projects:create"]}>
            <AddProject />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requirePermissions="users:read">
            <User />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/read/:id",
        element: (
          <ProtectedRoute requirePermissions="users:read">
            <SpecificUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/create",
        element: (
          <ProtectedRoute requirePermissions="users:create">
            <AddUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/permissions/:id",
        element: (
          <ProtectedRoute requirePermissions="users:update:updatePermissions">
            <PermissionsUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/update/:id",
        element: (
          <ProtectedRoute requirePermissions="companies:update">
            <UpdateUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "forbidden",
        element: (
          <ProtectedRoute>
            <Forbidden />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: (
          <ProtectedRoute>
            <NotFound />
          </ProtectedRoute>
        ),
      },
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
