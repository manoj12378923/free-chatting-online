import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Message, User, Group, Gender, MessageStatus, MessageType } from '../types';
import { MOCK_GIFS } from '../constants';
import { ArrowLeft, Check, CheckCheck, Send, Sparkles, Users as UsersIcon, Paperclip, Gift, X } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { getIceBreaker } from '../services/geminiService';

const FullscreenViewer: React.FC<{ src: string; onClose: () => void }> = ({ src, onClose }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        onClick={onClose}
    >
        <button className="absolute top-4 right-4 text-white z-50">
            <X className="w-8 h-8" />
        </button>
        <img src={src} alt="Fullscreen view" className="max-w-[90vw] max-h-[90vh] object-contain" />
    </div>
);


const MessageBubble: React.FC<{ message: Message; isSender: boolean; isGroupChat: boolean; sender: User | undefined, onImageClick: (url: string) => void }> = ({ message, isSender, isGroupChat, sender, onImageClick }) => {
    const senderGender = sender?.gender ?? Gender.MALE;
    const senderName = sender?.name ?? 'Unknown User';

    const bubbleColor = isSender
        ? (senderGender === Gender.MALE ? 'bg-male-blue' : 'bg-female-pink')
        : 'bg-gray-200';

    const textColor = isSender ? 'text-white' : 'text-text-main';
    const alignment = isSender ? 'items-end' : 'items-start';

    const StatusIcon = () => {
        if (!isSender || message.type !== MessageType.TEXT) return null;
        switch (message.status) {
            case MessageStatus.SEEN: return <CheckCheck className="w-4 h-4 text-blue-300" />;
            case MessageStatus.DELIVERED: return <CheckCheck className="w-4 h-4 text-gray-400" />;
            case MessageStatus.SENT: return <Check className="w-4 h-4 text-gray-400" />;
            default: return null;
        }
    };

    const renderContent = () => {
        switch (message.type) {
            case MessageType.IMAGE:
            case MessageType.GIF:
                return (
                    <img
                        src={message.contentUrl}
                        alt={message.type === 'image' ? 'User uploaded image' : 'GIF'}
                        className="max-w-xs rounded-lg cursor-pointer"
                        onClick={() => onImageClick(message.contentUrl!)}
                    />
                );
            case MessageType.TEXT:
            default:
                return <p>{message.text}</p>;
        }
    };

    return (
        <div className={`flex flex-col ${alignment} mb-4`}>
            {isGroupChat && !isSender && (
                <p className="text-xs text-text-light mb-1 ml-2 font-medium" style={{ color: senderGender === Gender.MALE ? '#3b82f6' : '#ec4899' }}>
                    {senderName}
                </p>
            )}
            <div className={`max-w-xs md:max-w-md px-3 py-2 rounded-2xl ${bubbleColor} ${textColor} shadow-md`}>
                {renderContent()}
            </div>
            <div className={`flex items-center mt-1 space-x-1 ${isSender ? 'pr-1' : 'pl-1'}`}>
                <p className="text-xs text-text-light">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <StatusIcon />
            </div>
        </div>
    );
};


