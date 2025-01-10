"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Image from 'next/image';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = () => {
            const productsQuery = query(
                collection(db, "products")
            );
            
            const unsubscribe = onSnapshot(productsQuery, (querySnapshot) => {
                const productsArray = [];
                querySnapshot.forEach((doc) => {
                    productsArray.push({ id: doc.id, ...doc.data() });
                });
                setProducts(productsArray);
            });

            return () => unsubscribe();
        };

        fetchProducts();
    }, []);

    const handleToggleListing = async (productId, currentStatus) => {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, {
            status: currentStatus === 'available' ? 'unavailable' : 'available',
            updatedAt: new Date()
        });
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                await deleteDoc(doc(db, "products", productId));
            } catch (error) {
                console.error("Error deleting product:", error);
                alert('Failed to delete product');
            }
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Product Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 space-y-3">
                        {product.imageUrls && product.imageUrls.length > 0 && (
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    {product.imageUrls.map((imageUrl, index) => (
                                        <div key={index} className="relative h-32 w-full">
                                            <Image
                                                src={imageUrl}
                                                alt={`${product.name} - Image ${index + 1}`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-sm text-gray-500">Rs.{product.price}</p>
                                <p className="text-sm text-gray-500">
                                    Status: {product.status === 'available' ? 'Available' : 'Unavailable'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleToggleListing(product.id, product.status)}
                                    className={`px-3 py-1 rounded-md ${
                                        product.status === 'available' 
                                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                >
                                    {product.status === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                                </button>
                                <button 
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManagement;