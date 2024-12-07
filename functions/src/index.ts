import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const verifyPayment = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    )
  }

  const { orderId, refId } = data

  try {
    // Get order details
    const orderSnap = await admin.firestore()
      .collection('orders')
      .doc(orderId)
      .get()

    if (!orderSnap.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Order not found'
      )
    }

    // Simulate successful payment verification
    await admin.firestore()
      .collection('orders')
      .doc(orderId)
      .update({
        status: 'processing',
        paymentStatus: 'paid',
        paymentDetails: {
          method: 'esewa',
          refId,
          verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      })

    return { success: true }
  } catch (error) {
    console.error('Payment verification error:', error)
    throw new functions.https.HttpsError(
      'internal',
      'Payment verification failed'
    )
  }
})

export const createOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    )
  }

  try {
    const orderData = {
      ...data,
      userId: context.auth.uid,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
    
    const orderRef = await admin.firestore()
      .collection('orders')
      .add(orderData)

    return { id: orderRef.id, ...orderData }
  } catch (error) {
    console.error('Order creation failed:', error)
    throw new functions.https.HttpsError(
      'internal',
      'Failed to create order'
    )
  }
}) 