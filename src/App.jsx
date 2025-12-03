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
