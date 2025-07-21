
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginPage from './components/LoginPage';
import UserListPage from './components/UserListPage';
import ChatPage from './components/ChatPage';
import ProfilePage from './components/ProfilePage';

const AppRoutes: React.FC = () => {
    const { currentUser } = useAppContext();

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/users" element={currentUser ? <UserListPage /> : <Navigate to="/login" />} />
            <Route path="/chat/:chatId" element={currentUser ? <ChatPage /> : <Navigate to="/login" />} />
            <Route path="/profile" element={currentUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to={currentUser ? "/users" : "/login"} />} />
        </Routes>
    );
};


const App: React.FC = () => {
  return (
    <AppProvider>
        <div className="w-full h-full bg-white font-sans md:max-w-md md:mx-auto md:shadow-2xl md:my-4 md:rounded-lg md:h-[calc(100%-2rem)]">
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </div>
    </AppProvider>
  );
};

export default App;
