import React, { useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError } from './lib/firebase';
import { useAuth } from './context/AuthContext';
import {
  ActiveTab,
  Property,
  Review,
  ReviewReport,
  SavedProperty,
  SubRatings,
  OperationType
} from './types';
import { INITIAL_PROPERTIES, INITIAL_REVIEWS } from './lib/sampleData';

import { Navbar } from './components/Navbar';
import { Logo } from './components/Logo';
import { HomeView } from './components/HomeView';
import { PropertyProfileView } from './components/PropertyProfileView';
import { WriteReviewModal } from './components/WriteReviewModal';
import { WriteReviewView } from './components/WriteReviewView';
import { ReviewGuidelinesModal } from './components/ReviewGuidelinesModal';
import { ReportReviewModal } from './components/ReportReviewModal';
import { WatchlistView } from './components/WatchlistView';
import { OwnerDashboardView } from './components/OwnerDashboardView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { AuthModal } from './components/AuthModal';

export function App() {
  const { user } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Firestore Collections Data
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [savedPropertiesData, setSavedPropertiesData] = useState<SavedProperty[]>([]);
  const [reports, setReports] = useState<ReviewReport[]>([]);

  // Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingReview, setReportingReview] = useState<Review | null>(null);

  // User Guidelines Acceptance State
  const [hasAcceptedGuidelines, setHasAcceptedGuidelines] = useState(false);

  // 1. Subscribe to Properties Collection in Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'properties'),
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db);
            INITIAL_PROPERTIES.forEach((p) => {
              batch.set(doc(db, 'properties', p.id), p);
            });
            await batch.commit();
          } catch (err) {
            console.error('Error seeding properties batch:', err);
          }
          setProperties(INITIAL_PROPERTIES);
        } else {
          const list: Property[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Property, 'id'>),
          }));

          // Ensure static properties 1-7 are present
          const missingStatic = INITIAL_PROPERTIES.filter(
            (ip) => !list.some((p) => p.id === ip.id)
          );
          if (missingStatic.length > 0) {
            try {
              const batch = writeBatch(db);
              missingStatic.forEach((p) => {
                batch.set(doc(db, 'properties', p.id), p);
              });
              await batch.commit();
            } catch (err) {
              console.error('Error seeding missing static properties:', err);
            }
          }

          setProperties(list);
        }
      },
      (error) => {
        console.error('Properties snapshot error:', error);
      }
    );

    return () => unsub();
  }, []);

  // 2. Subscribe to Reviews Collection in Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'reviews'),
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db);
            INITIAL_REVIEWS.forEach((r) => {
              batch.set(doc(db, 'reviews', r.id), r);
            });
            await batch.commit();
          } catch (err) {
            console.error('Error seeding reviews batch:', err);
          }
          setReviews(INITIAL_REVIEWS);
        } else {
          const list: Review[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Review, 'id'>),
          }));

          const missingStatic = INITIAL_REVIEWS.filter(
            (ir) => !list.some((r) => r.id === ir.id)
          );
          if (missingStatic.length > 0) {
            try {
              const batch = writeBatch(db);
              missingStatic.forEach((r) => {
                batch.set(doc(db, 'reviews', r.id), r);
              });
              await batch.commit();
            } catch (err) {
              console.error('Error seeding missing static reviews:', err);
            }
          }

          setReviews(list);
        }
      },
      (error) => {
        console.error('Reviews snapshot error:', error);
      }
    );

    return () => unsub();
  }, []);

  // 3. Subscribe to SavedProperties Collection in Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'savedProperties'),
      (snapshot) => {
        const list: SavedProperty[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<SavedProperty, 'id'>),
        }));
        setSavedPropertiesData(list);
      },
      (error) => {
        console.error('SavedProperties snapshot error:', error);
      }
    );

    return () => unsub();
  }, []);

  // 4. Subscribe to Reports Collection in Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'reports'),
      (snapshot) => {
        const list: ReviewReport[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ReviewReport, 'id'>),
        }));
        setReports(list);
      },
      (error) => {
        console.error('Reports snapshot error:', error);
      }
    );

    return () => unsub();
  }, []);

  // Compute dynamic overall ratings & sub-ratings for each property from all verified reviews
  const computedProperties = useMemo(() => {
    return properties.map((p) => {
      const propReviews = reviews.filter((r) => r.propertyId === p.id);
      if (propReviews.length === 0) return p;

      const count = propReviews.length;
      const sumRating = propReviews.reduce((acc, r) => acc + r.rating, 0);
      const sumMaint = propReviews.reduce((acc, r) => acc + (r.subRatings?.maintenance ?? r.rating), 0);
      const sumComm = propReviews.reduce((acc, r) => acc + (r.subRatings?.communication ?? r.rating), 0);
      const sumDep = propReviews.reduce((acc, r) => acc + (r.subRatings?.depositReturn ?? r.rating), 0);
      const sumSaf = propReviews.reduce((acc, r) => acc + (r.subRatings?.safety ?? r.rating), 0);

      return {
        ...p,
        avgRating: Number((sumRating / count).toFixed(1)),
        ratingsCount: count,
        subRatings: {
          maintenance: Number((sumMaint / count).toFixed(1)),
          communication: Number((sumComm / count).toFixed(1)),
          depositReturn: Number((sumDep / count).toFixed(1)),
          safety: Number((sumSaf / count).toFixed(1)),
        },
      };
    });
  }, [properties, reviews]);

  // Derived user saved property IDs
  const userUid = user?.uid || 'guest-local-user';
  const savedPropertyIds = savedPropertiesData
    .filter((sp) => sp.userId === userUid)
    .map((sp) => sp.propertyId);

  const watchlistedProperties = computedProperties.filter((p) => savedPropertyIds.includes(p.id));

  // Derived selected property based on properties state and selectedPropertyId
  const selectedProperty = computedProperties.find((p) => p.id === selectedPropertyId) || null;

  // Handlers
  const handleSelectProperty = (property: Property) => {
    setSelectedPropertyId(property.id);
    setActiveTab('property-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaveProperty = async (propertyId: string) => {
    const existing = savedPropertiesData.find(
      (sp) => sp.userId === userUid && sp.propertyId === propertyId
    );

    try {
      if (existing) {
        await deleteDoc(doc(db, 'savedProperties', existing.id));
      } else {
        const newDocId = `saved-${userUid}-${propertyId}`;
        await setDoc(doc(db, 'savedProperties', newDocId), {
          id: newDocId,
          userId: userUid,
          propertyId,
          savedAt: new Date().toISOString(),
          hasNewReview: false,
        });
      }
    } catch (err) {
      console.error('Error toggling saved property:', err);
      handleFirestoreError(err, OperationType.WRITE, 'savedProperties');
    }
  };

  const handleAddNewProperty = async (
    newPropData: Omit<Property, 'id' | 'avgRating' | 'ratingsCount' | 'subRatings' | 'createdAt'>
  ) => {
    const newId = `prop-${Date.now()}`;
    const newProperty: Property = {
      id: newId,
      ...newPropData,
      avgRating: 5.0,
      ratingsCount: 0,
      subRatings: {
        maintenance: 5.0,
        communication: 5.0,
        depositReturn: 5.0,
        safety: 5.0,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'properties', newId), newProperty);
      setSelectedPropertyId(newId);
      setActiveTab('property-profile');
    } catch (err) {
      console.error('Error adding new property:', err);
      handleFirestoreError(err, OperationType.CREATE, 'properties');
    }
  };

  const handleSubmitReview = async (reviewData: {
    propertyId: string;
    rating: number;
    subRatings: SubRatings;
    comment: string;
    isFirsthand: boolean;
  }) => {
    const targetProp = properties.find((p) => p.id === reviewData.propertyId);
    const newReviewId = `rev-${Date.now()}`;
    const authorName = user?.displayName || (user?.isAnonymous ? 'Anonymous Renter' : 'Verified Renter');

    const newReview: Review = {
      id: newReviewId,
      propertyId: reviewData.propertyId,
      propertyTitle: targetProp?.name || 'Rental Property',
      authorUid: userUid,
      authorName,
      isVerifiedTenant: true,
      isFirsthand: reviewData.isFirsthand,
      rating: reviewData.rating,
      subRatings: reviewData.subRatings,
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
    };

    // Optimistically update local state & navigate to the property profile view
    setReviews((prev) => [newReview, ...prev.filter((r) => r.id !== newReviewId)]);
    setSelectedPropertyId(reviewData.propertyId);
    setActiveTab('property-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // 1. Save Review to Firestore
      await setDoc(doc(db, 'reviews', newReviewId), newReview);

      // 2. Recalculate Property Ratings in Firestore & Local State
      if (targetProp) {
        const propReviews = [...reviews.filter((r) => r.propertyId === targetProp.id && r.id !== newReviewId), newReview];
        const count = propReviews.length;

        const sumRating = propReviews.reduce((acc, r) => acc + r.rating, 0);
        const sumMaint = propReviews.reduce((acc, r) => acc + (r.subRatings?.maintenance || 5), 0);
        const sumComm = propReviews.reduce((acc, r) => acc + (r.subRatings?.communication || 5), 0);
        const sumDep = propReviews.reduce((acc, r) => acc + (r.subRatings?.depositReturn || 5), 0);
        const sumSaf = propReviews.reduce((acc, r) => acc + (r.subRatings?.safety || 5), 0);

        const updatedProp: Partial<Property> = {
          avgRating: Number((sumRating / count).toFixed(1)),
          ratingsCount: count,
          subRatings: {
            maintenance: Number((sumMaint / count).toFixed(1)),
            communication: Number((sumComm / count).toFixed(1)),
            depositReturn: Number((sumDep / count).toFixed(1)),
            safety: Number((sumSaf / count).toFixed(1)),
          },
        };

        await updateDoc(doc(db, 'properties', targetProp.id), updatedProp);
        setProperties((prev) => prev.map((p) => (p.id === targetProp.id ? { ...p, ...updatedProp } : p)));
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      handleFirestoreError(err, OperationType.WRITE, 'reviews');
    }
  };

  const handleSubmitOwnerResponse = async (reviewId: string, responseText: string) => {
    try {
      const ownerResponse = {
        text: responseText,
        createdAt: new Date().toISOString(),
        ownerUid: userUid,
        ownerName: user?.displayName || 'Property Landlord Office',
      };

      await updateDoc(doc(db, 'reviews', reviewId), {
        ownerResponse,
      });
    } catch (err) {
      console.error('Error publishing owner response:', err);
      handleFirestoreError(err, OperationType.UPDATE, 'reviews');
    }
  };

  const handleSubmitReport = async (reportData: {
    reviewId: string;
    propertyId: string;
    reason: any;
    details: string;
  }) => {
    try {
      const newReportId = `report-${Date.now()}`;
      const newReport: ReviewReport = {
        id: newReportId,
        ...reportData,
        reporterUid: userUid,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'reports', newReportId), newReport);
    } catch (err) {
      console.error('Error submitting report:', err);
      handleFirestoreError(err, OperationType.CREATE, 'reports');
    }
  };

  const openWriteReviewForProp = (prop?: Property) => {
    if (prop) {
      setSelectedPropertyId(prop.id);
    } else if (!selectedPropertyId && properties.length > 0) {
      setSelectedPropertyId(properties[0].id);
    }
    setActiveTab('write-review');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-yellow-400 selection:text-teal-950">
      {/* Top Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={watchlistedProperties.length}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSelectPropertyForReview={() => openWriteReviewForProp(selectedProperty || properties[0])}
        onOpenGuidelines={() => setIsGuidelinesModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 flex-1 w-full">
        {activeTab === 'home' && (
          <HomeView
            properties={computedProperties}
            savedPropertyIds={savedPropertyIds}
            onSelectProperty={handleSelectProperty}
            onToggleSaveProperty={handleToggleSaveProperty}
            onWriteReview={(p) => openWriteReviewForProp(p)}
            onAddNewProperty={handleAddNewProperty}
            setActiveTab={setActiveTab}
            reviews={reviews}
          />
        )}

        {activeTab === 'property-profile' && selectedProperty && (
          <PropertyProfileView
            property={selectedProperty}
            reviews={reviews}
            isSaved={savedPropertyIds.includes(selectedProperty.id)}
            onBack={() => setActiveTab('home')}
            onToggleSave={() => handleToggleSaveProperty(selectedProperty.id)}
            onWriteReview={() => openWriteReviewForProp(selectedProperty)}
            onReportReview={(rev) => {
              setReportingReview(rev);
              setIsReportModalOpen(true);
            }}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistView
            savedProperties={watchlistedProperties}
            onSelectProperty={handleSelectProperty}
            onRemoveFromWatchlist={handleToggleSaveProperty}
            onWriteReview={(p) => openWriteReviewForProp(p)}
            onExploreProperties={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'owner-dashboard' && (
          <OwnerDashboardView
            properties={computedProperties}
            reviews={reviews}
            onSubmitOwnerResponse={handleSubmitOwnerResponse}
            onExploreProperties={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSettingsView
            myReviews={reviews.filter((r) => r.authorUid === userUid)}
            savedProperties={watchlistedProperties}
            myReports={reports.filter((rep) => rep.reporterUid === userUid)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onSelectProperty={handleSelectProperty}
          />
        )}

        {activeTab === 'write-review' && (
          <WriteReviewView
            property={selectedProperty}
            allProperties={computedProperties}
            onSubmitReview={handleSubmitReview}
            hasAcceptedGuidelines={hasAcceptedGuidelines}
            onRequestGuidelines={() => setIsGuidelinesModalOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* App Footer */}
      <footer className="bg-[#e9ecef] text-slate-600 border-t border-slate-200 py-10 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <Logo variant="color" size="md" />
              <p className="text-xs text-slate-500 max-w-sm">
                The most trusted platform for tenant-led property insights in India.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-700">
              <button onClick={() => setIsGuidelinesModalOpen(true)} className="hover:text-slate-900">
                Guidelines
              </button>
              <button onClick={() => setActiveTab('home')} className="hover:text-slate-900">
                About Us
              </button>
              <button onClick={() => setIsGuidelinesModalOpen(true)} className="hover:text-slate-900">
                Privacy Policy
              </button>
              <button onClick={() => setActiveTab('profile')} className="hover:text-slate-900">
                Contact Support
              </button>
              <button onClick={() => setIsGuidelinesModalOpen(true)} className="hover:text-slate-900">
                Terms of Service
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-300/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
            <span>© 2024 RealtorReview. Credible, Anonymous, Community-Driven.</span>
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Firestore Persistence Active</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteReviewModalOpen}
        property={selectedProperty}
        allProperties={properties}
        onClose={() => setIsWriteReviewModalOpen(false)}
        onSubmitReview={handleSubmitReview}
        hasAcceptedGuidelines={hasAcceptedGuidelines}
        onRequestGuidelines={() => setIsGuidelinesModalOpen(true)}
      />

      {/* Review Guidelines Policy Modal */}
      <ReviewGuidelinesModal
        isOpen={isGuidelinesModalOpen}
        onClose={() => setIsGuidelinesModalOpen(false)}
        onAccept={() => setHasAcceptedGuidelines(true)}
      />

      {/* Report Review Modal */}
      <ReportReviewModal
        isOpen={isReportModalOpen}
        review={reportingReview}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleSubmitReport}
      />

      {/* Firebase Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
export default App;
