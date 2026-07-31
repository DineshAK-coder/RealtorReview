import React, { useState } from 'react';
import {
  Building2,
  MessageSquare,
  Send,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Star,
  AlertCircle
} from 'lucide-react';
import { Property, Review } from '../types';

interface OwnerDashboardViewProps {
  properties: Property[];
  reviews: Review[];
  onSubmitOwnerResponse: (reviewId: string, responseText: string) => void;
  onExploreProperties: () => void;
}

export const OwnerDashboardView: React.FC<OwnerDashboardViewProps> = ({
  properties,
  reviews,
  onSubmitOwnerResponse,
  onExploreProperties,
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [responseTextMap, setResponseTextMap] = useState<Record<string, string>>({});
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'needs-response'>('needs-response');

  const filteredReviews = reviews.filter((r) => {
    const matchesProp = selectedPropertyId === 'all' || r.propertyId === selectedPropertyId;
    if (activeTabFilter === 'needs-response') {
      return matchesProp && !r.ownerResponse;
    }
    return matchesProp;
  });

  const handleResponseSubmit = (reviewId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = responseTextMap[reviewId];
    if (!text || text.trim().length < 10) return;

    onSubmitOwnerResponse(reviewId, text.trim());
    setResponseTextMap((prev) => ({ ...prev, [reviewId]: '' }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Owner Header */}
      <div className="bg-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-teal-900 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500 text-teal-950 flex items-center justify-center font-black shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Landlord & Property Owner Hub</h1>
              <p className="text-xs text-teal-200 font-medium">
                Public Transparency Portal for Indian Rental Properties
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-teal-900/80 p-1 rounded-2xl border border-teal-800 text-xs font-bold">
            <button
              onClick={() => setActiveTabFilter('needs-response')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTabFilter === 'needs-response'
                  ? 'bg-yellow-500 text-teal-950 shadow-2xs font-black'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              Needs Response
            </button>
            <button
              onClick={() => setActiveTabFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTabFilter === 'all'
                  ? 'bg-yellow-500 text-teal-950 shadow-2xs font-black'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              All Reviews
            </button>
          </div>
        </div>

        {/* Immutable Review Policy Notice */}
        <div className="bg-teal-900/60 p-4 rounded-2xl border border-teal-800 flex items-start space-x-3 text-xs text-teal-100 leading-relaxed">
          <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-yellow-400 font-extrabold block">
              Immutable Review Integrity Policy
            </strong>
            Property owners can post official public responses to clarify context, explain repairs, or share resolution proof. <span className="underline font-bold text-white">Landlords CANNOT edit, alter, hide, or delete tenant reviews.</span>
          </div>
        </div>
      </div>

      {/* Property Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold">
        <div className="flex items-center space-x-2 text-slate-700">
          <span>Filter Property:</span>
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-teal-950 focus:outline-none cursor-pointer"
          >
            <option value="all">All Managed Properties ({properties.length})</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.city})
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-500 font-medium">
          Showing {filteredReviews.length} tenant review{filteredReviews.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-teal-950">No pending reviews requiring response</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All tenant feedback for the selected property filter has been answered or no reviews match this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => {
            const prop = properties.find((p) => p.id === review.propertyId);

            return (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-teal-300 transition"
              >
                {/* Review Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-black text-teal-950 block">
                      {prop?.name || review.propertyTitle || 'Rental Property'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Tenant: <strong>{review.authorName}</strong> • {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 bg-yellow-500 text-teal-950 font-extrabold text-xs px-2.5 py-1 rounded-lg self-start sm:self-auto">
                    <Star className="w-3.5 h-3.5 fill-teal-950" />
                    <span>{review.rating}.0 / 5</span>
                  </div>
                </div>

                {/* Sub-ratings */}
                {review.subRatings && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-semibold">
                    <div>Maintenance: <strong className="text-teal-950">{review.subRatings.maintenance}/5</strong></div>
                    <div>Deposit Return: <strong className="text-teal-950">{review.subRatings.depositReturn}/5</strong></div>
                    <div>Communication: <strong className="text-teal-950">{review.subRatings.communication}/5</strong></div>
                    <div>Safety & Legal: <strong className="text-teal-950">{review.subRatings.safety}/5</strong></div>
                  </div>
                )}

                {/* Tenant Review Comment */}
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                  "{review.comment}"
                </p>

                {/* Owner Response Section */}
                {review.ownerResponse ? (
                  <div className="bg-teal-950 text-teal-50 rounded-2xl p-4 border border-teal-900 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-yellow-400">
                      <span>Official Owner Response Posted</span>
                      <span className="text-[10px] text-teal-300 font-normal">
                        {new Date(review.ownerResponse.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-teal-100">
                      "{review.ownerResponse.text}"
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => handleResponseSubmit(review.id, e)}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs font-medium"
                  >
                    <label className="block text-teal-950 font-extrabold flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4 text-teal-900" />
                      <span>Post Official Public Response as Landlord / Management:</span>
                    </label>

                    <textarea
                      required
                      rows={2}
                      value={responseTextMap[review.id] || ''}
                      onChange={(e) =>
                        setResponseTextMap({ ...responseTextMap, [review.id]: e.target.value })
                      }
                      placeholder="e.g. 'Thank you for the feedback. The plumbing issue mentioned was repaired on June 12th, and deposit balance of ₹45,000 was refunded via NEFT on June 15th.'"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-800"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Owner responses are permanent and publicly attached to this review.
                      </span>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-teal-950 font-extrabold rounded-full shadow-xs flex items-center space-x-1.5 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Response</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
