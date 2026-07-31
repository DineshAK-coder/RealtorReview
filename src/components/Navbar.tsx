import React from 'react';
import {
  Bell,
  Bookmark,
  User,
  PenSquare,
  Home,
  Shield,
  FileText
} from 'lucide-react';
import { ActiveTab } from '../types';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
  onOpenAuth: () => void;
  onSelectPropertyForReview?: () => void;
  onOpenGuidelines?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenAuth,
  onSelectPropertyForReview,
  onOpenGuidelines,
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white text-slate-800 border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center text-left focus:outline-none group hover:opacity-95 transition-opacity"
          >
            <Logo variant="color" size="md" />
          </button>

          {/* Navigation Items - Center Desktop */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-700">
            <button
              onClick={() => setActiveTab('home')}
              className={`py-5 transition border-b-2 ${
                activeTab === 'home'
                  ? 'border-slate-900 font-bold text-slate-900'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Home
            </button>

            <button
              onClick={onOpenGuidelines}
              className="py-5 transition border-b-2 border-transparent hover:text-slate-900"
            >
              Guidelines
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              className={`py-5 transition border-b-2 relative flex items-center gap-1 ${
                activeTab === 'watchlist'
                  ? 'border-slate-900 font-bold text-slate-900'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Saved
              {savedCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ml-0.5">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`py-5 transition border-b-2 ${
                activeTab === 'profile'
                  ? 'border-slate-900 font-bold text-slate-900'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Profile
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Bell Icon */}
            <button
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* Saved Bookmark Icon */}
            <button
              onClick={() => setActiveTab('watchlist')}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition relative"
              title="Saved Properties"
            >
              <Bookmark className="w-5 h-5" />
            </button>

            {/* Write Review Pill Button */}
            <button
              onClick={() => {
                if (onSelectPropertyForReview) {
                  onSelectPropertyForReview();
                } else {
                  setActiveTab('write-review');
                }
              }}
              className="bg-[#0c3843] hover:bg-[#07252c] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition shadow-2xs flex items-center space-x-1.5"
            >
              <PenSquare className="w-4 h-4" />
              <span>Write Review</span>
            </button>

            {/* User Account / Sign In */}
            <button
              onClick={user ? () => setActiveTab('profile') : onOpenAuth}
              className="flex items-center space-x-1.5 pl-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-50 border-t border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            activeTab === 'home' ? 'text-[#0c3843] font-bold' : ''
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg relative ${
            activeTab === 'watchlist' ? 'text-[#0c3843] font-bold' : ''
          }`}
        >
          <Bookmark className="w-4 h-4 mb-0.5" />
          <span>Saved ({savedCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('owner-dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            activeTab === 'owner-dashboard' ? 'text-[#0c3843] font-bold' : ''
          }`}
        >
          <Shield className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => {
            if (onSelectPropertyForReview) {
              onSelectPropertyForReview();
            } else {
              setActiveTab('write-review');
            }
          }}
          className="flex flex-col items-center py-1 px-2 rounded-lg text-[#0c3843] font-bold"
        >
          <PenSquare className="w-4 h-4 mb-0.5" />
          <span>Review</span>
        </button>
      </div>
    </header>
  );
};

