"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import OrderDetailsModal from './OrderDetailsModal';
import { getStatusDisplay } from '@/utils/orderStatus';

const Orders = () => {
    const { user } = useAuth();
    const [sellerOrders, setSellerOrders] = useState([]);
    const [buyerOrders, setBuyerOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        // Fetch orders where user is seller
        const sellerQuery = query(
            collection(db, "orders"), 
            where("sellerId", "==", user.uid)
        );

        // Fetch orders where user is buyer
        const buyerQuery = query(
            collection(db, "orders"), 
            where("buyerId", "==", user.uid)
        );

        const unsubscribeSeller = onSnapshot(sellerQuery, (snapshot) => {
            const orders = [];
            snapshot.forEach((doc) => {
                orders.push({ id: doc.id, ...doc.data() });
            });
            setSellerOrders(orders);
        });

        const unsubscribeBuyer = onSnapshot(buyerQuery, (snapshot) => {
            const orders = [];
            snapshot.forEach((doc) => {
                orders.push({ id: doc.id, ...doc.data() });
            });
            setBuyerOrders(orders);
        });

        return () => {
            unsubscribeSeller();
            unsubscribeBuyer();
        };
    }, [user]);

    const allowedSellerStatuses = {
        pending_confirmation: ['confirmed', 'cancelled'],
        confirmed: ['in_progress', 'cancelled'],
        in_progress: ['sent', 'cancelled'],
        sent: ['cancelled']
    };

    const allowedBuyerStatuses = {
        sent: ['received', 'damaged'],
        damaged: ['received']
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
            status: newStatus,
            [`timeline.${newStatus}At`]: new Date(),
            updatedAt: new Date()
        });
    };

    const handleOrderClick = async (order) => {
        try {
            // Fetch product details
            const productDoc = await getDoc(doc(db, "products", order.productId));
            const productData = productDoc.exists() ? productDoc.data() : null;

            // Fetch buyer details
            const buyerDoc = await getDoc(doc(db, "users", order.buyerId));
            const buyerData = buyerDoc.exists() ? buyerDoc.data() : null;

            // Fetch seller details
            const sellerDoc = await getDoc(doc(db, "users", order.sellerId));
            const sellerData = sellerDoc.exists() ? sellerDoc.data() : null;

            setSelectedOrder({
                ...order,
                productImageUrl: productData?.imageUrls?.[0] || '/placeholder.png',
                productName: productData?.name || 'Unknown Product',
                buyerUsername: buyerData?.username || buyerData?.displayName || 'Unknown Buyer',
                buyerEmail: buyerData?.email || 'No email provided',
                sellerUsername: sellerData?.username || sellerData?.displayName || 'Unknown Seller',
                sellerEmail: sellerData?.email || 'No email provided',
                timeline: {
                    ...order.timeline,
                    confirmedAt: order.timeline?.confirmedAt?.toDate?.() || order.timeline?.confirmedAt,
                    sentAt: order.timeline?.sentAt?.toDate?.() || order.timeline?.sentAt,
                    receivedAt: order.timeline?.receivedAt?.toDate?.() || order.timeline?.receivedAt,
                    cancelledAt: order.timeline?.cancelledAt?.toDate?.() || order.timeline?.cancelledAt
                }
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching details:", error);
            setSelectedOrder(order);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="space-y-8">
            {/* Seller Orders */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Orders to Fulfill</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sellerOrders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => handleOrderClick(order)}
                            className="border p-4 rounded-lg hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-3">
                                    <div className="relative w-16 h-16">
                                        <Image
                                            src={order.productImageUrl}
                                            alt={order.productName}
                                            fill
                                            sizes="64px"
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm text-gray-600">
                                            Status: {getStatusDisplay(order.status)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Buyer: {order.buyerUsername}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Add seller action buttons */}
                                {allowedSellerStatuses[order.status] && (
                                    <div className="flex gap-2 mt-2">
                                        {allowedSellerStatuses[order.status].map((newStatus) => (
                                            <button
                                                key={newStatus}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateStatus(order.id, newStatus);
                                                }}
                                                className={`px-3 py-1 rounded-md text-sm ${
                                                    newStatus === 'cancelled' 
                                                        ? 'bg-red-500 text-white hover:bg-red-600' 
                                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                                }`}
                                            >
                                                {getStatusDisplay(newStatus)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Buyer Orders */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {buyerOrders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => handleOrderClick(order)}
                            className="border p-4 rounded-lg hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-3">
                                    <div className="relative w-16 h-16">
                                        <Image
                                            src={order.productImageUrl}
                                            alt={order.productName}
                                            fill
                                            sizes="64px"
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm text-gray-600">
                                            Status: {getStatusDisplay(order.status)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Seller: {order.sellerUsername}
                                        </p>
                                    </div>
                                </div>

                                {/* Add buyer action buttons */}
                                {allowedBuyerStatuses[order.status] && (
                                    <div className="flex gap-2 mt-2">
                                        {allowedBuyerStatuses[order.status].map((newStatus) => (
                                            <button
                                                key={newStatus}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateStatus(order.id, newStatus);
                                                }}
                                                className={`px-3 py-1 rounded-md text-sm ${
                                                    newStatus === 'damaged' 
                                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                                        : 'bg-green-500 text-white hover:bg-green-600'
                                                }`}
                                            >
                                                {getStatusDisplay(newStatus)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    );
};

export default Orders;