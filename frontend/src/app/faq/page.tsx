export default function FAQPage() {
  const faqs = [
    {
      question: "How do I create a seller account?",
      answer: "Click on the 'Sell' button in the navigation menu and follow the registration process. You'll need to provide basic information and verify your email address."
    },
    {
      question: "What items can I sell on Nepathrift?",
      answer: "We accept gently used clothing, shoes, and accessories. All items must be authentic, in good condition, and clean."
    },
    {
      question: "How do payments work?",
      answer: "We accept major credit cards, PayPal, and digital wallets. Sellers receive payments through direct deposit or PayPal after a successful sale."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 14-day return policy for items that don't match their description. Check our Returns page for detailed information."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout."
    },
    {
      question: "How do you ensure item authenticity?",
      answer: "Sellers must verify the authenticity of branded items. We have a verification process for luxury items and take fraud seriously."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 