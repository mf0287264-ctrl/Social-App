import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthRoute from "./component/AuthRoute/AuthRoute";
import Layout from "./component/Layout/Layout";
import ProtectedRoutes from "./component/Layout/ProtectedRoutes/ProtectedRoutes";
import ContextToken from "./Context/ContextToken";
import Contextid from "./Context/contextId";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import PostDetailes from "./pages/PostDetailes/PostDetailes";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import { Offline, Online } from "react-detect-offline";
import ResetPass from "./pages/resetPass/ResetPass";
import ContextPass from "./Context/ContextPass";
const routes = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/postdetailes/:postId",
        element: (
          <ProtectedRoutes>
            <PostDetailes />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/login",
        element: (
          // <AuthRoute>
          <Login />
          // </AuthRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthRoute>
            <Register />
          </AuthRoute>
        ),
      },
      {
        path: "/resetPassword",
        element: <ResetPass />,
      },
      {
        path: "*",
        element: (
          <h1 className="bg-amber-300 w-full h-dvh flex justify-center items-center text-7xl font-bold">
            4 0 4
          </h1>
        ),
      },
    ],
  },
]);

// console.log(localStorage.getItem("token"));

const client = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={client}>
        <ContextPass>
          <ContextToken>
            <Contextid>
              <ToastContainer />
              <Offline>
                <div className="w-full bg-amber-50 z-50">
                  <p className="w-1/2 text-2xl m-auto ">
                    Only shown offline (surprise!)
                  </p>
                </div>
              </Offline>
              <RouterProvider router={routes} />
            </Contextid>
          </ContextToken>
        </ContextPass>
      </QueryClientProvider>
    </>
  );
}

export default App;
