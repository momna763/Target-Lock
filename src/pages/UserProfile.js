import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { User, Mail, LogOut } from 'lucide-react';
import { Alert } from '@mui/material';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [profile, setProfile] = useState({ 
    name: '', 
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  useEffect(() => {
    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setProfile({
          name: userData.name || currentUser.displayName || '',
          email: userData.email || currentUser.email
        });
      } else {
        // Create initial profile with basic info
        const initialProfile = {
          name: currentUser.displayName || '',
          email: currentUser.email,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, initialProfile);
        setProfile({
          name: initialProfile.name,
          email: initialProfile.email
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const updateData = {
        name: profile.name,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(userDocRef, updateData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    }

    setLoading(false);
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Hero Header */}
      <div className={`relative overflow-hidden rounded-3xl mb-8 ${isDark ? 'bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <User className="w-8 h-8" />
                </div>
                User Profile
              </h1>
              <p className="text-white/80 text-lg">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
      {/* Profile Card */}
      <div className={`rounded-3xl shadow-2xl p-8 mb-8 flex flex-col items-center border backdrop-blur-xl ${
        isDark 
          ? 'bg-gray-900/80 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <img
          src={currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`}
          alt="User Avatar"
          className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-xl mb-6 hover:scale-105 transition-transform duration-300"
        />
        <h3 className={`text-2xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>{profile.name || 'User'}</h3>
        <p className={`text-lg ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>{currentUser.email}</p>
      </div>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit} className={`rounded-3xl shadow-2xl p-8 space-y-6 border backdrop-blur-xl ${
        isDark 
          ? 'bg-gray-900/80 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div>
          <label className={`block font-semibold mb-3 text-lg ${
            isDark ? 'text-white' : 'text-gray-700'
          }`}>Full Name</label>
          <div className={`flex items-center border-2 rounded-2xl px-4 py-3 transition-all duration-300 focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 ${
            isDark 
              ? 'border-gray-600 bg-gray-800/50' 
              : 'border-gray-300 bg-gray-50'
          }`}>
            <User className={`w-5 h-5 mr-3 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className={`w-full outline-none bg-transparent text-lg ${
                isDark 
                  ? 'text-white placeholder-gray-400' 
                  : 'text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <label className={`block font-semibold mb-3 text-lg ${
            isDark ? 'text-white' : 'text-gray-700'
          }`}>Email</label>
          <div className={`flex items-center border-2 rounded-2xl px-4 py-3 ${
            isDark 
              ? 'border-gray-700 bg-gray-800/30 text-gray-400' 
              : 'border-gray-300 bg-gray-100 text-gray-500'
          }`}>
            <Mail className={`w-5 h-5 mr-3 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="email"
              value={currentUser.email}
              disabled
              className={`w-full outline-none bg-transparent text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
          </div>
          <p className={`text-sm mt-2 ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}>Email cannot be changed</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 mx-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-8 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
      </div>
    </div>
  );
};

export default UserProfile;
