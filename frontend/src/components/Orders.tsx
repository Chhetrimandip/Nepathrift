"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

const Orders = () => {
    const { user } = useAuth();
    const [sellerOrders, setSellerOrders] = useState([]);
    const [buyerOrders, setBuyerOrders] = useState([]);

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

    const handleUpdateStatus = async (orderId, newStatus, timelineField) => {
        const orderRef = doc(db, "orders", orderId);
        const updateData = {
            status: newStatus,
            [`timeline.${timelineField}`]: new Date(),
            updatedAt: new Date()
        };
        await updateDoc(orderRef, updateData);
    };

    return (
        <div className="space-y-8">
            {/* Seller Orders */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Orders to Fulfill</h2>
                <div className="space-y-4">
                    {sellerOrders.map((order) => (
                        <div key={order.id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                                    <p className="text-sm text-gray-600">Status: {order.status}</p>
                                </div>
                                {order.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleUpdateStatus(order.id, 'sent', 'sentAt')}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Mark as Sent
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Buyer Orders */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                <div className="space-y-4">
                    {buyerOrders.map((order) => (
                        <div key={order.id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                                    <p className="text-sm text-gray-600">Status: {order.status}</p>
                                </div>
                                {order.status === 'sent' && (
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => handleUpdateStatus(order.id, 'received', 'receivedAt')}
                                            className="bg-green-500 text-white px-4 py-2 rounded"
                                        >
                                            Mark as Received
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(order.id, 'damaged', 'receivedAt')}
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                        >
                                            Report Damaged
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;