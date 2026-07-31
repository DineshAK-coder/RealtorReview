import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldAlert,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  Home,
  Bookmark as WatchlistIcon,
  LayoutDashboard,
  UserCheck,
  Building2,
  Send,
  Info
} from 'lucide-react';
import { Property, SubRatings } from '../types';

interface WriteReviewViewProps {
  property: Property | null;
  allProperties: Property[];
  onSubmitReview: (reviewData: {
    propertyId: string;
    rating: number;
    subRatings: SubRatings;
    comment: string;
    isFirsthand: boolean;
  }) => void;
  hasAcceptedGuidelines: boolean;
  onRequestGuidelines: () => void;
  setActiveTab: (tab: any) => void;
}

export const WriteReviewView: React.FC<WriteReviewViewProps> = ({
  property,
  allProperties,
  onSubmitReview,
  hasAcceptedGuidelines,
  onRequestGuidelines,
  setActiveTab,
}) => {
  const [selectedPropId, setSelectedPropId] = useState(property?.id || allProperties[0]?.id || '');
  const [overallRating, setOverallRating] = useState(5);
  const [maintRating, setMaintRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [depositRating, setDepositRating] = useState(5);
  const [safetyRating, setSafetyRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isFirsthand, setIsFirsthand] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (property?.id) {
      setSelectedPropId(property.id);
    } else if (allProperties.length > 0 && !selectedPropId) {
      setSelectedPropId(allProperties[0].id);
    }
  }, [property?.id, allProperties]);

  const updateSubRating = (type: 'maint' | 'deposit' | 'comm' | 'safety', val: number) => {
    let m = type === 'maint' ? val : maintRating;
    let d = type === 'deposit' ? val : depositRating;
    let c = type === 'comm' ? val : commRating;
    let s = type === 'safety' ? val : safetyRating;

    if (type === 'maint') setMaintRating(val);
    if (type === 'deposit') setDepositRating(val);
    if (type === 'comm') setCommRating(val);
    if (type === 'safety') setSafetyRating(val);

    const avg = Math.round((m + d + c + s) / 4);
    setOverallRating(avg);
  };

  const updateOverallRating = (val: number) => {
    setOverallRating(val);
    setMaintRating(val);
    setDepositRating(val);
    setCommRating(val);
    setSafetyRating(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!hasAcceptedGuidelines) {
      onRequestGuidelines();
      return;
    }

    if (!selectedPropId) {
      setErrorMsg('Please select a property to review.');
      return;
    }

    if (!comment || comment.trim().length < 20) {
      setErrorMsg('Please write at least 20 characters describing your tenancy experience.');
      return;
    }

    if (!isFirsthand) {
      setErrorMsg('You must confirm you were a firsthand tenant of this property.');
      return;
    }

    onSubmitReview({
      propertyId: selectedPropId,
      rating: overallRating,
      subRatings: {
        maintenance: maintRating,
        communication: commRating,
        depositReturn: depositRating,
        safety: safetyRating,
      },
      comment,
      isFirsthand,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setActiveTab('home');
    }, 1800);
  };

  const renderStars = (current: number, setFn: (val: number) => void) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setFn(star)}
          className="p-1 focus:outline-none hover:scale-110 transition-transform cursor-pointer"
        >
          <Star
            className={`w-5 h-5 ${
              star <= current ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
            }`}
          />
        </button>
      ))}
      <span className="text-xs font-bold text-slate-800 ml-2">{current} / 5</span>
    </div>
  );

  return (
    <div className="flex gap-8 items-start">
      {/* Left Sidebar */}
      <aside className="w-56 shrink-0 hidden md:block space-y-6 pt-2">
        {/* User Card */}
        <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-[#0c3843] text-white flex items-center justify-center font-bold text-xs shrink-0">
            <UserCheck className="w-4 h-4 text-teal-300" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Verified Member</div>
            <div className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              TENANT CONTRIBUTOR
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="space-y-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('home')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
          >
            <WatchlistIcon className="w-4 h-4 text-slate-500" />
            <span>Watchlist</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
          >
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span>My Reviews</span>
          </button>

          <button
            onClick={() => setActiveTab('write-review')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-[#0c3843] text-white font-bold shadow-2xs text-left"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Write Review</span>
          </button>

          <button
            onClick={() => setActiveTab('owner-dashboard')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <span>Dashboard</span>
          </button>
        </nav>

        {/* Community Card Box */}
        <div className="bg-[#f6f2e8] rounded-xl p-4 border border-amber-200/60 space-y-2">
          <p className="text-xs text-slate-800 font-bold">100% Anonymous</p>
          <p className="text-[11px] text-slate-600 font-normal leading-relaxed">
            Your name is never shared with landlords or property managers.
          </p>
        </div>
      </aside>

      {/* Main Review Form Area */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Header Title */}
        <div className="space-y-1 pt-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Post a <span className="text-[#b87322]">Verified Tenant Review</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
            Help Indian renters know before they sign. Share factual details on deposit returns, maintenance speed, landlord behavior, and safety.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-10 text-center space-y-3 my-6">
            <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-emerald-950">Review Submitted Successfully!</h2>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Thank you for contributing to the tenant community. Redirecting you back to the home view...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            {!hasAcceptedGuidelines && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-950">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Review Guidelines Acceptance Required</p>
                  <p className="text-amber-800">
                    To maintain high credibility, all reviews must be objective, factual, and free from personal defamation.
                  </p>
                  <button
                    type="button"
                    onClick={onRequestGuidelines}
                    className="mt-2 text-xs bg-[#8c6512] hover:bg-[#72520d] text-white font-bold px-3.5 py-1.5 rounded-lg shadow-2xs transition inline-block"
                  >
                    Read & Accept Community Guidelines
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Select Property */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Select Rental Property / Society *
              </label>
              <select
                value={selectedPropId}
                onChange={(e) => setSelectedPropId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c3843]"
              >
                {allProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.locality}, {p.city} ({p.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Star Ratings Grid */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block">Overall Rating *</span>
                  <span className="text-[11px] text-slate-500">How was your overall experience living here?</span>
                </div>
                {renderStars(overallRating, updateOverallRating)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <span className="block font-bold text-slate-800 text-xs">Maintenance & Repairs</span>
                  {renderStars(maintRating, (val) => updateSubRating('maint', val))}
                </div>

                <div className="space-y-1">
                  <span className="block font-bold text-slate-800 text-xs">Deposit Return Timeline</span>
                  {renderStars(depositRating, (val) => updateSubRating('deposit', val))}
                </div>

                <div className="space-y-1">
                  <span className="block font-bold text-slate-800 text-xs">Landlord Communication</span>
                  {renderStars(commRating, (val) => updateSubRating('comm', val))}
                </div>

                <div className="space-y-1">
                  <span className="block font-bold text-slate-800 text-xs">Safety & Legal Compliance</span>
                  {renderStars(safetyRating, (val) => updateSubRating('safety', val))}
                </div>
              </div>
            </div>

            {/* Review Comment Details */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Detailed Tenancy Review & Facts *
              </label>
              <textarea
                required
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your firsthand experience: Water supply quality, maintenance response time, security deposit refund, noise levels, society management rules, and landlord conduct..."
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0c3843] text-slate-800 text-xs leading-relaxed"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Minimum 20 characters required</span>
                <span>{comment.length} characters</span>
              </div>
            </div>

            {/* Firsthand Tenancy Checkbox */}
            <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <input
                type="checkbox"
                id="firsthand-check"
                checked={isFirsthand}
                onChange={(e) => setIsFirsthand(e.target.checked)}
                className="mt-0.5 rounded text-[#0c3843] focus:ring-[#0c3843] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="firsthand-check" className="text-xs text-slate-700 font-medium cursor-pointer leading-normal">
                I verify that I am or was a firsthand tenant / occupant of this property and my review is accurate, truthful, and free from personal conflict of interest.
              </label>
            </div>

            {/* Form Submit Footer */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-[#0c3843] hover:bg-[#07252c] text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-2xs flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Anonymous Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
