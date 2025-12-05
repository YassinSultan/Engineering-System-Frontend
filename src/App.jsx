import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import MainLayout from "./components/layouts/MainLayout.jsx/MainLayout";
import Home from "./components/pages/Home/Home";
import NotFound from "./components/pages/NotFound/NotFound";
import { Provider } from "react-redux";
import store from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import AddCompany from "./components/pages/Company/AddCompany";
import Company from "./components/pages/Company/Company";
import UpdateCompany from "./components/pages/Company/UpdateCompany";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "company",
        element: <Company />,
      },
      {
        path: "company/new",
        element: <AddCompany />,
      },
      {
        path: "company/edit/:id",
        element: <UpdateCompany />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});
function App() {
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

export default App;
