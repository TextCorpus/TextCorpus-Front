import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { PrivateRoute } from "./components/PrivateRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import PasswordRecovery from "./pages/PasswordRecovery/PasswordRecovery";
import Profile from "./pages/Profile/Profile";
import Projects from "./pages/Projects/Projects";
import ProjectList from "./pages/ProjectsList/ProjectsList";
import Dashboard from "./pages/Dashboard/Dashboard";
import { NotFound } from "./pages/NotFound";
import Navbar from "./components/Side/side";

export const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    // Define public routes accessible to all users
    const routesForPublic = [
        {
            path: "/Login",
            element: <Login />,
        },
    ];

    // Define routes accessible only to authenticated users
    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <PrivateRoute />, // Wrap the component in PrivateRoute
            children: [
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "/Profile",
                    element: <Profile />,
                },
                {
                    path: "/Projects",
                    element: <Projects />,
                },
                {
                    path: "/ProjectList",
                    element: <ProjectList />,
                },
                {
                    path: "/Dashboard",
                    element: <Dashboard />,
                },
            ],
        },
    ];

    // Define routes accessible only to non-authenticated users
    const routesForNotAuthenticatedOnly = [
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/PasswordRecovery",
            element: <PasswordRecovery />,
        }
    ];

    // Combine and conditionally include routes based on authentication status
    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!isAuthenticated ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
        {
            path: "*",
            element: <NotFound />,
        }
    ]);

    // Provide the router configuration using RouterProvider
    return (
        <AuthProvider>
            <RouterProvider router={router} />
            {isAuthenticated && <Navbar />} {/* Render Navbar only if authenticated */}
        </AuthProvider>
    );
};
