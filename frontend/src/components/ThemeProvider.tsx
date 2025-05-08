import React, { PropsWithChildren } from 'react';
import '../styles/theme/tokens.css';
import '../styles/global.css';
 
export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="theme-root">{children}</div>
); 