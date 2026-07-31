import React, { useState } from 'react';
import {
  User,
  LogOut,
  Building2,
  Star,
  Bookmark,
  Flag,
  MessageSquare,
  Shield,
  Edit2,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Property, Review, ReviewReport } from '../types';

interface ProfileSettingsViewProps {
  myReviews: Review[];
  savedProperties: Property[];
  myReports: ReviewReport[];
  onOpenAuth: () => void;
  onSelectProperty: (property: Property) => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  myReviews,
  savedProperties,
  myReports,
  onOpenAuth,
  onSelectProperty,
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'reviews' | 'saved' | 'reports'>('reviews');
  const [displayNameInput, setDisplayNameInput] = useState(user?.displayName || 'Anonymous Renter');
  const [isOwnerRole, setIsOwnerRole] = useState(false);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Account Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-3xl bg-teal-950 text-yellow-400 border border-teal-900 flex items-center justify-center text-2xl font-black shadow-md">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-xl font-black text-teal-950">
                {user?.displayName || (user?.isAnonymous ? 'Guest User' : 'Authenticated User')}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {user?.email || 'Anonymous Guest Session • Protected Identity'}
              </p>
            </div>
          </div>

          {user ? (
            <button
              onClick={() => logout()}
              className="flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-full transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 text-xs bg-yellow-500 hover:bg-yellow-400 text-teal-950 font-extrabold px-5 py-2.5 rounded-full transition shadow-xs"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSaveProfile} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs font-medium">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-teal-950 flex items-center space-x-2">
              <Edit2 className="w-4 h-4 text-teal-900" />
              <span>User Profile & Display Settings</span>
            </h3>
            {isSavedNotice && (
              <span className="text-emerald-700 font-bold text-[11px] flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" /> Saved successfully
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Public Display Handle</label>
              <input
                type="text"
                value={displayNameInput}
                onChange={(e) => setDisplayNameInput(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-teal-950 focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Shown publicly on your submitted tenant reviews.
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <label className="text-slate-700 font-bold mb-1">Account Role</label>
              <div className="flex items-center space-x-3 bg-white p-2.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="ownerRole"
                  checked={isOwnerRole}
                  onChange={(e) => setIsOwnerRole(e.target.checked)}
                  className="rounded text-teal-900 focus:ring-teal-700"
                />
                <label htmlFor="ownerRole" className="text-xs text-teal-950 font-bold cursor-pointer">
                  I am a Property Owner / Landlord
                </label>
              </div>
            </div>
          </div>

          <div className="pt-1 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-950 hover:bg-teal-900 text-yellow-400 font-bold rounded-full transition text-xs shadow-xs"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex items-center space-x-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition ${
            activeTab === 'reviews'
              ? 'bg-teal-950 text-yellow-400 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Reviews ({myReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition ${
            activeTab === 'saved'
              ? 'bg-teal-950 text-yellow-400 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Properties ({savedProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition ${
            activeTab === 'reports'
              ? 'bg-teal-950 text-yellow-400 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>My Flagged Reports ({myReports.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {myReviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
              You haven't submitted any tenant reviews yet.
            </div>
          ) : (
            myReviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-teal-950">
                  <span>{rev.propertyTitle || 'Rental Property Review'}</span>
                  <span className="flex items-center text-yellow-600">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 mr-1" />
                    {rev.rating}.0 / 5
                  </span>
                </div>
                <p className="text-slate-700">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 block">
                  Posted on {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedProperties.length === 0 ? (
            <div className="col-span-2 bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
              No saved properties in your watchlist.
            </div>
          ) : (
            savedProperties.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-teal-950">{p.name}</h4>
                  <p className="text-[11px] text-slate-500">{p.locality}, {p.city}</p>
                </div>
                <button
                  onClick={() => onSelectProperty(p)}
                  className="px-3 py-1.5 bg-yellow-500 text-teal-950 text-xs font-bold rounded-xl"
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-3">
          {myReports.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
              You have not submitted any review reports.
            </div>
          ) : (
            myReports.map((rep) => (
              <div key={rep.id} className="bg-white rounded-2xl border border-slate-200 p-4 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-teal-950">
                  <span>Reason: {rep.reason}</span>
                  <span className="capitalize bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                    Status: {rep.status}
                  </span>
                </div>
                <p className="text-slate-600">{rep.details}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
