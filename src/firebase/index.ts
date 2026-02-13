
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, Firestore } from 'firebase/firestore'

let cachedSdks: { firebaseApp: FirebaseApp, auth: any, firestore: Firestore } | null = null;

export function initializeFirebase() {
  if (cachedSdks) return cachedSdks;

  let firebaseApp: FirebaseApp;
  
  if (!getApps().length) {
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    firebaseApp = getApp();
  }

  let firestore: Firestore;
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    try {
      firestore = initializeFirestore(firebaseApp, {
        experimentalAutoDetectLongPolling: true,
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    } catch (e) {
      firestore = getFirestore(firebaseApp);
    }
  } else {
    firestore = getFirestore(firebaseApp);
  }

  cachedSdks = {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore
  };

  return cachedSdks;
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
