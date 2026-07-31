import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { FirestoreErrorInfo, OperationType } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must include firestoreDatabaseId parameter
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export { firebaseConfig };

/**
 * Global Firestore Error Handler conforming to system specification
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates connection to Firestore backend as mandated by system guidelines
 */
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    return { success: true, message: 'Successfully connected to Firestore database' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('offline')) {
      return { success: false, message: 'Firestore client is offline. Check connection configuration.' };
    }
    // Reaching the server and receiving permission denied or not found confirms server connectivity
    return { success: true, message: 'Connected to Firestore server (database instance active)' };
  }
}
