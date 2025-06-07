import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { PrivateRoute } from "@/components/PrivateRoute";
import ListView from "@/pages/ListView";
import CalendarView from "@/pages/CalendarView";
import NewTask from "@/pages/NewTask";
import EditTask from "@/pages/EditTask";
import NotFound from "@/pages/NotFound";
import ChatPage from "@/pages/ChatPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/tasks" replace />,
      },
      {
        path: "tasks",
        element: <ListView />,
      },
      {
        path: "calendar",
        element: <CalendarView />,
      },
      {
        path: "new-task",
        element: <NewTask />,
      },
      {        path: "edit-task/:id",        element: <EditTask />,      },      {        path: "chat",        element: <ChatPage />,      },      {        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
