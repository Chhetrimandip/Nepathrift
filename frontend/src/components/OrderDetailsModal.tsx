import { Dialog } from '@headlessui/react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { ORDER_STATUS, getStatusDisplay } from '../utils/orderStatus'

const formatDate = (date) => {
  if (!date) return 'N/A';
  if (date instanceof Date) return date.toLocaleString();
  if (date?.toDate) return date.toDate().toLocaleString();
  return new Date(date).toLocaleString();
};

export default function OrderDetailsModal({ isOpen, onClose, order }) {
  if (!order) return null

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-lg font-semibold text-black">
              Order Details #{order.id.slice(0, 8)}
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Product Details */}
            <div className="flex gap-4 border-b pb-4">
              <div className="relative w-24 h-24">
                <Image
                  src={order.productImageUrl || '/placeholder.png'}
                  alt={order.productName}
                  fill
                  sizes="96px"
                  className="object-cover rounded-md"
                />
              </div>
              <div>
                <h3 className="font-medium text-black">{order.productName}</h3>
                <p className="text-sm text-black">Rs. {order.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Shipping Details */}
            <div>
              <h3 className="font-medium text-black mb-2">Shipping Information</h3>
              <div className="text-sm space-y-1">
                <p className="text-black">{order.shippingInfo?.fullName || 'N/A'}</p>
                <p className="text-black">{order.shippingInfo?.address || 'N/A'}</p>
                <p className="text-black">{order.shippingInfo?.phone || 'N/A'}</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-black mb-2">Buyer Details</h3>
                <div className="text-sm space-y-1">
                  <p className="text-black">Name: {order.buyerUsername}</p>
                  <p className="text-black">Email: {order.buyerEmail}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-black mb-2">Seller Details</h3>
                <div className="text-sm space-y-1 text-black">
                  <p className="text-black">Name: {order.sellerUsername}</p>
                  <p className="text-black">Email: {order.sellerEmail}</p>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div>
              <h3 className="font-medium text-black mb-2">Order Timeline</h3>
              <div className="text-sm space-y-2 text-black">
                {Object.entries(ORDER_STATUS).map(([key, status]) => {
                  const timeKey = `${status}At`;
                  const timeValue = order.timeline?.[timeKey];
                  if (!timeValue) return null;
                  
                  return (
                    <div key={status} className="flex justify-between">
                      <span className="capitalize">{getStatusDisplay(status)}</span>
                      <span>{formatDate(timeValue)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 