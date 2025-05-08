import React from 'react';

const Badge: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = '', children }) => (
  <span className={`inline-block px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

export default Badge; 