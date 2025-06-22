import React, { useEffect, useState } from 'react';
import {
  Link,
  Outlet,
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  Home,
  UserCog,
  LineChart,
  Settings,
  ShoppingCart,
  Users,
  BadgePercent,
  Package,
  Truck,
  AlertCircle,
  RefreshCw,
  Menu,
  X,
  LogOut,
  User,
  Briefcase,
  ChevronDown,
  Bell,
  Search,
  HeartPulse // Placeholder icon for VET-POS, replace if needed
} from 'lucide-react';


const navigationConfig = {
  admin: [
    { href: "/admin-dashboard", label: "Admin Dashboard", icon: Briefcase },
    { href: "/users", label: "User Management", icon: UserCog },
    { href: "/reports", label: "Reports", icon: LineChart },
    { href: "/settings", label: "System Settings", icon: Settings },
  ],
  cashier: [
    { href: "/cashier-dashboard", label: "Cashier Dashboard", icon: Home },
    { href: "/pos", label: "Transactions", icon: ShoppingCart },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/discount", label: "Discounts", icon: BadgePercent },
  ],
  inventory: [
    { href: "/inventory-dashboard", label: "Inventory Dashboard", icon: Home },
    { href: "/inventory", label: "Inventory", icon: Package },
    { href: "/suppliers", label: "Suppliers", icon: Truck },
    { href: "/alerts", label: "Stock Alerts", icon: AlertCircle },
    { href: "/restock", label: "Restock", icon: RefreshCw },
  ],
};

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState<{ email: string; name: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
      }
    }
  }, []);

  if (!userInfo) return null;

  return (
    <div className="flex items-center space-x-2">
      <User size={20} />
      <div>
        <p className="font-medium">{userInfo.name} ({userInfo.role})</p>
        <p className="text-sm text-gray-500">{userInfo.email}</p>
      </div>
    </div>
  );
};

const Header = ({ onMenuClick, userRole, title }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white">
              {userRole.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">{userRole}</span>
                <ChevronDown size={16} className="ml-1 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const getUserFromStorage = () => {
  const stored = localStorage.getItem("userData");
  return stored ? JSON.parse(stored) : null;
};
const user = getUserFromStorage();
const userRole = user?.role || 'guest';

const DashboardLayout = () => {
  const [userRole, setUserRole] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser).role : 'guest';
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentNavigation = navigationConfig[userRole] || [];

  const handleRoleChange = (role) => {
    setUserRole(role);
    const defaultPages = {
      admin: '/admin-dashboard',
      cashier: '/cashier-dashboard',
      inventory: '/inventory-dashboard'
    };
    navigate(defaultPages[role]);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-teal-600 to-teal-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-teal-800">
          <div className="flex items-center space-x-2 text-white">
            <HeartPulse size={24} />
            <div>
              <h2 className="text-lg font-semibold leading-tight">VET-POS</h2>
              
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-teal-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {currentNavigation.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href;

              // Add divider after dashboard
              const isFirst = index === 0;
              return (
                <React.Fragment key={item.href}>
                  {isFirst && index !== currentNavigation.length - 1 && (
                    <li>
                      <Link
                        to={item.href}
                        className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-teal-800 text-white shadow-lg'
                            : 'text-teal-100 hover:bg-teal-600 hover:text-white'
                        }`}
                      >
                        <IconComponent size={20} className="mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                      <hr className="my-2 border-teal-400 opacity-50" />
                    </li>
                  )}
                  {!isFirst && (
                    <li>
                      <Link
                        to={item.href}
                        className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-teal-800 text-white shadow-lg'
                            : 'text-teal-100 hover:bg-teal-600 hover:text-white'
                        }`}
                      >
                        <IconComponent size={20} className="mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-teal-500">
          <div className="flex items-center space-x-3 text-teal-100">
            <User size={20} />
            <div>
              <p className="font-medium capitalize">{user?.name} ({user?.role})</p>
              <p className="text-sm text-teal-200">{user?.email}</p>
            </div>
          </div>
         <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          userRole={userRole}
          title={`${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard`}
        />
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