const ChatPage: React.FC = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const { currentUser, users, groups, messages, sendMessage, markMessagesAsSeen } = useAppContext();
    
    const [chatEntity, setChatEntity] = useState<User | Group | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isIceBreakerLoading, setIsIceBreakerLoading] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isGroupChat = chatEntity?.id.startsWith('group-') ?? false;

    const chatKey = (() => {
        if (!currentUser || !chatEntity) return '';
        if (isGroupChat) return chatEntity.id;
        if ('gender' in chatEntity) {
            return [currentUser.id, chatEntity.id].sort().join('-');
        }
        return '';
    })();

    const chatMessages = messages[chatKey] || [];
    
    useEffect(() => {
        if (!chatId) return;
        const foundEntity = users.find(u => u.id === chatId) || groups.find(g => g.id === chatId);
        if (foundEntity) {
            setChatEntity(foundEntity);
        } else {
            navigate('/users');
        }
    }, [chatId, users, groups, navigate]);

    useEffect(() => {
        if (chatEntity) {
            markMessagesAsSeen(chatEntity.id);
        }
    }, [chatEntity, chatMessages, markMessagesAsSeen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !currentUser || !chatEntity) return;
        sendMessage({
            senderId: currentUser.id,
            receiverId: chatEntity.id,
            type: MessageType.TEXT,
            text: newMessage,
        });
        setNewMessage('');
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && currentUser && chatEntity) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                sendMessage({
                    senderId: currentUser.id,
                    receiverId: chatEntity.id,
                    type: MessageType.IMAGE,
                    contentUrl: result,
                });
            };
            reader.readAsDataURL(file);
        }
        // Reset file input
        if(e.target) e.target.value = '';
    };

    const handleGifSelect = (gifUrl: string) => {
        if (currentUser && chatEntity) {
            sendMessage({
                senderId: currentUser.id,
                receiverId: chatEntity.id,
                type: MessageType.GIF,
                contentUrl: gifUrl,
            });
        }
        setShowGifPicker(false);
    };

    const handleIceBreaker = useCallback(async () => {
        setIsIceBreakerLoading(true);
        try {
            const suggestion = await getIceBreaker();
            setNewMessage(suggestion);
        } catch (error) {
            console.error("Failed to get ice breaker:", error);
            setNewMessage("What's your favorite movie?");
        } finally {
            setIsIceBreakerLoading(false);
        }
    }, []);

    if (!chatEntity || !currentUser) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    const getSender = (senderId: string) => users.find(u => u.id === senderId);

    const ChatHeader = () => {
        if (isGroupChat && 'memberIds' in chatEntity) {
            return (
                <div className="flex items-center ml-2 flex-1 min-w-0">
                    <img src={chatEntity.avatarUrl} alt={chatEntity.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="ml-3 min-w-0">
                        <p className="font-bold text-text-main truncate">{chatEntity.name}</p>
                        <p className="text-sm text-text-light flex items-center"><UsersIcon className="w-3 h-3 mr-1 flex-shrink-0" /> {chatEntity.memberIds.length} members</p>
                    </div>
                </div>
            );
        }
        if (!isGroupChat && 'gender' in chatEntity) {
            return (
                 <div className="flex items-center ml-2 flex-1 min-w-0">
                    <UserAvatar user={chatEntity} />
                    <div className="ml-3 min-w-0">
                        <p className="font-bold text-text-main truncate">{chatEntity.name}</p>
                        <p className="text-sm text-green-500 font-medium">{isTyping ? 'Typing...' : (chatEntity.isOnline ? 'Online' : 'Offline')}</p>
                    </div>
                </div>
            )
        }
        return null;
    }

    const GifPicker = () => (
        <div className="absolute bottom-16 left-2 right-2 bg-white p-2 border border-medium-gray rounded-lg shadow-xl max-h-60 overflow-y-auto">
            <div className="grid grid-cols-3 gap-2">
                {MOCK_GIFS.map(gif => (
                    <img key={gif} src={gif} onClick={() => handleGifSelect(gif)} className="w-full h-24 object-cover rounded-md cursor-pointer hover:scale-105 transition-transform" />
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-light-gray">
             {fullscreenImage && <FullscreenViewer src={fullscreenImage} onClose={() => setFullscreenImage(null)} />}
            <header className="flex items-center p-3 bg-white border-b border-medium-gray shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate('/users')} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft className="w-6 h-6 text-dark-gray" />
                </button>
                <ChatHeader />
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                {chatMessages.map(msg => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        isSender={msg.senderId === currentUser.id}
                        isGroupChat={isGroupChat}
                        sender={getSender(msg.senderId)}
                        onImageClick={setFullscreenImage}
                    />
                ))}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-2 bg-white border-t border-medium-gray relative">
                {showGifPicker && <GifPicker />}
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    {!isGroupChat && (
                        <>
                            <button type="button" onClick={handleIceBreaker} disabled={isIceBreakerLoading} className="p-2 text-female-pink rounded-full hover:bg-pink-100 disabled:opacity-50 disabled:animate-pulse">
                                <Sparkles className="w-6 h-6"/>
                            </button>
                             <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-dark-gray rounded-full hover:bg-gray-200">
                                <Paperclip className="w-6 h-6" />
                            </button>
                             <button type="button" onClick={() => setShowGifPicker(prev => !prev)} className="p-2 text-dark-gray rounded-full hover:bg-gray-200">
                                <Gift className="w-6 h-6" />
                            </button>
                        </>
                    )}
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-3 bg-light-gray rounded-full focus:outline-none focus:ring-2 focus:ring-male-blue"
                    />
                     {newMessage.trim() && (
                        <button type="submit" className="p-3 bg-male-blue text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400">
                            <Send className="w-6 h-6" />
                        </button>
                    )}
                </form>
            </footer>
        </div>
    );
};

export default ChatPage;