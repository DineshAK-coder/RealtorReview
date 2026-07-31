import React, { useState, useEffect } from 'react';
import { Star, ShieldAlert, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';
import { Property, Review, SubRatings } from '../types';

interface WriteReviewModalProps {
  isOpen: boolean;
  property: Property | null;
  allProperties: Property[];
  onClose: () => void;
  onSubmitReview: (reviewData: {
    propertyId: string;
    rating: number;
    subRatings: SubRatings;
    comment: string;
    isFirsthand: boolean;
  }) => void;
  hasAcceptedGuidelines: boolean;
  onRequestGuidelines: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  property,
  allProperties,
  onClose,
  onSubmitReview,
  hasAcceptedGuidelines,
  onRequestGuidelines,
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

    onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 my-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0c3843] text-amber-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Write an Anonymous Tenant Review</h3>
              <p className="text-xs text-slate-500">Fact-based reviews protecting Indian renters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {!hasAcceptedGuidelines && (
          <div className="p-3.5 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start space-x-2.5 text-xs text-yellow-950">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold">Review Guidelines Required</p>
              <p className="text-yellow-800 mt-0.5">
                Before submitting your first review, you must read and accept our community review guidelines.
              </p>
              <button
                type="button"
                onClick={onRequestGuidelines}
                className="mt-2 text-xs bg-yellow-500 hover:bg-yellow-600 text-teal-950 font-extrabold px-3 py-1 rounded-full shadow-2xs"
              >
                Read & Accept Guidelines
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          {/* Select Property if not provided */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Select Property *</label>
            <select
              value={selectedPropId}
              onChange={(e) => setSelectedPropId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-teal-950 focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              {allProperties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.locality}, {p.city})
                </option>
              ))}
            </select>
          </div>

          {/* Star Ratings Grid */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-black text-slate-900 text-xs">Overall Rating *</span>
              {renderStars(overallRating, updateOverallRating)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="block font-bold text-slate-700 mb-1">Maintenance & Repairs</span>
                {renderStars(maintRating, (val) => updateSubRating('maint', val))}
              </div>

              <div>
                <span className="block font-bold text-slate-700 mb-1">Deposit Return Timeline</span>
                {renderStars(depositRating, (val) => updateSubRating('deposit', val))}
              </div>

              <div>
                <span className="block font-bold text-slate-700 mb-1">Landlord Communication</span>
                {renderStars(commRating, (val) => updateSubRating('comm', val))}
              </div>

              <div>
                <span className="block font-bold text-slate-700 mb-1">Safety & Legal Compliance</span>
                {renderStars(safetyRating, (val) => updateSubRating('safety', val))}
              </div>
            </div>
          </div>

          {/* Comment Details */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Review Details & Tenancy Observations *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share specific facts: How fast was maintenance solved? Was the security deposit returned on time with bills? Was landlord respectful of privacy?"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-800"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Minimum 20 characters. Please stick strictly to objective facts.
            </span>
          </div>

          {/* Firsthand Tenancy Checkbox */}
          <div className="flex items-start space-x-2 bg-teal-50/60 p-3 rounded-xl border border-teal-100">
            <input
              type="checkbox"
              id="firsthand"
              checked={isFirsthand}
              onChange={(e) => setIsFirsthand(e.target.checked)}
              className="mt-0.5 rounded text-teal-900 focus:ring-teal-700"
            />
            <label htmlFor="firsthand" className="text-[11px] text-teal-950 font-semibold cursor-pointer">
              I confirm under penalty of perjury that I am or was a firsthand tenant / occupant of this property and my review is accurate and truthful.
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0c3843] hover:bg-[#07252c] text-white font-extrabold rounded-xl shadow-2xs transition"
            >
              Submit Anonymous Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
