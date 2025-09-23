import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./components/Dashboard/Dashboard"
import CurrentWorkout from "./components/CurrentWorkout/CurrentWorkout"
import Mesocycles from "./components/Mesocycles/Mesocycles"
import MesoDetail from "./components/MesoDetail/MesoDetail"
import PlanAMesocycle from "./components/PlanAMesocycle/PlanAMesocycle"
import Profile from "./components/Profile/Profile"
import Landing from "./components/Landing/Landing";

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Landing />} />

                    {/* Dashboard route: wraps all nested dashboard pages (current workout, mesocycle, profile) */}
                    <Route path="/dashboard/*" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                    } >
                        <Route index element={<CurrentWorkout />} />
                        <Route path="current-workout" element={<CurrentWorkout />} />
                        <Route path="mesocycles" element={<Mesocycles />} />
                        <Route path="mesocycles/:id" element={<MesoDetail />} />
                        <Route path="plan-a-mesocycle" element={<PlanAMesocycle />}/>
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}
