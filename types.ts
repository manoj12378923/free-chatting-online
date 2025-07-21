export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
}

export enum MessageStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    SEEN = 'seen',
}

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    GIF = 'gif',
}

export interface User {
    id: string;
    name: string;
    age: number;
    country: string;
    city: string;
    gender: Gender;
    avatarUrl: string;
    bio: string;
    isOnline: boolean;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string; // Can be a userId or groupId
    timestamp: number;
    status: MessageStatus;
    type: MessageType;
    text?: string;
    contentUrl?: string; // For IMAGE or GIF URLs
}

export interface Group {
    id: string;
    name: string;
    description: string;
    avatarUrl: string;
    memberIds: string[];
}