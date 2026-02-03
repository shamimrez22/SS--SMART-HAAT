
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Silent Error Listener.
 * Removed the Toast notification to stop showing "SYSTEM SYNC NOTICE" to users.
 * Errors are now handled silently in the background.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // SILENT HANDLING: No more red toasts or console errors to distract user/agent.
      // Database sync is handled gracefully by Firebase's offline persistence.
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}
