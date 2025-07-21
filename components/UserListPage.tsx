
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { User, Group, Gender } from '../types';
import UserAvatar from './UserAvatar';
import { Users, User as UserIcon, MessageSquare, UserCircle } from 'lucide-react';

const UserListItem: React.FC<{ user: User }> = ({ user }) => {
    const navigate = useNavigate();

    return (
        <li
            onClick={() => navigate(`/chat/${user.id}`)}
            className="flex items-center p-3 space-x-4 cursor-pointer hover:bg-light-gray rounded-lg transition-colors"
        >
            <UserAvatar user={user} />
            <div className="flex-1">
                <p className="font-semibold text-text-main">{user.name}, {user.age}</p>
                <p className="text-sm text-text-light truncate italic">"{user.bio}"</p>
            </div>
        </li>
    );
};

const GroupListItem: React.FC<{ group: Group }> = ({ group }) => {
    const navigate = useNavigate();
    return (
        <li
            onClick={() => navigate(`/chat/${group.id}`)}
            className="flex items-center p-3 space-x-4 cursor-pointer hover:bg-light-gray rounded-lg transition-colors"
        >
            <div className="relative flex-shrink-0">
                <img src={group.avatarUrl} alt={group.name} className="w-12 h-12 rounded-full object-cover" />
            </div>
            <div className="flex-1">
                <p className="font-semibold text-text-main">{group.name}</p>
                <p className="text-sm text-text-light truncate italic">"{group.description}"</p>
            </div>
        </li>
    );
}

const UserListPage: React.FC = () => {
    const { users, currentUser, groups } = useAppContext();
    const [activeTab, setActiveTab] = useState<'all' | 'male' | 'female' | 'groups'>('all');
    const navigate = useNavigate();
    
    const otherUsers = users.filter(u => u.id !== currentUser?.id);
    
    const filteredUsers = otherUsers.filter(user => {
        if (activeTab === 'male') return user.gender === Gender.MALE;
        if (activeTab === 'female') return user.gender === Gender.FEMALE;
        return true; // for 'all'
    });

    const userGroups = currentUser ? groups.filter(g => g.memberIds.includes(currentUser.id)) : [];

    const renderContent = () => {
        if (activeTab === 'groups') {
            return (
                 userGroups.length > 0 ? (
                    <ul>
                        {userGroups.map(group => (
                            <GroupListItem key={group.id} group={group} />
                        ))}
                    </ul>
                ) : (
                    <div className="text-center p-8 text-text-light">
                        <p>You haven't joined any groups yet.</p>
                    </div>
                )
            );
        }
        return (
             filteredUsers.length > 0 ? (
                <ul>
                    {filteredUsers.map(user => (
                        <UserListItem key={user.id} user={user} />
                    ))}
                </ul>
            ) : (
                 <div className="text-center p-8 text-text-light">
                    <p>No users found in this category.</p>
                </div>
            )
        );
    }

    const TabButton = ({ tabName, label, icon: Icon }: { tabName: typeof activeTab, label: string, icon: React.ElementType }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex-1 flex flex-col items-center justify-center p-2 text-sm font-medium transition-colors ${
                activeTab === tabName ? 'text-male-blue border-b-2 border-male-blue' : 'text-text-light'
            }`}
        >
            <Icon className="w-5 h-5 mb-1" />
            {label}
        </button>
    );

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 bg-white border-b border-medium-gray shadow-sm sticky top-0">
                <h1 className="text-xl font-bold text-dark-gray">Love 2 Chat</h1>
                <button onClick={() => navigate('/profile')} className="p-2 rounded-full hover:bg-gray-100">
                    <UserCircle className="w-7 h-7 text-dark-gray" />
                </button>
            </header>
            <nav className="flex bg-white border-b border-medium-gray">
                <TabButton tabName="all" label="All" icon={Users} />
                <TabButton tabName="male" label="Men" icon={UserIcon} />
                <TabButton tabName="female"label="Women" icon={UserIcon} />
                <TabButton tabName="groups" label="Groups" icon={MessageSquare} />
            </nav>
            <main className="flex-1 overflow-y-auto p-2">
                {renderContent()}
            </main>
        </div>
    );
};

export default UserListPage;
