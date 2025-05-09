import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import React, { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Index from './pages/Index';
import MonthlyMapper from './pages/MonthlyMapper';
import YearlyMapper from './pages/YearlyMapper';
import WorkloadAnalysis from './pages/WorkloadAnalysis';

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
  return (
    <ThemeProvider>
        <Router>
            <div className="min-h-screen bg-background text-foreground app-container" data-testid="app-container">
              <ThemeDebugLogger />
              <ThemeDebugPanel />
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/monthly-mapper" element={<ProtectedRoute><MonthlyMapper /></ProtectedRoute>} />
            <Route path="/yearly-mapper" element={<ProtectedRoute><YearlyMapper /></ProtectedRoute>} />
            <Route path="/analyze-workload" element={<ProtectedRoute><WorkloadAnalysis /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
    </ThemeProvider>
  );
}

export default App;
