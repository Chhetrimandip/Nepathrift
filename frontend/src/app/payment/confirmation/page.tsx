"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from '@/lib/firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentConfirmationPage() {
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [selectedQrImage, setSelectedQrImage] = useState(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const { user } = useAuth();

  console.log("Current user:", user);
  if (!user) {
    console.error("User is not authenticated.");
    return <div>Please log in to access this page.</div>;
  }

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      const info = {
        amount: 100,
        paymentDetails: "A/C Holder Name: MANDIP CHHETRI Account Number: 0795753102170001        Bank Name: NIC ASIA BANK    Branch Name: Kushma",
      };
      setPaymentInfo(info);
    };

    fetchPaymentInfo();
  }, []);

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

  const handleSubmitScreenshot = async () => {
    if (screenshot) {
        const userId = user.uid; // Get the actual user ID from authentication
        const storageRef = ref(storage, `screenshots/${userId}/${Date.now()}-${screenshot.name}`);
        try {
            console.log("User ID:", userId);
            console.log("Storage Reference:", storageRef);
            
            await uploadBytes(storageRef, screenshot);
            const fileUrl = await getDownloadURL(storageRef);

            // Store the screenshot URL in Firestore
            await setDoc(doc(db, "payments", userId), {
                screenshotUrl: fileUrl,
                timestamp: new Date(),
            });

            // Send the screenshot as a message to the chat
            await sendMessage(userId, "admin", fileUrl, "image");

            // Redirect to chatbox
            router.push('/chatbox'); // Adjust the path to your chatbox page
        } catch (error) {
            console.error("Error uploading screenshot:", error);
        }
    } else {
        console.error("No screenshot selected.");
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