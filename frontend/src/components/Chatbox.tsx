"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // Adjust the import based on your structure
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";

const Chatbox = () => {
    const [messages, setMessages] = useState([]);
    const userId = "user123"; // Replace with the actual user ID
    const adminId = "admin"; // Replace with the actual admin ID
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesArray = [];
            querySnapshot.forEach((doc) => {
                messagesArray.push({ id: doc.id, ...doc.data() });
            });
            setMessages(messagesArray);
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            await addDoc(collection(db, "messages"), {
                senderId: userId,
                receiverId: adminId,
                content: newMessage,
                timestamp: new Date(),
                type: "text",
            });
            setNewMessage(""); // Clear the input
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <div className="max-h-60 overflow-y-auto mb-4">
                {messages.map((message) => (
                    <div key={message.id} className={message.senderId === userId ? "text-right" : "text-left"}>
                        {message.type === "image" ? (
                            <img src={message.content} alt="Screenshot" className="max-w-xs rounded-md" />
                        ) : (
                            <p className="bg-black inline-block p-2 rounded-md shadow-sm">{message.content}</p>
                        )}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="border rounded-md p-2 w-full text-black"
            />
            <button onClick={handleSendMessage} className="bg-blue-500 text-black rounded-md px-4 py-2 mt-2">
                Send
            </button>
        </div>
    );
};

export default Chatbox;
