"use client"

import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {
  const router = useRouter();

  const handleRetry = () => {
    // Redirect to the checkout page or any other page
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
      <p className="mb-4">Unfortunately, your payment could not be processed. Please try again.</p>
      <button
        onClick={handleRetry}
        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
      >
        Retry Payment
      </button>
    </div>
  );
}
