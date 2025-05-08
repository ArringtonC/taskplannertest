import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import React, { useEffect } from 'react';

// Import pages
import Dashboard from './pages/Dashboard';
import MonthlyMapper from './pages/MonthlyMapper';
import DependencyGraph from './pages/DependencyGraph';
import AddTaskPage from './pages/AddTaskPage';
import LoginPage from './pages/LoginPage';
import TaskPlannerDashboard from './pages/TaskPlannerDashboard';
import EditTaskPage from './pages/EditTaskPage';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

// Debug logger for theme variables and container classes
function ThemeDebugLogger() {
  useEffect(() => {
    const root = document.documentElement;
    const getVar = (name: string) =>
      getComputedStyle(root).getPropertyValue(name);
    console.log('Theme Debug:');
    console.log('--background:', getVar('--background'));
    console.log('--foreground:', getVar('--foreground'));
    console.log('--primary:', getVar('--primary'));
    console.log('--secondary:', getVar('--secondary'));
    // Add more as needed
    const el = document.querySelector('[data-testid="app-container"]');
    if (el) {
      console.log('App container classes:', el.className);
    }
    // Check for .site background-color
    const siteEls = document.querySelectorAll('.site');
    siteEls.forEach((siteEl) => {
      const bg = getComputedStyle(siteEl).getPropertyValue('background-color');
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        console.warn('.site element found with background-color:', bg, siteEl);
      }
    });
  }, []);
  return null;
}

// Visible debug panel for theme variables
function ThemeDebugPanel() {
  const vars = [
    '--background',
    '--foreground',
    '--primary',
    '--secondary',
    // Add more as needed
  ];
  const getVar = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v);
  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: 'rgba(0,0,0,0.7)',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: 8,
      zIndex: 9999,
      fontSize: 12,
      pointerEvents: 'none',
    }}>
      <strong>Theme Vars:</strong>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {vars.map((v) => (
          <li key={v}>
            {v}: <span style={{ color: '#0ff' }}>{getVar(v)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  console.log('App component rendering');

  return (
    <ThemeProvider>
    <AuthProvider>
      <TaskProvider>
        <Router>
            <div className="min-h-screen bg-background text-foreground app-container" data-testid="app-container">
              <ThemeDebugLogger />
              <ThemeDebugPanel />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-task"
                element={
                  <ProtectedRoute>
                    <AddTaskPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/monthly"
                element={
                  <ProtectedRoute>
                    <MonthlyMapper />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dependencies"
                element={
                  <ProtectedRoute>
                    <DependencyGraph />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/task-planner-dashboard"
                element={
                  <ProtectedRoute>
                    <TaskPlannerDashboard />
                  </ProtectedRoute>
                }
              />

                <Route
                  path="/edit-task/:id"
                  element={
                    <ProtectedRoute>
                      <EditTaskPage />
                    </ProtectedRoute>
                  }
                />
            </Routes>
          </div>
        </Router>
      </TaskProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
