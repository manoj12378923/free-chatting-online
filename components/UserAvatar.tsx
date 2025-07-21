
import React from 'react';
import { User } from '../types';

interface UserAvatarProps {
    user: User;
    size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };
    const statusSizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
    };

    return (
        <div className="relative flex-shrink-0">
            <img
                src={user.avatarUrl}
                alt={user.name}
                className={`rounded-full object-cover ${sizeClasses[size]}`}
            />
            {user.isOnline && (
                <span className={`absolute bottom-0 right-0 block ${statusSizeClasses[size]} bg-green-500 rounded-full ring-2 ring-white`}></span>
            )}
        </div>
    );
};

export default UserAvatar;
