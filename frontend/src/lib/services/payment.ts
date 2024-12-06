interface EsewaPayment {
  amt: number;             // Amount of product
  psc: number;            // Service charge by merchant
  pdc: number;            // Delivery charge by merchant
  txAmt: number;          // Tax amount on product
  tAmt: number;           // Total amount including tax, service and delivery charge
  pid: string;            // Unique product ID
  scd: string;            // Merchant code provided by eSewa
  su: string;            // Success URL: where to redirect after successful payment
  fu: string;            // Failure URL: where to redirect after failed payment
}

export const esewaConfig = {
  merchantCode: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE || 'EPAYTEST', // Replace with your merchant code in production
  testUrl: 'https://uat.esewa.com.np/epay/main',
  liveUrl: 'https://esewa.com.np/epay/main'
}

export const paymentService = {
  initiateEsewaPayment: (orderId: string, amount: number) => {
    const payment: EsewaPayment = {
      amt: amount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: amount,
      pid: orderId,
      scd: esewaConfig.merchantCode,
      su: `${window.location.origin}/payment/success`,
      fu: `${window.location.origin}/payment/failed`
    }

    // Create a form and submit it programmatically
    const form = document.createElement('form')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', esewaConfig.testUrl) // Use liveUrl in production

    // Add payment details as hidden form fields
    Object.entries(payment).forEach(([key, value]) => {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', key)
      input.setAttribute('value', value.toString())
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }
} 