
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DependencyGraph() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/")}
            className="mr-4 bg-transparent border-gray-700 hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold">Task Dependency Graph</h1>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
          <p className="text-gray-400 text-lg">
            Dependency graph visualization would be displayed here, showing task relationships and dependencies.
          </p>
        </div>
      </div>
    </div>
  );
}
