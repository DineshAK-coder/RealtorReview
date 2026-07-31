import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Star,
  Building,
  Bookmark,
  BookmarkCheck,
  Plus,
  SlidersHorizontal,
  ShieldCheck,
  Building2,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Home,
  Bookmark as WatchlistIcon,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Property, PropertyType, Review } from '../types';

interface HomeViewProps {
  properties: Property[];
  savedPropertyIds: string[];
  onSelectProperty: (property: Property) => void;
  onToggleSaveProperty: (propertyId: string) => void;
  onWriteReview: (property: Property) => void;
  onAddNewProperty: (newProp: Omit<Property, 'id' | 'avgRating' | 'ratingsCount' | 'subRatings' | 'createdAt'>) => void;
  setActiveTab?: (tab: any) => void;
  reviews?: Review[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  properties,
  savedPropertyIds,
  onSelectProperty,
  onToggleSaveProperty,
  onWriteReview,
  onAddNewProperty,
  setActiveTab,
  reviews = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'newest'>('rating');

  // Add property modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPropName, setNewPropName] = useState('');
  const [newPropLocality, setNewPropLocality] = useState('');
  const [newPropCity, setNewPropCity] = useState('Bangalore');
  const [newPropType, setNewPropType] = useState<PropertyType>('Apartment');
  const [newPropImg, setNewPropImg] = useState('');

  const cities = ['All Cities', 'Bengaluru', 'Mumbai', 'Delhi', 'Gurgaon', 'Pune', 'Hyderabad'];
  const propertyTypes = ['All', 'Apartment', 'Studio Apartment', 'House', 'PG', 'Commercial', 'Warehouse'];

  const popularTags = ['HSR Layout', 'Whitefield', 'Indiranagar', 'DLF Phase 5'];

  const filteredProperties = properties
    .filter((prop) => {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        prop.name.toLowerCase().includes(query) ||
        prop.locality.toLowerCase().includes(query) ||
        prop.city.toLowerCase().includes(query);

      const matchesCity =
        selectedCity === 'All Cities' ||
        selectedCity === 'All' ||
        prop.city.toLowerCase() === selectedCity.toLowerCase() ||
        (selectedCity === 'Bengaluru' && prop.city.toLowerCase() === 'bangalore');

      const matchesType = selectedType === 'All' || prop.type === selectedType;

      return matchesQuery && matchesCity && matchesType;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortBy === 'rating') {
        diff = b.avgRating - a.avgRating;
      } else if (sortBy === 'reviews') {
        diff = b.ratingsCount - a.ratingsCount;
      } else if (sortBy === 'newest') {
        diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });

  // Featured property (first or top rated)
  const featuredProperty = filteredProperties[0] || properties[0];
  const otherProperties = filteredProperties.slice(1, 5);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName || !newPropLocality) return;

    onAddNewProperty({
      name: newPropName,
      locality: newPropLocality,
      city: newPropCity,
      type: newPropType,
      imageUrl: newPropImg || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    });

