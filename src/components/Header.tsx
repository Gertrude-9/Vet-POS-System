import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ onMenuClick, userRole, userName, title }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:px-8">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Menu size={24} />
      </button>

      <h1 className="text-xl font-semibold text-gray-800 capitalize">
        {title || `${userRole} Portal`}
      </h1>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Welcome back, <span className="font-medium capitalize">{userName}</span>
        </div>
      </div>
    </header>
  );
};



export default Header;
