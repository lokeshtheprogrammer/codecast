
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AdminDashboard from "@/components/AdminDashboard";
import { toast } from "sonner";
import { getAuthState, hasRole } from "@/lib/auth";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = getAuthState();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to access this page");
      navigate("/login");
      return;
    }

    if (!hasRole("admin")) {
      toast.error("You don't have permission to access this page");
      navigate("/");
      return;
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage users, videos, and platform settings
          </p>
        </div>
        
        <AdminDashboard />
      </main>
    </div>
  );
};

export default Admin;
