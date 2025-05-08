import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { parseISO, isBefore, getMonth, getYear } from "date-fns";
// If you have a custom Table component, adjust the import path below:
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../../src/frontend/components/ui/table";

// Sample data for monthly goals (now with dueDate + status)
const SAMPLE_GOALS = [
  { id: 1, title: "Get car tag", dueDate: "2025-05-01", status: "pending" },
  {
    id: 2,
    title: "Read chapter 1 of Japanese book",
    dueDate: "2025-05-05",
    status: "completed",
  },
  {
    id: 3,
    title: "Read 5th book of the Bible obadaih and create plan",
    dueDate: "2025-05-10",
    status: "pending",
  },
  // …add your other goals here…
  {
    id: 11,
    title: "Read Chapter 2 of my Japanese book",
    dueDate: "2025-04-30",
    status: "pending", // overdue
  },
  {
    id: 12,
    title: "Help dad update his house by cleaning downstairs",
    dueDate: "2025-05-20",
    status: "pending",
  },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthlyMapper: React.FC = () => {
  const navigate = useNavigate();

  // initialize to current month
  const today = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    today.getMonth()
  );

  const prevMonth = () =>
    setCurrentMonthIndex((m) => (m === 0 ? 11 : m - 1));
  const nextMonth = () =>
    setCurrentMonthIndex((m) => (m === 11 ? 0 : m + 1));

  // filter tasks for the displayed month & year
  const visibleGoals = SAMPLE_GOALS.filter((g) => {
    if (!g.dueDate) return false;
    const d = parseISO(g.dueDate);
    return (
      getMonth(d) === currentMonthIndex &&
      getYear(d) === today.getFullYear()
    );
  });

  const now = new Date();

  return (
    <div className="min-h-screen bg-[#0f1421] text-white flex flex-col items-center px-4">
      <div className="w-full max-w-5xl mt-8">
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent border-gray-700 hover:bg-gray-800 text-white mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        {/* Month Navigation */}
        <div className="flex justify-center items-center mb-8">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-gray-700 hover:bg-gray-800 text-white"
            onClick={prevMonth}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <h1 className="text-5xl font-bold mx-12">
            {MONTHS[currentMonthIndex]}
          </h1>

          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-gray-700 hover:bg-gray-800 text-white"
            onClick={nextMonth}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Goals Table */}
        <div className="bg-[#1a2133] rounded-lg overflow-hidden">
          <Table>
            <caption className="sr-only">
              Monthly goals for {MONTHS[currentMonthIndex]}{" "}
              {today.getFullYear()}
            </caption>
            <TableHeader>
              <TableRow className="border-none">
                <TableHead className="w-1/4 bg-[#363c4d] text-white text-lg font-bold">
                  Goal #
                </TableHead>
                <TableHead className="bg-[#363c4d] text-white text-lg font-bold">
                  {MONTHS[currentMonthIndex]}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleGoals.length > 0 ? (
                visibleGoals.map((goal) => {
                  const due = parseISO(goal.dueDate);
                  const isOverdue =
                    isBefore(due, now) &&
                    goal.status !== "completed";

                  const rowBg = isOverdue
                    ? "bg-[#ea384c] text-white"
                    : "bg-[#a6e9a6] text-black";

                  return (
                    <TableRow
                      key={goal.id}
                      className={`border-none ${rowBg}`}
                    >
                      <TableCell className="bg-[#5a6073] text-white font-medium py-4">
                        Goals {goal.id}
                      </TableCell>
                      <TableCell className="text-lg font-medium py-4">
                        {goal.title}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="border-none bg-[#1a2133]">
                  <TableCell className="bg-[#5a6073] text-white font-medium py-4">
                    —
                  </TableCell>
                  <TableCell className="text-gray-400 italic py-4">
                    No tasks this month
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyMapper;
