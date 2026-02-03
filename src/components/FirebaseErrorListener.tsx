
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * A listener component that catches globally emitted 'permission-error' events.
 * Instead of throwing and crashing the app, it displays a professional toast.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Log for debugging
      console.error("FIRESTORE ACCESS DENIED:", error.message);
      
      // Notify user gracefully
      toast({
        variant: "destructive",
        title: "SYSTEM SYNC ERROR",
        description: "UNAUTHORIZED DATABASE REQUEST DETECTED. CHECKING RULES...",
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  // This component renders nothing.
  return null;
}
