export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Returns & Refunds</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">
              We want you to be completely satisfied with your purchase. If you're not happy with your order, 
              you can return it within 14 days of delivery.
            </p>
            <h3 className="font-semibold mb-2">Items must be:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Unworn and unwashed</li>
              <li>In original packaging</li>
              <li>With all tags attached</li>
              <li>Free from perfume, deodorant, or makeup stains</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ol className="list-decimal pl-6 space-y-4 text-gray-600">
              <li>
                <strong>Request a Return:</strong>
                <p>Log into your account and select the item you wish to return</p>
              </li>
              <li>
                <strong>Print Label:</strong>
                <p>Download and print your prepaid return shipping label</p>
              </li>
              <li>
                <strong>Package Item:</strong>
                <p>Securely package the item in its original or similar packaging</p>
              </li>
              <li>
                <strong>Ship:</strong>
                <p>Drop off the package at any authorized shipping location</p>
              </li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">
              Once we receive your return:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>We'll inspect the item within 2 business days</li>
              <li>Approved refunds will be processed to your original payment method</li>
              <li>You'll receive an email confirmation when your refund is processed</li>
              <li>Refunds typically take 5-10 business days to appear on your statement</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Items marked as "Final Sale"</li>
              <li>Intimates and swimwear</li>
              <li>Items showing signs of wear or alteration</li>
              <li>Items without original tags</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
} 