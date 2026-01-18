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

function App() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardOverview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="diet-plan" element={<DietPlan />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App
