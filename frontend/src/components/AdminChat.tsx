"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import Chatbox from "@/components/Chatbox"; // Import the Chatbox component

const AdminChat = () => {
    const [users, setUsers] = useState([]); // List of users to chat with
    const [selectedUser, setSelectedUser] = useState(null); // Currently selected user

    useEffect(() => {
        // Fetch users from Firestore (assuming you have a 'users' collection)
        const fetchUsers = () => {
            const usersQuery = query(collection(db, "users"));
            const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
                const usersArray = [];
                querySnapshot.forEach((doc) => {
                    usersArray.push({ id: doc.id, ...doc.data() });
                });
                setUsers(usersArray);
            });

            return () => unsubscribe();
        };

        fetchUsers();
    }, []);

    return (
        <div className="flex">
            <div className="w-1/3 border-r p-4">
                <h2 className="text-lg font-semibold mb-4">Users</h2>
                <ul>
                    {users.map((user) => (
                        <li
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`p-2 cursor-pointer ${selectedUser?.id === user.id ? "bg-gray-200" : ""}`}
                        >
                            {user.displayName || user.email}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-2/3 p-4">
                <h2 className="text-lg font-semibold mb-4">Chat with {selectedUser ? selectedUser.displayName : "Select a user"}</h2>
                {selectedUser && (
                    <Chatbox userId="admin" adminId={selectedUser.id} />
                )}
            </div>
        </div>
    );
};

export default AdminChat;
