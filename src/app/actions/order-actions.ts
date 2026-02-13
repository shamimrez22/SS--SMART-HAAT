'use server';

import { initializeFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Server Action to handle order creation.
 * Email functionality removed to ensure 100% speed and prevent hanging.
 */
export async function createOrderAndNotify(orderData: any) {
  try {
    const { firestore } = initializeFirebase();
    
    // 1. Save order to Firestore
    const docRef = await addDoc(collection(firestore, 'orders'), {
      ...orderData,
      createdAt: new Date().toISOString()
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Order Submission Error:', error);
    return { success: false, error: 'SYSTEM_ERROR' };
  }
}
