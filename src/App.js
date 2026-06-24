import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import { AdvisorProvider } from "./components/Advisor";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PriorityStack from "./pages/PriorityStack";
import SmartInbox from "./pages/SmartInbox";
import Meetings from "./pages/Meetings";
import Proactive from "./pages/Proactive";
import Avatar from "./pages/Avatar";
import Autonomous from "./pages/Autonomous";
import Voice from "./pages/Voice";
import Documents from "./pages/Documents";
import Workflows from "./pages/Workflows";
import Analytics from "./pages/Analytics";
import Customer360 from "./pages/Customer360";
import Compliance from "./pages/Compliance";
import Security from "./pages/Security";
import Gamification from "./pages/Gamification";
import Celebration from "./pages/Celebration";
import Learning from "./pages/Learning";
import Travel from "./pages/Travel";
import Settings from "./pages/Settings";
import Knowledge from "./pages/Knowledge";
import WelcomeCall from "./pages/WelcomeCall";
import EmailAutomation from "./pages/EmailAutomation";
import AutoUnderwriting from "./pages/AutoUnderwriting";
import MicroClaims from "./pages/MicroClaims";

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdvisorProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/priority" element={<PriorityStack />} />
          <Route path="/inbox" element={<SmartInbox />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/proactive" element={<Proactive />} />
          <Route path="/avatar" element={<Avatar />} />
          <Route path="/autonomous" element={<Autonomous />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/customer360" element={<Customer360 />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/security" element={<Security />} />
          <Route path="/gamification" element={<Gamification />} />
          <Route path="/celebration" element={<Celebration />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ecosystem" element={<Navigate to="/settings" replace />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/welcome-call" element={<WelcomeCall />} />
          <Route path="/email-automation" element={<EmailAutomation />} />
          <Route path="/auto-underwriting" element={<AutoUnderwriting />} />
          <Route path="/micro-claims" element={<MicroClaims />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AdvisorProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
