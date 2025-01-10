"use client"

import Chatbox from "@/components/Chatbox";
import { useAuth } from '@/contexts/AuthContext';

const ChatboxPage = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Chat with Admin</h1>
            <Chatbox userId={user.uid} adminId="admin" />
        </div>
    );
};

export default ChatboxPage;
