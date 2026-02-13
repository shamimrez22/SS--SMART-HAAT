
'use server';

import { Resend } from 'resend';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

/**
 * Server Action to handle order creation and send email notifications.
 * Offloads heavy processing from the client for 100% speed.
 */
export async function createOrderAndNotify(orderData: any) {
  try {
    const { firestore } = initializeFirebase();
    
    // 1. Save order to Firestore
    const docRef = await addDoc(collection(firestore, 'orders'), {
      ...orderData,
      createdAt: new Date().toISOString()
    });

    // 2. Fetch admin email from settings
    const settingsSnap = await getDoc(doc(firestore, 'settings', 'site-config'));
    const settings = settingsSnap.data();
    const adminEmail = settings?.email;

    // 3. Send Email Notification if API key is present
    if (adminEmail && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: 'SS SMART HAAT <orders@sssmarthaat.com>',
        to: adminEmail,
        subject: `NEW ORDER ALERT: ${orderData.productName}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd;">
            <h2 style="color: #01a3a4; border-bottom: 2px solid #01a3a4; padding-bottom: 10px;">New Order Received</h2>
            <p><strong>Customer Name:</strong> ${orderData.customerName}</p>
            <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
            <p><strong>Address:</strong> ${orderData.customerAddress}</p>
            <div style="margin-top: 20px; background: #fff; padding: 15px; border-left: 4px solid #01a3a4;">
              <p><strong>Product:</strong> ${orderData.productName}</p>
              <p><strong>Quantity:</strong> ${orderData.quantity}</p>
              <p><strong>Size:</strong> ${orderData.selectedSize}</p>
              <p><strong>Price:</strong> ৳${orderData.productPrice}</p>
            </div>
            <p style="font-size: 10px; color: #888; margin-top: 20px;">Order ID: ${docRef.id}</p>
          </div>
        `
      });
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Order Submission Error:', error);
    return { success: false, error: 'SYSTEM_ERROR' };
  }
}
