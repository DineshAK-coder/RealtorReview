import React from 'react';
import { ShieldCheck, FileCheck, Lock, AlertOctagon, Check } from 'lucide-react';

interface ReviewGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const ReviewGuidelinesModal: React.FC<ReviewGuidelinesModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-11 h-11 rounded-2xl bg-teal-950 text-yellow-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-teal-950">Tenant Review Policy & Guidelines</h3>
            <p className="text-xs text-slate-500">Fair, fact-based intelligence for Indian rental properties</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed font-normal">
          <div className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <FileCheck className="w-5 h-5 text-teal-900 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-teal-950 font-extrabold mb-0.5">1. Stick to Objective Facts</strong>
              <span>
                Focus on verifiable experiences during your tenancy: deposit return timeline, itemized repair bills, water/power reliability, and landlord communication.
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-teal-950 font-extrabold mb-0.5">2. Zero Tolerance for Slander or PII</strong>
              <span>
                Do not publish personal phone numbers, bank details, or defamatory insults. Abusive, unverified harassment will be flagged and removed.
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-teal-950 font-extrabold mb-0.5">3. Anonymous & Protected Identity</strong>
              <span>
                Your handle remains anonymous to protect you from retaliatory landlord pressure while empowering future renters.
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-teal-950 font-extrabold mb-0.5">4. Right of Owner Response</strong>
              <span>
                Property owners can post an official public response to provide context, but they cannot delete or alter your review.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="flex items-center space-x-1.5 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-teal-950 text-xs font-black rounded-full shadow-md transition"
          >
            <Check className="w-4 h-4" />
            <span>I Accept & Agree</span>
          </button>
        </div>
      </div>
    </div>
  );
};
