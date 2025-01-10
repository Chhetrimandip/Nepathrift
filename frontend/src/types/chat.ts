export type ChatMessage = {
    id: string;
    senderId: string;
    message: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    createdAt: any;
    seen: boolean;
} 