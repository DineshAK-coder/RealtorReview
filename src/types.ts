export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isOwner?: boolean;
  hasAcceptedGuidelines?: boolean;
  createdAt?: string;
}

export type PropertyType =
  | 'Apartment'
  | 'Studio Apartment'
  | 'House'
  | 'PG'
  | 'Commercial'
  | 'Warehouse';

export interface SubRatings {
  maintenance: number;
  communication: number;
  depositReturn: number;
  safety: number;
}

export interface Property {
  id: string;
  name: string;
  locality: string;
  city: string;
  type: PropertyType;
  avgRating: number;
  ratingsCount: number;
  subRatings: SubRatings;
  imageUrl?: string;
  ownerId?: string;
  createdAt: string;
  isFeatured?: boolean;
}

export interface OwnerResponse {
  text: string;
  createdAt: string;
  ownerUid: string;
  ownerName?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  propertyTitle?: string;
  authorUid: string;
  authorName: string;
  isVerifiedTenant: boolean;
  isFirsthand: boolean;
  rating: number;
  subRatings: SubRatings;
  comment: string;
  createdAt: string;
  ownerResponse?: OwnerResponse;
}

export type ReportReason =
  | 'Inaccurate Facts'
  | 'Personal Attack / Harassment'
  | 'Defamation / Hate Speech'
  | 'Spam or Fake Review'
  | 'Other';

export interface ReviewReport {
  id: string;
  reviewId: string;
  propertyId: string;
  reporterUid: string;
  reason: ReportReason;
  details: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
}

export interface SavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  savedAt: string;
  hasNewReview?: boolean;
}

export type ActiveTab =
  | 'home'
  | 'property-profile'
  | 'write-review'
  | 'guidelines'
  | 'report-review'
  | 'watchlist'
  | 'owner-dashboard'
  | 'profile';
