import { Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import { Chatbot } from "./pages/Chatbot";
import { Dashboard } from "./pages/Dashboard";
import { DashboardOverview } from "./pages/DashboardOverview";
import { DietPlan } from "./pages/DietPlan";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { ProgressPage } from "./pages/Progress";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="diet-plan" element={<DietPlan />} />
        <Route path="monitoring" element={<ProgressPage />} />
        <Route path="chatbot" element={<Chatbot />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
