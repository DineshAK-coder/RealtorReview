import React from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  Building,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  Building2,
  Lock,
  UserCheck
} from 'lucide-react';
import { Property, Review } from '../types';

interface PropertyProfileViewProps {
  property: Property;
  reviews: Review[];
  isSaved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onWriteReview: () => void;
  onReportReview: (review: Review) => void;
}

export const PropertyProfileView: React.FC<PropertyProfileViewProps> = ({
  property,
  reviews,
  isSaved,
  onBack,
  onToggleSave,
  onWriteReview,
  onReportReview,
}) => {
  const propertyReviews = reviews.filter((r) => r.propertyId === property.id);
  const reviewCount = propertyReviews.length;

  // Calculate dynamic overall rating and sub-ratings from verified reviews
  const avgRating = reviewCount > 0
    ? Number((propertyReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
    : property.avgRating;

  const subRatings = reviewCount > 0
    ? {
        maintenance: Number((propertyReviews.reduce((sum, r) => sum + (r.subRatings?.maintenance ?? r.rating), 0) / reviewCount).toFixed(1)),
        communication: Number((propertyReviews.reduce((sum, r) => sum + (r.subRatings?.communication ?? r.rating), 0) / reviewCount).toFixed(1)),
        depositReturn: Number((propertyReviews.reduce((sum, r) => sum + (r.subRatings?.depositReturn ?? r.rating), 0) / reviewCount).toFixed(1)),
        safety: Number((propertyReviews.reduce((sum, r) => sum + (r.subRatings?.safety ?? r.rating), 0) / reviewCount).toFixed(1)),
      }
    : property.subRatings || {
        maintenance: property.avgRating,
        communication: property.avgRating,
        depositReturn: property.avgRating,
        safety: property.avgRating,
      };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-800 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Property Search</span>
      </button>

      {/* Property Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="relative h-64 sm:h-80 bg-slate-900">
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c3843] via-[#0c3843]/40 to-transparent" />

          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <button
              onClick={onToggleSave}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition ${
                isSaved
                  ? 'bg-amber-500 text-white'
                  : 'bg-[#0c3843]/80 backdrop-blur-md text-white border border-teal-800'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? 'Saved' : 'Save to Watchlist'}</span>
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-300">
              <span className="bg-[#0c3843] text-teal-100 border border-teal-700/60 px-3 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                {property.type}
              </span>
              <span className="flex items-center text-slate-200">
                <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400" />
                {property.locality}, {property.city}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {property.name}
            </h1>
          </div>
        </div>

        {/* Rating Breakdown Dashboard Bar */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Overall Rating Score Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-2xs">
              <div className="text-4xl font-black text-slate-900 flex items-center justify-center space-x-2">
                <span>{avgRating.toFixed(1)}</span>
                <Star className="w-8 h-8 fill-amber-400 text-amber-500" />
              </div>
              <p className="text-xs font-extrabold text-slate-700">
                Overall Tenant Satisfaction
              </p>
              <p className="text-[11px] font-medium text-slate-500">
                Based on {propertyReviews.length || property.ratingsCount} verified reviews
              </p>
              <button
                onClick={onWriteReview}
                className="w-full mt-3 bg-[#0c3843] hover:bg-[#07252c] text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-2xs transition flex items-center justify-center space-x-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Write a Tenant Review</span>
              </button>
            </div>

            {/* Sub-category Rating Bars */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Maintenance & Repairs</span>
                  <span className="text-teal-950">{subRatings.maintenance.toFixed(1)} / 5</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-700 h-full rounded-full"
                    style={{ width: `${(subRatings.maintenance / 5) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Response time, plumbing, electrical & lifts</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Deposit Return & Refund</span>
                  <span className="text-teal-950">{subRatings.depositReturn.toFixed(1)} / 5</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-500 h-full rounded-full"
                    style={{ width: `${(subRatings.depositReturn / 5) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Fair deductions & prompt return timeline</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Landlord Communication</span>
                  <span className="text-teal-950">{subRatings.communication.toFixed(1)} / 5</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-700 h-full rounded-full"
                    style={{ width: `${(subRatings.communication / 5) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Privacy respect, notice periods & transparency</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Safety & Legal Compliance</span>
                  <span className="text-teal-950">{subRatings.safety.toFixed(1)} / 5</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${(subRatings.safety / 5) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Gated security, rental agreement & society rules</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#0c3843]" />
            <span>Fact-Based Tenant Reviews ({propertyReviews.length})</span>
          </h2>

          <button
            onClick={onWriteReview}
            className="text-xs bg-[#0c3843] hover:bg-[#07252c] text-white font-extrabold px-4 py-2 rounded-xl transition shadow-2xs"
          >
            + Add Review
          </button>
        </div>

        {propertyReviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs space-y-2">
            <p className="font-bold text-slate-900">No tenant reviews submitted for this property yet.</p>
            <p>Have you lived or rented here? Share your firsthand experience to help future tenants!</p>
            <button
              onClick={onWriteReview}
              className="mt-2 text-xs bg-[#0c3843] hover:bg-[#07252c] text-white font-bold px-4 py-2 rounded-xl transition"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {propertyReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 hover:border-slate-300 transition"
              >
                {/* Author Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-[#0c3843] text-teal-200 flex items-center justify-center font-black text-xs shadow-2xs">
                      {review.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-slate-900">{review.authorName}</span>
                        {review.isVerifiedTenant && (
                          <span className="inline-flex items-center space-x-1 bg-teal-50 text-[#0c3843] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-teal-200">
                            <UserCheck className="w-3 h-3 text-[#0c3843]" />
                            <span>Verified Tenant</span>
                          </span>
                        )}
                        {review.isFirsthand && (
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                            Firsthand Tenancy
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center space-x-1 bg-[#0c3843] text-white font-black text-xs px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{review.rating}.0 / 5</span>
                  </div>
                </div>

                {/* Sub-ratings Breakdown pills */}
                {review.subRatings && (
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold">
                      Maintenance: <strong>{review.subRatings.maintenance}/5</strong>
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold">
                      Deposit Return: <strong>{review.subRatings.depositReturn}/5</strong>
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold">
                      Communication: <strong>{review.subRatings.communication}/5</strong>
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold">
                      Safety & Legal: <strong>{review.subRatings.safety}/5</strong>
                    </span>
                  </div>
                )}

                {/* Review Text Body */}
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                  {review.comment}
                </p>

                {/* Landlord / Owner Official Response Box */}
                {review.ownerResponse ? (
                  <div className="bg-teal-950 text-teal-50 rounded-2xl p-4 border border-teal-900 space-y-1.5 shadow-inner">
                    <div className="flex items-center justify-between text-xs font-bold text-yellow-400">
                      <span className="flex items-center space-x-1.5">
                        <Building2 className="w-4 h-4" />
                        <span>Official Landlord / Owner Response ({review.ownerResponse.ownerName || 'Property Management'})</span>
                      </span>
                      <span className="text-[10px] text-teal-300 font-normal">
                        {new Date(review.ownerResponse.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-teal-100 leading-relaxed font-normal">
                      "{review.ownerResponse.text}"
                    </p>
                  </div>
                ) : (
                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 italic">No landlord response posted yet.</span>
                    <button
                      onClick={() => onReportReview(review)}
                      className="inline-flex items-center space-x-1 text-slate-400 hover:text-rose-600 font-semibold transition"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Report Review</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
