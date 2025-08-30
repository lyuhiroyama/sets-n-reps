import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SignIn from "./components/SignIn/SignIn";
import Dashboard from "./components/Dashboard/Dashboard"
import CurrentWorkout from "./components/CurrentWorkout/CurrentWorkout"
import Mesocycles from "./components/Mesocycles/Mesocycles"
import Profile from "./components/Profile/Profile"

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />

                {/* Dashboard route: wraps all nested dashboard pages (current workout, mesocycle, profile) */}
                <Route path="/dashboard/*" element={
                    <AuthProvider>
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    </AuthProvider>
                } >
                    <Route index element={<CurrentWorkout />} />
                    <Route path="current-workout" element={<CurrentWorkout />} />
                    <Route path="mesocycles" element={<Mesocycles />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </Router>
    );
}
