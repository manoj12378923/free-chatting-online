import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, Message, MessageStatus, Group, MessageType } from '../types';
import { MOCK_USERS, MOCK_GROUPS } from '../constants';

interface AppContextType {
    currentUser: User | null;
    users: User[];
    groups: Group[];
    messages: Record<string, Message[]>;
    login: (user: User) => void;
    updateUser: (updatedDetails: Partial<Omit<User, 'id'>>) => void;
    sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => void;
    markMessagesAsSeen: (chatId: string) => void;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
    const [messages, setMessages] = useState<Record<string, Message[]>>({});

    const login = (user: User) => {
        const newUser = { ...user, id: `user-${Date.now()}`, isOnline: true };
        setCurrentUser(newUser);

        setUsers(prevUsers => [newUser, ...prevUsers]);
        
        // When a new user joins, add them to all existing groups for the demo
        setGroups(prevGroups => prevGroups.map(group => ({
            ...group,
            memberIds: [...group.memberIds, newUser.id]
        })));
    };

    const updateUser = (updatedDetails: Partial<Omit<User, 'id'>>) => {
        if (!currentUser) return;
        const updatedUser = { ...currentUser, ...updatedDetails };
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const getChatKey = (userId1: string, userId2:string) => {
        return [userId1, userId2].sort().join('-');
    };

    const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp' | 'status'>) => {
        if (!currentUser) return;
        
        const newMessage: Message = {
            ...message,
            id: `msg-${Date.now()}`,
            timestamp: Date.now(),
            status: MessageStatus.SENT,
        };

        const isGroupChat = newMessage.receiverId.startsWith('group-');
        const chatKey = isGroupChat ? newMessage.receiverId : getChatKey(newMessage.senderId, newMessage.receiverId);
        
        setMessages(prev => ({
            ...prev,
            [chatKey]: [...(prev[chatKey] || []), newMessage]
        }));
        
        // Simulate delivery and response for private chats
        if (!isGroupChat) {
            setTimeout(() => {
                setMessages(prev => {
                    const currentChat = prev[chatKey] || [];
                    return {
                        ...prev,
                        [chatKey]: currentChat.map(m => m.id === newMessage.id ? { ...m, status: MessageStatus.DELIVERED } : m)
                    }
                });
            }, 1000);

            // Only send an auto-reply for text messages
             if (newMessage.type === MessageType.TEXT) {
                const chatPartner = users.find(u => u.id === newMessage.receiverId);
                if (chatPartner) {
                    setTimeout(() => {
                        const replyMessage: Omit<Message, 'id' | 'timestamp' | 'status'> = {
                            senderId: chatPartner.id,
                            receiverId: currentUser.id,
                            type: MessageType.TEXT,
                            text: 'That sounds interesting!',
                        };
                        sendMessage(replyMessage);
                    }, 2000 + Math.random() * 2000);
                }
            }
        }
    }, [currentUser, users]);

    const markMessagesAsSeen = useCallback((chatId: string) => {
        if (!currentUser) return;
        const isGroupChat = chatId.startsWith('group-');
        // "Seen" logic is complex for groups, so we'll only handle it for private chats.
        if (isGroupChat) return;

        const chatKey = getChatKey(currentUser.id, chatId);

        setTimeout(() => {
             setMessages(prev => {
                const currentChat = prev[chatKey] || [];
                return {
                    ...prev,
                    [chatKey]: currentChat.map(m => 
                        m.receiverId === currentUser.id && m.status !== MessageStatus.SEEN
                        ? { ...m, status: MessageStatus.SEEN }
                        : m
                    )
                }
            });
        }, 500);
    }, [currentUser]);

    const value = { currentUser, users, groups, messages, login, updateUser, sendMessage, markMessagesAsSeen, logout };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};