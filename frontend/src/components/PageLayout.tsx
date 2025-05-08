import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  backLink?: string;
  actions?: ReactNode;
  footerActions?: ReactNode;
}

/**
 * Consistent page layout component for all pages
 */
const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  children,
  backLink,
  actions,
  footerActions,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backLink) {
      console.log(`Back button clicked - navigating to ${backLink}`);
      navigate(backLink);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>

            {actions && <div className="mt-3 md:mt-0">{actions}</div>}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow p-4">
        <div className="container mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-sm p-4 border-t">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            {backLink && (
              <Button variant="secondary" onClick={handleBack}>
                Back to{' '}
                {backLink === '/'
                  ? 'Dashboard'
                  : backLink.substring(1).charAt(0).toUpperCase() +
                    backLink.substring(2)}
              </Button>
            )}
          </div>

          {footerActions && <div>{footerActions}</div>}
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
