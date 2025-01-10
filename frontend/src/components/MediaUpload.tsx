import { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2, Upload } from 'lucide-react';

type MediaUploadProps = {
    onUploadComplete: (url: string, type: 'image' | 'video') => void;
}

export default function MediaUpload({ onUploadComplete }: MediaUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);

        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            setSelectedFile(null);
            return;
        }

        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        
        if (!isImage && !isVideo) {
            alert('Only image and video files are allowed');
            setSelectedFile(null);
            return;
        }

        setUploading(true);
        try {
            const storageRef = ref(storage, `chat-media/${Date.now()}-${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            onUploadComplete(url, isImage ? 'image' : 'video');
            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="media-upload"
            />
            <label
                htmlFor="media-upload"
                className="cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center"
            >
                {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                ) : (
                    <Upload className="h-5 w-5 text-gray-600" />
                )}
            </label>
            {selectedFile && (
                <span className="text-sm text-gray-600">
                    Selected: {selectedFile.name}
                </span>
            )}
        </div>
    );
} 