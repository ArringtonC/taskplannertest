import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen">
      <div className="p-4">
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent border-gray-700 hover:bg-gray-800 text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 w-24">Goal #</th>
                  <th className="p-2"><div className="flex-1">January</div></th>
                  <th className="p-2"><div className="flex-1">February</div></th>
                  <th className="p-2"><div className="flex-1">March</div></th>
                  {/* Add more months as needed */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 w-24">1</td>
                  <td className="p-2"><div className="flex-1">Value 1</div></td>
                  <td className="p-2"><div className="flex-1">Value 2</div></td>
                  <td className="p-2"><div className="flex-1">Value 3</div></td>
                </tr>
                {/* More rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 