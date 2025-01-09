"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
            const ordersData = [];
            snapshot.forEach((doc) => {
                ordersData.push({ id: doc.id, ...doc.data() });
            });
            setOrders(ordersData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">Product</th>
                        <th className="px-4 py-2">Buyer</th>
                        <th className="px-4 py-2">Seller</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Timeline</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-t">
                            <td className="px-4 py-2">{order.id.slice(0, 8)}</td>
                            <td className="px-4 py-2">{order.productId}</td>
                            <td className="px-4 py-2">{order.buyerId}</td>
                            <td className="px-4 py-2">{order.sellerId}</td>
                            <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    getStatusColor(order.status)
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                <TimelineDisplay timeline={order.timeline} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const getStatusColor = (status) => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        sent: 'bg-purple-100 text-purple-800',
        received: 'bg-green-100 text-green-800',
        damaged: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

const TimelineDisplay = ({ timeline }) => {
    return (
        <div className="text-sm">
            {timeline?.confirmedAt && <div>Confirmed: {new Date(timeline.confirmedAt).toLocaleDateString()}</div>}
            {timeline?.sentAt && <div>Sent: {new Date(timeline.sentAt).toLocaleDateString()}</div>}
            {timeline?.receivedAt && <div>Received: {new Date(timeline.receivedAt).toLocaleDateString()}</div>}
            {timeline?.cancelledAt && <div>Cancelled: {new Date(timeline.cancelledAt).toLocaleDateString()}</div>}
        </div>
    );
};

export default OrdersTable; 