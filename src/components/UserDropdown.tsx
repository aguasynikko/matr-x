import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function UserDropdown() {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogOut = async () => {
    try {
      console.log('Logout button clicked');
      await logOut();
      console.log('Logout completed');
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 dark:bg-dark-input hover:bg-slate-300 dark:hover:bg-dark-hover transition-colors"
        title={user?.email}
      >
        <User size={20} className="text-slate-700 dark:text-dark-text-secondary" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-lg shadow-lg border border-slate-200 dark:border-dark-border py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-2 border-b border-slate-200 dark:border-dark-border">
            <p className="text-sm font-medium text-slate-900 dark:text-dark-text">
              {user?.username}
            </p>
            <p className="text-xs text-slate-500 dark:text-dark-text-tertiary truncate">
              {user?.email}
            </p>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogOut}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
