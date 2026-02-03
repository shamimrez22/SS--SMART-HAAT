
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * A listener component that catches globally emitted 'permission-error' events.
 * Surfaces a toast notification to the user without crashing the app.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Show a helpful toast instead of a hard crash. 
      // This often happens during rules propagation.
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
