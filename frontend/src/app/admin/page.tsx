'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { 
    collection, 
    query, 
    onSnapshot, 
    doc, 
    getDoc, 
    updateDoc, 
    orderBy,
    Firestore 
} from 'firebase/firestore'
import AdminChat from '@/components/AdminChat'
import ProductManagement from '@/components/ProductManagement'
import { format } from 'date-fns'
import { ordersService } from '@/lib/services/orders'

const AdminPage = () => {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [selectedBuyer, setSelectedBuyer] = useState('all')
    const [buyers, setBuyers] = useState([])
    const [orderStatus, setOrderStatus] = useState('pending')
    const [dbInstance, setDbInstance] = useState<Firestore | null>(null)

    useEffect(() => {
        // Ensure db is initialized
        if (db) {
            setDbInstance(db)
        }
    }, [])

    const fetchOrders = async () => {
        if (!dbInstance) {
            console.error('Firestore instance not available')
            return
        }

        const ordersQuery = query(
            collection(dbInstance, "orders"),
            orderBy("createdAt", "desc")
        )

        const unsubscribe = onSnapshot(ordersQuery, async (querySnapshot) => {
            const ordersArray = []
            const buyersSet = new Set()

            for (const docSnapshot of querySnapshot.docs) {
                const orderData = { id: docSnapshot.id, ...docSnapshot.data() }
                console.log('Processing order:', orderData)

                try {
                    // Fetch product name
                    const productDocRef = doc(dbInstance, "products", orderData.productId)
                    const productDoc = await getDoc(productDocRef)
                    orderData.productName = productDoc.exists() ? productDoc.data().name : 'Unknown Product'

                    // Fetch buyer username
                    if (orderData.buyerId) {
                        const buyerDocRef = doc(dbInstance, "users", orderData.buyerId)
                        const buyerDoc = await getDoc(buyerDocRef)
                        console.log('Buyer doc exists:', buyerDoc.exists(), 'Buyer data:', buyerDoc.data())
                        if (buyerDoc.exists()) {
                            const buyerData = buyerDoc.data()
                            orderData.buyerUsername = buyerData.username || buyerData.displayName || buyerData.email || 'Unknown Buyer'
                        } else {
                            console.log('Buyer document not found for ID:', orderData.buyerId)
                            orderData.buyerUsername = 'Unknown Buyer'
                        }
                    } else {
                        console.log('No buyerId in order data')
                        orderData.buyerUsername = 'No Buyer ID'
                    }

                    // Fetch seller username
                    if (orderData.sellerId) {
                        const sellerDocRef = doc(dbInstance, "users", orderData.sellerId)
                        const sellerDoc = await getDoc(sellerDocRef)
                        console.log('Seller doc exists:', sellerDoc.exists(), 'Seller data:', sellerDoc.data())
                        if (sellerDoc.exists()) {
                            const sellerData = sellerDoc.data()
                            orderData.sellerUsername = sellerData.username || sellerData.displayName || sellerData.email || 'Unknown Seller'
                        } else {
                            console.log('Seller document not found for ID:', orderData.sellerId)
                            orderData.sellerUsername = 'Unknown Seller'
                        }
                    } else {
                        console.log('No sellerId in order data')
                        orderData.sellerUsername = 'No Seller ID'
                    }

                    ordersArray.push(orderData)
                    if (orderData.buyerId) {
                        buyersSet.add(orderData.buyerId)
                    }
                } catch (error) {
                    console.error('Error fetching related data:', error)
                    ordersArray.push({
                        ...orderData,
                        productName: 'Error fetching product',
                        buyerUsername: 'Error fetching buyer',
                        sellerUsername: 'Error fetching seller'
                    })
                }
            }

            setOrders(ordersArray)
            setBuyers(Array.from(buyersSet))
        })

        return () => unsubscribe()
    }

    useEffect(() => {
        if (user && user.email && user.email.includes("4nepathrift") && dbInstance) {
            setIsAdmin(true)
            fetchOrders()
        } else {
            setIsAdmin(false)
        }
    }, [user, dbInstance])

    const handleConfirmOrder = async (orderId) => {
        try {
            const orderRef = doc(dbInstance, "orders", orderId)
            await updateDoc(orderRef, {
                status: 'confirmed',
                'timeline.confirmedAt': new Date(),
                updatedAt: new Date()
            })
        } catch (error) {
            console.error('Error confirming order:', error)
        }
    }

    const handleDeleteOrder = async (orderId: string) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                await ordersService.delete(orderId);
                // No need to manually update the UI as the onSnapshot listener will handle it
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('Failed to delete order');
            }
        }
    };

    const filteredOrders = orders.filter(order => 
        orderStatus === 'all' || order.status === orderStatus
    )

    if (!isAdmin) {
        return <div>Access Denied</div>
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
            
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Orders</h2>
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
                    <select 
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="border rounded-md px-3 py-1 ml-4"
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="all">All Orders</option>
                    </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {format(order.createdAt.toDate(), 'MMM d, yyyy')}
                                </span>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                <p className="font-medium text-black">Order for: {order.productName || 'Product Name'}</p>
                                <p className="text-sm text-black">
                                    Buyer: {order.buyerUsername || 'N/A'}...
                                </p>
                                <p className="text-sm text-black">
                                    Seller: {order.sellerUsername || 'N/A'}...
                                </p>
                                <p className="text-sm font-medium text-black">
                                    Amount: Rs.{order.price ? order.price.toFixed(2) : 'N/A'}
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

                            <td className="px-6 py-4">
                                <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </div>
                    ))}
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No orders found</p>
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