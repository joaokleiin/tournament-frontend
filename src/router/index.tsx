import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute, PublicOnlyRoute } from "./ProtectedRoute";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { TournamentsPage } from "../pages/TournamentsPage";
import { TournamentDetailPage } from "../pages/TournamentDetailPage";
import { PlayersPage } from "../pages/PlayersPage";
import { TeamsPage } from "../pages/TeamsPage";

const router = createBrowserRouter([
  // Rotas públicas (apenas para não autenticados)
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  // Rotas protegidas
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/tournaments", element: <TournamentsPage /> },
          { path: "/tournaments/:id", element: <TournamentDetailPage /> },
          { path: "/players", element: <PlayersPage /> },
          { path: "/teams", element: <TeamsPage /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
