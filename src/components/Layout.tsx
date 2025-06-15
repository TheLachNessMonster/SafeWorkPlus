import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function Layout({ 
  children, 
  title = "SafeWork App",
  showBackButton = false,
  onBack
}: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="lg:flex lg:max-w-7xl lg:mx-auto lg:w-full lg:min-h-screen">
        
        {/* desktop sidebar nav */}
        <aside className="hidden lg:block lg:w-64 lg:bg-white lg:shadow-sm lg:border-r lg:border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">SW</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">SafeWork</h1>
            </div>
          </div>

          {/* navigation */}
          <nav className="mt-2">
            <NavLink 
              to="/dashboard" 
              icon="🏠" 
              label="Dashboard" 
              isActive={location.pathname === '/dashboard'}
            />
            <NavLink 
              to="/incidents" 
              icon="📋" 
              label="All Incidents" 
              isActive={location.pathname === '/incidents'}
            />
            <NavLink 
              to="/create-report" 
              icon="➕" 
              label="Report Incident" 
              isActive={location.pathname === '/create-report'}
            />
            <NavLink 
              to="/workplaces" 
              icon="🏢" 
              label="Manage Workplaces" 
              isActive={location.pathname === '/workplaces'}
            />
            <NavLink 
              to="/profile" 
              icon="👤" 
              label="Profile" 
              isActive={location.pathname === '/profile'}
            />
          </nav>
        </aside>

        <main className="flex-1 lg:overflow-hidden">
          {/* mobile header */}
          <header className="lg:hidden bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 py-3 flex items-center">
              {showBackButton && (
                <button 
                  onClick={onBack}
                  className="mr-3 p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Go back"
                >
                  ←
                </button>
              )}
              <div className="flex items-center flex-1">
                <div className="w-6 h-6 bg-primary-500 rounded flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-xs">SW</span>
                </div>
                <h1 className="text-lg font-bold text-gray-800">{title}</h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Notifications"
                >
                  🔔
                </button>
              </div>
            </div>
          </header>

          {/* desktop header */}
          <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                <p className="text-sm text-gray-600 mt-1">Main Construction Site</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Notifications"
                >
                  🔔
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6 pb-20 lg:pb-6 max-w-none">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* mobile bottom nav - semantic nav element */}
      <nav className="lg:hidden bg-white border-t border-gray-200 fixed bottom-0 w-full z-50">
        <div className="flex justify-around py-2">
          <MobileNavLink 
            to="/dashboard" 
            icon="🏠" 
            label="Home" 
            isActive={location.pathname === '/dashboard'}
          />
          <MobileNavLink 
            to="/create-report" 
            icon="➕" 
            label="Report" 
            isActive={location.pathname === '/create-report'}
          />
          <MobileNavLink 
            to="/workplaces" 
            icon="🏢" 
            label="Workplaces" 
            isActive={location.pathname === '/workplaces'}
          />
          <MobileNavLink 
            to="/profile" 
            icon="👤" 
            label="Profile" 
            isActive={location.pathname === '/profile'}
          />
        </div>
      </nav>
    </div>
  );
}

// desktop nav link component
function NavLink({ to, icon, label, isActive }: {
  to: string;
  icon: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span className="mr-3 text-lg">{icon}</span>
      {label}
    </Link>
  );
}

// mobile nav link component
function MobileNavLink({ to, icon, label, isActive }: {
  to: string;
  icon: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link 
      to={to}
      className={`p-3 flex flex-col items-center min-w-0 flex-1 transition-colors ${
        isActive ? 'text-primary-500' : 'text-gray-500'
      }`}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs font-medium truncate">{label}</span>
    </Link>
  );
}