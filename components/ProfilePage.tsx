import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import UserAvatar from './UserAvatar';
import { ArrowLeft, Edit, Save, Camera, LogOut } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { currentUser, updateUser, logout } = useAppContext();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: currentUser?.name || '',
        age: currentUser?.age || 18,
        bio: currentUser?.bio || '',
        avatarUrl: currentUser?.avatarUrl || ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentUser) {
            setEditData({
                name: currentUser.name,
                age: currentUser.age,
                bio: currentUser.bio,
                avatarUrl: currentUser.avatarUrl,
            });
        }
    }, [currentUser]);

    if (!currentUser) {
        // Should be redirected by router, but as a fallback:
        navigate('/login');
        return null; 
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (typeof result === 'string') {
                    setEditData(prev => ({ ...prev, avatarUrl: result }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value, 10) : value }));
    };

    const handleSave = () => {
        updateUser(editData);
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="flex flex-col h-full bg-light-gray">
            <header className="flex items-center justify-between p-3 bg-white border-b border-medium-gray shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft className="w-6 h-6 text-dark-gray" />
                </button>
                <h1 className="text-lg font-bold text-dark-gray">My Profile</h1>
                {isEditing ? (
                    <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-male-blue rounded-full hover:bg-blue-600">
                        <Save className="w-4 h-4"/>
                        Save
                    </button>
                ) : (
                    <button onClick={handleEditClick} className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-dark-gray bg-gray-200 rounded-full hover:bg-gray-300">
                        <Edit className="w-4 h-4"/>
                        Edit
                    </button>
                )}
            </header>

            <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
                <div className="relative mb-6">
                    <UserAvatar user={{ ...currentUser, avatarUrl: editData.avatarUrl }} size="lg" />
                    {isEditing && (
                         <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 p-2 bg-female-pink text-white rounded-full shadow-md hover:bg-pink-600 transition-transform hover:scale-110"
                            aria-label="Change profile picture"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                <div className="w-full max-w-sm space-y-4">
                    <div className="text-center">
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={editData.name}
                                onChange={handleInputChange}
                                className="text-2xl font-bold text-center w-full p-2 border-b-2 border-male-blue focus:outline-none bg-transparent"
                            />
                        ) : (
                            <h2 className="text-3xl font-bold text-dark-gray">{currentUser.name}</h2>
                        )}
                        {isEditing ? (
                            <input
                                type="number"
                                name="age"
                                value={editData.age}
                                onChange={handleInputChange}
                                className="text-lg text-center w-24 p-1 mt-1 border-b-2 border-male-blue focus:outline-none bg-transparent"
                            />
                        ) : (
                             <p className="text-lg text-text-light">{currentUser.age} years old</p>
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <label className="text-sm font-semibold text-female-pink">Bio</label>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={editData.bio}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 text-text-main bg-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-female-pink"
                                rows={3}
                            />
                        ) : (
                            <p className="mt-1 text-text-main italic">"{currentUser.bio}"</p>
                        )}
                    </div>
                     <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm font-semibold text-male-blue">Location</p>
                         <p className="mt-1 text-text-main">{currentUser.city}, {currentUser.country}</p>
                    </div>
                </div>
                <div className="w-full max-w-sm mt-auto pt-8">
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-3 font-bold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;