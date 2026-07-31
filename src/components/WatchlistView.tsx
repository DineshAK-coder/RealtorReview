import React from 'react';
import { Bookmark, Star, MapPin, Building, ArrowRight, Trash2, MessageSquare, Sparkles } from 'lucide-react';
import { Property } from '../types';

interface WatchlistViewProps {
  savedProperties: Property[];
  onSelectProperty: (property: Property) => void;
  onRemoveFromWatchlist: (propertyId: string) => void;
  onWriteReview: (property: Property) => void;
  onExploreProperties: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  savedProperties,
  onSelectProperty,
  onRemoveFromWatchlist,
  onWriteReview,
  onExploreProperties,
}) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-950 text-yellow-400 flex items-center justify-center font-bold">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-teal-950">Property Watchlist & Alerts</h1>
              <p className="text-xs text-slate-500 font-medium">
                Keep track of properties you're considering renting before signing a lease
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onExploreProperties}
          className="text-xs bg-teal-950 hover:bg-teal-900 text-yellow-400 font-bold px-4 py-2.5 rounded-full transition shadow-xs flex items-center justify-center space-x-1.5"
        >
          <span>Explore More Properties</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {savedProperties.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-teal-950">Your watchlist is empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Click the bookmark icon on any property card to save it here for quick monitoring and new review alerts.
            </p>
          </div>
          <button
            onClick={onExploreProperties}
            className="text-xs bg-yellow-500 hover:bg-yellow-400 text-teal-950 font-extrabold px-5 py-2.5 rounded-full transition shadow-xs inline-flex items-center space-x-2"
          >
            <span>Browse Rental Properties</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-teal-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-900">
                  <img
                    src={property.imageUrl}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  {/* New Review Indicator Badge */}
                  <span className="absolute top-3 left-3 bg-yellow-500 text-teal-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Watchlist Alert Active</span>
                  </span>

                  <button
                    onClick={() => onRemoveFromWatchlist(property.id)}
                    className="absolute top-3 right-3 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold text-slate-200 truncate max-w-[180px]">
                      {property.locality}, {property.city}
                    </span>
                    <span className="bg-yellow-500 text-teal-950 font-black px-2 py-0.5 rounded text-xs flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-teal-950" />
                      <span>{property.avgRating.toFixed(1)}</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3
                      onClick={() => onSelectProperty(property)}
                      className="text-sm font-extrabold text-teal-950 hover:text-teal-700 cursor-pointer"
                    >
                      {property.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      {property.ratingsCount} verified tenant review{property.ratingsCount === 1 ? '' : 's'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-semibold">
                    <div>
                      <span className="text-slate-500 block">Maintenance</span>
                      <span className="text-teal-950 font-bold">{property.subRatings?.maintenance.toFixed(1)} / 5</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Deposit Return</span>
                      <span className="text-teal-950 font-bold">{property.subRatings?.depositReturn.toFixed(1)} / 5</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center space-x-2">
                <button
                  onClick={() => onSelectProperty(property)}
                  className="flex-1 text-center py-2 px-3 text-xs font-bold text-teal-950 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  View Reviews
                </button>
                <button
                  onClick={() => onWriteReview(property)}
                  className="p-2 bg-yellow-500 hover:bg-yellow-400 text-teal-950 rounded-xl transition"
                  title="Write Review"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
