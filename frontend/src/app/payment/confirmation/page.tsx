"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [selectedQrImage, setSelectedQrImage] = useState(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!orderId) {
      router.push('/checkout');
      return;
    }

    const fetchOrderDetails = async () => {
      if (!orderId) return;

      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (orderSnap.exists()) {
        const orderData = orderSnap.data();
        setPaymentInfo({
          amount: orderData.total,
          paymentDetails: "A/C Holder Name: MANDIP CHHETRI Account Number: 0795753102170001 Bank Name: NIC ASIA BANK Branch Name: Kushma",
        });
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  const handleSubmitScreenshot = async () => {
    if (!screenshot || !orderId) return;

    try {
      const storageRef = ref(storage, `payment-proofs/${orderId}-${Date.now()}-${screenshot.name}`);
      await uploadBytes(storageRef, screenshot);
      const fileUrl = await getDownloadURL(storageRef);

      // Update order with payment proof
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        paymentProof: fileUrl,
        paymentStatus: 'pending_verification',
        updatedAt: new Date()
      });

      // Send the screenshot as a message to admin
      await sendMessage(user.uid, "admin", fileUrl, "image");

      // Redirect to order confirmation
      router.push(`/orders/${orderId}/confirmation`);
    } catch (error) {
      console.error("Error uploading screenshot:", error);
    }
  };

  const handleBack = () => {
    router.push("/checkout");
  };

  const qrImages = [
    "/images/esewaqr.jpg",
    "/images/nicqr.jpg",
  ];

  const handleQrSelect = (image) => {
    setSelectedQrImage(image);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
    }
  };

  const sendMessage = async (senderId, receiverId, content, type) => {
    const messageData = {
        senderId,
        receiverId,
        content,
        timestamp: new Date(),
        type,
    };

    await addDoc(collection(db, "messages"), messageData);
  };

  const handleContactSupport = () => {
    console.log("Contacting support...");
  };

  if (!paymentInfo) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.error("User is not authenticated.");
    return;
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4 text-white">Payment Confirmation</h1>
      <p className="mb-4 text-white">Please send the amount to the following account:</p>
      <p className="font-medium mb-4 text-white">{paymentInfo.paymentDetails}</p>

      <div className="flex justify-center mb-4 space-x-4">
        {qrImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`QR Code ${index + 1}`}
            className={`cursor-pointer ${selectedQrImage === image ? 'border-2 border-blue-500' : ''}`}
            onClick={() => handleQrSelect(image)}
            style={{ width: '150px', height: '150px' }}
          />
        ))}
      </div>

      {selectedQrImage && (
        <img src={selectedQrImage} alt="Selected QR Code" className="mx-auto mb-4" style={{ width: '200px', height: '200px' }} />
      )}

      <p className="mb-4 text-white">Amount: Rs. {paymentInfo.amount}</p>

      <input
        type="file"
        accept="image/*"
        onChange={handleScreenshotChange}
        className="mb-4"
      />
      <button
        onClick={handleSubmitScreenshot}
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors mb-4"
      >
        Submit Payment Screenshot
      </button>

      <button
        onClick={handleContactSupport}
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Contact Support
      </button>

      <button
        onClick={handleBack}
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors mt-4"
      >
        Back to Checkout
      </button>
    </div>
  );
} 