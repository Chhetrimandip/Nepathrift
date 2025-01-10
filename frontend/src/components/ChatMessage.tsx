import Image from 'next/image';
import { format } from 'date-fns';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

type Props = {
    message: ChatMessageType;
    isOwnMessage: boolean;
};

export default function ChatMessage({ message, isOwnMessage }: Props) {
    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
                {message.mediaUrl && (
                    <div className="mb-2">
                        {message.mediaType === 'image' ? (
                            <Image
                                src={message.mediaUrl}
                                alt="Shared image"
                                width={300}
                                height={200}
                                className="rounded-lg object-cover"
                            />
                        ) : (
                            <video
                                src={message.mediaUrl}
                                controls
                                className="rounded-lg max-w-full"
                            />
                        )}
                    </div>
                )}
                {message.message && <p>{message.message}</p>}
                <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                    {format(message.createdAt.toDate(), 'HH:mm')}
                </p>
            </div>
        </div>
    );
} 