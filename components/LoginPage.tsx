import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { User, Gender } from '../types';
import { MessageSquareHeart } from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { CITIES_BY_COUNTRY } from '../data/cities';

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        country: '',
        city: '',
        gender: Gender.MALE,
    });
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const { login } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (formData.country) {
            setAvailableCities(CITIES_BY_COUNTRY[formData.country] || []);
            // Reset city when country changes to avoid invalid state
            setFormData(prev => ({ ...prev, city: '' }));
        } else {
            setAvailableCities([]);
        }
    }, [formData.country]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (gender: Gender) => {
        setFormData(prev => ({ ...prev, gender }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser: Omit<User, 'id'> = {
            ...formData,
            age: parseInt(formData.age, 10) || 18,
            avatarUrl: `https://picsum.photos/seed/${formData.name}/200/200`,
            bio: 'Ready to chat!',
            isOnline: true,
        };
        login(newUser as User);
        navigate('/users');
    };

    const isFormValid = formData.name && formData.age && formData.country && formData.city;

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-blue-50 to-pink-50">
            <div className="w-full max-w-md text-center">
                <MessageSquareHeart className="w-20 h-20 mx-auto text-female-pink" />
                <h1 className="text-4xl font-bold text-dark-gray mt-4">Welcome to Gemini Chat</h1>
                <p className="text-text-light mt-2 mb-8">Tell us a little about yourself to get started.</p>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-male-blue" required />
                    <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full p-3 border border-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-male-blue" required />
                    <div className="flex space-x-4">
                        <select name="country" value={formData.country} onChange={handleChange} className="w-1/2 p-3 border border-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-male-blue bg-white" required>
                            <option value="" disabled>Country</option>
                            {COUNTRIES.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-1/2 p-3 border border-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-male-blue bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                            required
                            disabled={!formData.country || availableCities.length === 0}
                        >
                            <option value="" disabled>City</option>
                            {availableCities.length > 0 ? (
                                availableCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))
                            ) : (
                                formData.country && <option value="" disabled>No cities listed</option>
                            )}
                        </select>
                    </div>

                    <div className="flex items-center justify-center space-x-4 pt-2">
                        <label className="text-text-main font-medium">Gender:</label>
                        <button type="button" onClick={() => handleGenderChange(Gender.MALE)} className={`px-6 py-2 rounded-full transition-colors ${formData.gender === Gender.MALE ? 'bg-male-blue text-white shadow-lg' : 'bg-white text-male-blue border border-male-blue'}`}>
                            Male
                        </button>
                        <button type="button" onClick={() => handleGenderChange(Gender.FEMALE)} className={`px-6 py-2 rounded-full transition-colors ${formData.gender === Gender.FEMALE ? 'bg-female-pink text-white shadow-lg' : 'bg-white text-female-pink border border-female-pink'}`}>
                            Female
                        </button>
                    </div>

                    <button type="submit" disabled={!isFormValid} className="w-full p-4 mt-4 font-bold text-white rounded-lg transition-all bg-gradient-to-r from-male-blue to-female-pink disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105">
                        Join Chat
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;