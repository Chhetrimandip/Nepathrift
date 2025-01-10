"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import MediaUpload from './MediaUpload';
import { Send } from 'lucide-react';

const Chatbox = ({ userId, adminId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const messagesQuery = query(collection(db, "messages"), orderBy("timestamp"));
        const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
            const messagesArray = [];
            querySnapshot.forEach((doc) => {
                const messageData = { id: doc.id, ...doc.data() };
                if (
                    (messageData.senderId === userId && messageData.receiverId === adminId) ||
                    (messageData.senderId === adminId && messageData.receiverId === userId)
                ) {
                    messagesArray.push(messageData);
                }
            });
            setMessages(messagesArray.sort((a, b) => a.timestamp - b.timestamp));
        });

        return () => unsubscribe();
    }, [userId, adminId]);

    const handleSendMessage = async (mediaUrl?: string, mediaType?: 'image' | 'video') => {
        if ((!newMessage.trim() && !mediaUrl) || !userId) return;

        try {
            await addDoc(collection(db, "messages"), {
                senderId: userId,
                receiverId: adminId,
                content: mediaUrl || newMessage,
                timestamp: new Date(),
                type: mediaUrl ? mediaType : "text",
                seen: false
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    const handleMediaUpload = (url: string, type: 'image' | 'video') => {
        handleSendMessage(url, type);
    };

    const renderMessage = (message) => {
        const isSentByMe = message.senderId === userId;
        
        return (
            <div key={message.id} 
                className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`${isSentByMe ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'} 
                    rounded-lg px-4 py-2`}>
                    {message.type === "image" ? (
                        <>
                            <img 
                                src={message.content} 
                                alt="Shared image" 
                                className="w-48 h-48 object-cover rounded-md cursor-pointer hover:opacity-90"
                                onClick={() => setSelectedImage(message.content)}
                            />
                            {selectedImage && (
                                <div 
                                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <img 
                                        src={selectedImage} 
                                        alt="Full size image" 
                                        className="max-w-[90%] max-h-[90vh] object-contain"
                                    />
                                </div>
                            )}
                        </>
                    ) : message.type === "video" ? (
                        <video
                            src={message.content}
                            controls
                            className="w-48 rounded-md"
                        />
                    ) : (
                        message.content
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="h-[400px] overflow-y-auto mb-4 flex flex-col">
                {messages.map(renderMessage)}
            </div>
            <div className="flex gap-2">
                <MediaUpload onUploadComplete={handleMediaUpload} />
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-md text-black p-2"
                />
                <button 
                    onClick={() => handleSendMessage()} 
                    className="bg-blue-500 rounded-md px-4 py-2">
                    <Send className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default Chatbox;
