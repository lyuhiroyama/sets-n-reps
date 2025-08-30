import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SignIn from "./components/SignIn/SignIn";
import Dashboard from "./components/Dashboard/Dashboard"

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/dashboard" element={
                    <AuthProvider>
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    </AuthProvider>
                } />
            </Routes>
        </Router>
    );
}
