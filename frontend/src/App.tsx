import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./components/SignIn/SignIn";
import Dashboard from "./components/Dashboard/Dashboard"

export default function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Routes>
                        <Route path="/" element={<SignIn />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </header>
            </div>
        </Router>
    );
}
