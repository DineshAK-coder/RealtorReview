import React, { useState } from 'react';
import { AlertTriangle, Flag, ShieldAlert } from 'lucide-react';
import { ReportReason, Review } from '../types';

interface ReportReviewModalProps {
  isOpen: boolean;
  review: Review | null;
  onClose: () => void;
  onSubmitReport: (reportData: {
    reviewId: string;
    propertyId: string;
    reason: ReportReason;
    details: string;
  }) => void;
}

export const ReportReviewModal: React.FC<ReportReviewModalProps> = ({
  isOpen,
  review,
  onClose,
  onSubmitReport,
}) => {
  if (!isOpen || !review) return null;

  const [reason, setReason] = useState<ReportReason>('Inaccurate Facts');
  const [details, setDetails] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || details.trim().length < 10) {
      setErrorMsg('Please provide at least 10 characters explaining why this review should be flagged.');
      return;
    }

    onSubmitReport({
      reviewId: review.id,
      propertyId: review.propertyId,
      reason,
      details,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-extrabold text-teal-950">Report a Review</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Review Context Preview */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 italic space-y-1">
          <span className="font-bold text-teal-950 not-italic block">
            Review by {review.authorName}:
          </span>
          <p className="line-clamp-2">"{review.comment}"</p>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Primary Reason *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-teal-950 focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <option value="Inaccurate Facts">Inaccurate Facts / False Claim</option>
              <option value="Personal Attack / Harassment">Personal Attack / Harassment</option>
              <option value="Defamation / Hate Speech">Defamation / Hate Speech</option>
              <option value="Spam or Fake Review">Spam or Fake Review</option>
              <option value="Other">Other Policy Violation</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Additional Details *</label>
            <textarea
              required
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain why this review violates RealtorReview policy or contains false information..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-800"
            />
          </div>

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
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-full shadow-xs flex items-center space-x-1.5"
            >
              <Flag className="w-4 h-4" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