    setNewPropName('');
    setNewPropLocality('');
    setIsAddModalOpen(false);
  };

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
            onClick={() => setActiveTab && setActiveTab('home')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-[#0c3843] text-white font-bold shadow-2xs text-left"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('watchlist')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
          >
            <WatchlistIcon className="w-4 h-4 text-slate-500" />
            <span>Watchlist</span>
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('profile')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
          >
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span>My Reviews</span>
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('owner-dashboard')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <span>Dashboard</span>
          </button>
        </nav>

        {/* Community Card Box */}
        <div className="bg-[#f6f2e8] rounded-xl p-4 border border-amber-200/60 space-y-3">
          <p className="text-xs text-slate-700 font-medium">Help build the community</p>
          <button
            onClick={() => onWriteReview(properties[0])}
            className="w-full bg-[#805811] hover:bg-[#68470c] text-white text-xs font-bold py-2 px-3 rounded-lg shadow-2xs transition"
          >
            Post Review
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 space-y-12 min-w-0">
        {/* Hero Section */}
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Real insights from real <span className="text-[#b87322]">tenants.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              Search and share verified experiences about properties, societies, and areas across India. Credible, community-driven, and anonymous.
            </p>
          </div>

          {/* Search Bar Container */}
          <div className="space-y-2">
            <div className="bg-white rounded-2xl p-2 shadow-2xs border border-slate-200 flex flex-col sm:flex-row items-center gap-2 max-w-3xl">
              <div className="relative flex-1 w-full flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by society name, address, or locality..."
                  className="w-full text-xs font-semibold pl-10 pr-3 py-2.5 text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-200 pl-0 sm:pl-2 pt-2 sm:pt-0">
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="text-xs font-bold bg-transparent text-slate-800 pl-8 pr-6 py-2 focus:outline-none cursor-pointer appearance-none"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {}}
                  className="bg-[#0c3843] hover:bg-[#07242c] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition whitespace-nowrap shadow-2xs"
                >
                  Search Reviews
                </button>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium pt-1">
              <span>Popular:</span>
              <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="hover:text-slate-900 hover:underline cursor-pointer transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trending Properties Section */}
        <div className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Trending Properties</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Societies with the most activity this week
              </p>
            </div>

            <button
              onClick={() => setSelectedType('All')}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 group"
            >
              <span>View all trending</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Grid Layout: Featured Left + 2x2 Right */}
          {featuredProperty && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Featured Main Card */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between group hover:border-slate-300 transition">
                <div>
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                      src={featuredProperty.imageUrl}
                      alt={featuredProperty.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-[#b87322] text-white text-[11px] font-extrabold px-3 py-1 rounded-md shadow-xs flex items-center gap-1">
                      ⚡ Trending #1
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          onClick={() => onSelectProperty(featuredProperty)}
                          className="text-lg font-bold text-slate-900 hover:text-[#0c3843] cursor-pointer"
                        >
                          {featuredProperty.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{featuredProperty.locality}, {featuredProperty.city}</span>
                        </p>
                      </div>

                      <div className="bg-[#0c3843] text-white font-black text-xs px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1">
                        <span>{featuredProperty.avgRating.toFixed(1)}</span>
                        <Star className="w-3 h-3 fill-white" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                      Excellent amenities and professional management. The water recycling plant and maintenance support is a big plus for the locality.
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{featuredProperty.ratingsCount || 128} Verified Reviews</span>
                  <button
                    onClick={() => onSelectProperty(featuredProperty)}
                    className="text-slate-900 font-bold hover:underline"
                  >
                    Read More
                  </button>
                </div>
              </div>

              {/* 2x2 Grid of Other Trending Cards */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherProperties.map((prop) => (
                  <div
                    key={prop.id}
                    onClick={() => onSelectProperty(prop)}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-600" />
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                        <span>{prop.avgRating.toFixed(1)}</span>
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#0c3843]">
                        {prop.name}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500 line-clamp-1 mt-0.5">
                        {prop.locality}, {prop.city}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                      <span>{prop.ratingsCount} REVIEWS</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recently Reviewed Section */}
        <div className="bg-[#f4f5f7] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recently Reviewed</h2>
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Review Cards Sample */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    VERIFIED TENANT
                  </span>
                  <div className="flex text-amber-400">
                    {'★'.repeat(5)}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">Silver Oaks Society</h4>
                  <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>HSR Layout, Sector 2</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 font-normal italic leading-relaxed">
                  "The security is top-notch, but visitor parking is a mess. The gym equipment needs an upgrade, though maintenance responds quickly."
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span>42 Reviews</span>
                <span>2 hours ago</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    VERIFIED TENANT
                  </span>
                  <div className="flex text-amber-400">
                    {'★'.repeat(5)}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">Adarsh Palm Retreat</h4>
                  <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Bellandur, Bengaluru</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 font-normal italic leading-relaxed">
                  "Absolutely love the community vibe here. Water supply is 24/7 and the power backup never fails. Highly recommended for families."
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span>156 Reviews</span>
                <span>5 hours ago</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    VERIFIED TENANT
                  </span>
                  <div className="flex text-amber-400">
                    {'★'.repeat(5)}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">MANTRI Alpyne</h4>
                  <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Banashankari, Bengaluru</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 font-normal italic leading-relaxed">
                  "The lifts are often down for maintenance during peak hours. Otherwise, the flat construction quality and ventilation are great."
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span>29 Reviews</span>
                <span>1 day ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contribute Banner ("Contribute to the collective wisdom.") */}
        <div className="bg-[#083033] rounded-3xl p-8 lg:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-4 max-w-lg text-center lg:text-left">
            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Contribute to the collective wisdom.
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/90 font-normal leading-relaxed">
              Your review could be the deciding factor for someone's next home. Help the community by sharing your honest experience.
            </p>
            <button
              onClick={() => onWriteReview(properties[0])}
              className="bg-[#8c6512] hover:bg-[#72520d] text-white font-bold text-xs py-3 px-6 rounded-xl transition shadow-xs inline-block"
            >
              Write a Review Now
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-[#0f4043] rounded-2xl p-4 text-center border border-teal-800/40 min-w-[130px]">
              <div className="text-2xl font-black text-white">15k+</div>
              <div className="text-[10px] font-semibold text-teal-200 mt-0.5">Verified Reviews</div>
            </div>

            <div className="bg-[#0f4043] rounded-2xl p-4 text-center border border-teal-800/40 min-w-[130px]">
              <div className="text-2xl font-black text-white">2.4k</div>
              <div className="text-[10px] font-semibold text-teal-200 mt-0.5">Societies Listed</div>
            </div>

            <div className="bg-[#0f4043] rounded-2xl p-4 text-center border border-teal-800/40 min-w-[130px]">
              <div className="text-2xl font-black text-white">45</div>
              <div className="text-[10px] font-semibold text-teal-200 mt-0.5">Cities Covered</div>
            </div>

            <div className="bg-[#0f4043] rounded-2xl p-4 text-center border border-teal-800/40 min-w-[130px]">
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-[10px] font-semibold text-teal-200 mt-0.5">Anonymous</div>
            </div>
          </div>
        </div>

        {/* Category Filters and All Properties List */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Explore All Properties ({filteredProperties.length})</h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Property</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  selectedType === type
                    ? 'bg-[#0c3843] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredProperties.map((property) => {
              const isSaved = savedPropertyIds.includes(property.id);

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={property.imageUrl}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-[#0c3843] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                        {property.type}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSaveProperty(property.id);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                          isSaved ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-900/40 text-white hover:bg-slate-900/70'
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => onSelectProperty(property)}
                          className="text-sm font-bold text-slate-900 hover:text-[#0c3843] cursor-pointer line-clamp-1"
                        >
                          {property.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-900 shrink-0">
                          <span>{property.avgRating.toFixed(1)}</span>
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{property.locality}, {property.city}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between text-xs border-t border-slate-100 mt-2">
                    <span className="text-slate-500 font-medium">{property.ratingsCount} reviews</span>
                    <button
                      onClick={() => onSelectProperty(property)}
                      className="font-bold text-[#0c3843] hover:underline"
                    >
                      Inspect Profile →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-slate-700" />
                <span>List a New Rental Property</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Property / Building Name *</label>
                <input
                  type="text"
                  required
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  placeholder="e.g. Prestige Lakeside Habitat / Godrej United"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0c3843]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Locality / Area *</label>
                  <input
                    type="text"
                    required
                    value={newPropLocality}
                    onChange={(e) => setNewPropLocality(e.target.value)}
                    placeholder="e.g. Whitefield"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0c3843]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">City *</label>
                  <select
                    value={newPropCity}
                    onChange={(e) => setNewPropCity(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c3843]"
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Gurgaon">Gurgaon</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Property Type</label>
                  <select
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c3843]"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Studio Apartment">Studio Apartment</option>
                    <option value="House">Independent House / Villa</option>
                    <option value="PG">PG / Co-Living</option>
                    <option value="Commercial">Commercial Space</option>
                    <option value="Warehouse">Warehouse / Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Photo Image URL (Optional)</label>
                  <input
                    type="url"
                    value={newPropImg}
                    onChange={(e) => setNewPropImg(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0c3843]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c3843] hover:bg-[#07242c] text-white font-extrabold rounded-xl shadow-2xs"
                >
                  Save & Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

