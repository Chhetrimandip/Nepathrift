export const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  PENDING_CONFIRMATION: 'pending_confirmation',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  SENT: 'sent',
  RECEIVED: 'received',
  DAMAGED: 'damaged',
  CANCELLED: 'cancelled'
};

export const getStatusDisplay = (status: string) => {
  const displays = {
    pending_payment: 'Pending Payment',
    pending_confirmation: 'Pending Admin Confirmation',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    sent: 'Sent',
    received: 'Received',
    damaged: 'Reported Damaged',
    cancelled: 'Cancelled'
  };
  return displays[status] || status;
};

export const getStatusColor = (status: string) => {
  const colors = {
    pending_payment: 'bg-orange-100 text-orange-800',
    pending_confirmation: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    sent: 'bg-indigo-100 text-indigo-800',
    received: 'bg-green-100 text-green-800',
    damaged: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}; 