export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shipping Information</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Methods</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg text-purple-600">Standard Shipping</h3>
              <p className="text-3xl font-bold my-2">$4.99</p>
              <p className="text-gray-600">Delivery in 3-5 business days</p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>✓ Tracking included</li>
                <li>✓ Insurance up to $100</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-purple-500">
              <div className="absolute -mt-8 bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h3 className="font-semibold text-lg text-purple-600">Express Shipping</h3>
              <p className="text-3xl font-bold my-2">$9.99</p>
              <p className="text-gray-600">Delivery in 1-2 business days</p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>✓ Priority handling</li>
                <li>✓ Tracking included</li>
                <li>✓ Insurance up to $200</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg text-purple-600">Free Shipping</h3>
              <p className="text-3xl font-bold my-2">$0</p>
              <p className="text-gray-600">On orders over $50</p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>✓ Standard delivery</li>
                <li>✓ Tracking included</li>
                <li>✓ Basic insurance</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Policies</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Order Processing</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Orders processed within 1-2 business days</li>
                  <li>Tracking information sent via email</li>
                  <li>Signature required for orders over $100</li>
                  <li>P.O. boxes and APO/FPO addresses accepted</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Shipping Restrictions</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Currently shipping within US only</li>
                  <li>Hawaii and Alaska may have extended delivery times</li>
                  <li>Some restrictions apply to P.O. boxes</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Track Your Order</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="max-w-md">
              <p className="text-gray-600 mb-4">
                Enter your tracking number to see your order status:
              </p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter tracking number"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Track
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Tracking number can be found in your shipping confirmation email
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">When will I receive my order?</h3>
                <p className="text-gray-600">Delivery times vary based on shipping method and location. You'll receive an estimated delivery date at checkout.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I change my shipping address?</h3>
                <p className="text-gray-600">You can modify your shipping address before the order is processed. Contact customer service for assistance.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What if my package is lost?</h3>
                <p className="text-gray-600">All shipments are insured. Contact our support team if your package hasn't arrived within the expected timeframe.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 