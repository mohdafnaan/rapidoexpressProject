import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import UserDashboard from "@/pages/UserDashboard";
import RiderDashboard from "@/pages/RiderDashboard";
import Landing from "@/pages/Landing";
import { AuthProvider } from "@/context/AuthContext";



function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user/dashboard/*" element={<UserDashboard />} />
            <Route path="/rider/dashboard/*" element={<RiderDashboard />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
