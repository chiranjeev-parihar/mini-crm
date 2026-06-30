import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

/**
 * Get initials from a name or email for the avatar.
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.name || user?.email || 'User';
  const initials = getInitials(displayName);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb placeholder */}
        <div className="hidden md:block">
          <p className="text-sm text-slate-500">
            Welcome back, <span className="font-medium text-slate-700">{displayName}</span>
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
          {/* Badge dot */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-slate-200 md:block" />

        {/* User profile */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-700">{displayName}</p>
            {user?.email && (
              <p className="text-xs text-slate-500">{user.email}</p>
            )}
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
