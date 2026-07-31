import React from 'react';
import { LogIn, User, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, signInWithGoogle, signInAsGuest, logout, error } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-5">
        <div className="flex justify-center">
          <Logo variant="dark" size="lg" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-teal-950">Firebase Workspace Auth</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Sign in to access your isolated Firestore workspace and sync tasks across devices.
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 text-left">
            {error}
          </div>
        )}

        {user ? (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-left">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-emerald-900 truncate">
                  {user.displayName || (user.isAnonymous ? 'Guest User' : 'Authenticated')}
                </p>
                <p className="text-[11px] text-emerald-700 truncate">{user.email || user.uid}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 bg-teal-950 hover:bg-teal-900 text-white font-bold text-xs rounded-full transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={async () => {
                await signInWithGoogle();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-teal-950 font-bold text-xs py-2.5 px-4 border border-slate-200 rounded-full shadow-xs transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign In with Google</span>
            </button>

            <button
              onClick={async () => {
                await signInAsGuest();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-teal-950 font-bold text-xs py-2.5 px-4 rounded-full shadow-xs transition"
            >
              <User className="w-4 h-4" />
              <span>Continue as Anonymous Guest</span>
            </button>

            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold pt-2"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
