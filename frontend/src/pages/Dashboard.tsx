import React, { useEffect, useState } from "react";
import { getUserProfile } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getUserProfile()
      .then(res => {
        setUser(res.user);
        setError("");
      })
      .catch(err => {
        setError("Failed to load user profile");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full flex justify-end p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/analyze-workload")}
          className="bg-transparent border-gray-700 hover:bg-gray-800 text-white"
        >
          Analyze Workload
        </Button>
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to the Dashboard!</h1>
        {loading && <div className="mb-4 text-lg">Loading user info...</div>}
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {user && (
          <div className="mb-4 text-lg">
            <div><span className="font-semibold">Name:</span> {user.name || "(not available)"}</div>
            <div><span className="font-semibold">Email:</span> {user.email || "(not available)"}</div>
          </div>
        )}
        <p className="mt-4">You are logged in.</p>
      </div>
    </div>
  );
} 