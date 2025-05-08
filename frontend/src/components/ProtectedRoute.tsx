import React, { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

// DEV ONLY: Bypass auth for local development and preview
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;
