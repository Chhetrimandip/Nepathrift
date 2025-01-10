"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = () => {
            const productsQuery = query(
                collection(db, "products"),
                where("status", "==", "available")
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
        await updateDoc(productRef, { status: currentStatus === 'available' ? 'unavailable' : 'available' });
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Manage Products</h2>
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
                            </div>
                            <button 
                                onClick={() => handleToggleListing(product.id, product.status)}
                                className={`px-3 py-1 rounded-md ${
                                    product.status === 'available' 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-green-500 text-white'
                                }`}
                            >
                                {product.status === 'available' ? 'Unavailable' : 'Available'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManagement;