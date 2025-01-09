'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { collection, query, onSnapshot, doc, updateDoc, orderBy, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import AdminChat from '@/components/AdminChat'
import ProductManagement from '@/components/ProductManagement'
import { format } from 'date-fns'

const AdminPage = () => {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [selectedBuyer, setSelectedBuyer] = useState('all')
    const [buyers, setBuyers] = useState([])

    useEffect(() => {
        // Check if the user is an admin based on their email
        if (user && user.email && user.email.includes("4nepathrift")) {
            setIsAdmin(true)
            fetchOrders()
        } else {
            setIsAdmin(false)
        }
    }, [user])

    const fetchOrders = () => {
        const ordersQuery = query(
            collection(db, "orders"),
            where("status", "==", "pending"),
            orderBy("createdAt", "desc")
        )

        const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
            const ordersArray = []
            const buyersSet = new Set()

            querySnapshot.forEach((doc) => {
                const orderData = { id: doc.id, ...doc.data() }
                ordersArray.push(orderData)
                buyersSet.add(orderData.buyerId)
            })

            setOrders(ordersArray)
            setBuyers(Array.from(buyersSet))
        })

        return () => unsubscribe()
    }

    const handleConfirmOrder = async (orderId) => {
        try {
            const orderRef = doc(db, "orders", orderId)
            await updateDoc(orderRef, {
                status: 'confirmed',
                'timeline.confirmedAt': new Date(),
                updatedAt: new Date()
            })
        } catch (error) {
            console.error('Error confirming order:', error)
        }
    }

    const filteredOrders = selectedBuyer === 'all' 
        ? orders 
        : orders.filter(order => order.buyerId === selectedBuyer)

    if (!isAdmin) {
        return <div>Access Denied</div>
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
            
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Pending Orders</h2>
                    <select 
                        value={selectedBuyer}
                        onChange={(e) => setSelectedBuyer(e.target.value)}
                        className="border rounded-md px-3 py-1"
                    >
<option value="all" style={{ color: "black" }}>All Buyers</option>
{buyers.map(buyerId => (
    buyerId ? (
        <option key={buyerId} value={buyerId} style={{ color: "black" }}>
            Buyer: {buyerId.slice(0, 8)}...
        </option>
    ) : null
))}

                    </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                    Pending
                                </span>
                                <span className="text-sm text-gray-500">
                                    {format(order.createdAt.toDate(), 'MMM d, yyyy')}
                                </span>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                <p className="font-medium text-black">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-black">
                                    Buyer ID: {order.buyerId ? order.buyerId.slice(0, 8) : 'N/A'}...
                                </p>
                                <p className="text-sm font-medium text-black">
                                    Amount: ${order.price ? order.price.toFixed(2) : 'N/A'}
                                </p>
                            </div>

                            <div className="bg-gray-900 p-3 rounded-md mb-4">
                                <p className="text-sm font-medium mb-1">Shipping Details:</p>
                                <p className="text-sm">{order.shippingInfo?.fullName || 'N/A'}</p>
                                <p className="text-sm">{order.shippingInfo?.address || 'N/A'}</p>
                                <p className="text-sm">{order.shippingInfo?.phone || 'N/A'}</p>
                            </div>

                            <button
                                onClick={() => handleConfirmOrder(order.id)}
                                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                            >
                                Confirm Order
                            </button>
                        </div>
                    ))}
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No pending orders found</p>
                    </div>
                )}
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Customer Support</h2>
                <AdminChat />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Product Management</h2>
                <ProductManagement />
            </div>
        </div>
    )
}

export default AdminPage