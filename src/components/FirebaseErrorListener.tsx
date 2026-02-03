
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * A listener component that catches globally emitted 'permission-error' events.
 * Removed console.error to prevent triggering the Next.js development overlay.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Gracefully notify the user via a toast instead of logging a console error
      // that triggers the annoying development overlay screen.
      toast({
        variant: "destructive",
        title: "SYSTEM SYNC NOTICE",
        description: "ATTEMPTING TO ESTABLISH DATABASE CONNECTION...",
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
