import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

/**
 * Standardized Button component for consistent UI
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  // Define variant classes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-foreground',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-foreground',
    danger: 'bg-red-600 hover:bg-red-700 text-foreground',
    success: 'bg-green-600 hover:bg-green-700 text-foreground',
    ghost: 'bg-transparent border border-[#353b4b] text-white hover:bg-[#23293a]',
  };

  // Define size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // Common classes
  const baseClasses =
    'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const focusClasses = {
    primary: 'focus:ring-blue-500',
    secondary: 'focus:ring-gray-500',
    danger: 'focus:ring-red-500',
    success: 'focus:ring-green-500',
    ghost: 'focus:ring-blue-500',
  };

  // Disabled and loading states
  const stateClasses =
    disabled || isLoading ? 'opacity-70 cursor-not-allowed' : '';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${focusClasses[variant]} ${stateClasses} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <div className="flex items-center justify-center">
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {icon && <span className={`${children ? 'mr-2' : ''}`}>{icon}</span>}
        {children}
      </div>
    </button>
  );
};

export default Button;
