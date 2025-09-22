import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut } from 'lucide-react';
import { Alert } from '@mui/material';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          console.log('No such document!');
        }
      });
    }
  }, [currentUser]);

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
      await updateDoc(userDocRef, { name: profile.name });
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">User Profile & Settings</h2>
        <p className="text-gray-600">Edit your profile and manage preferences.</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8 flex flex-col items-center">
        <img
          src={currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`}
          alt="User Avatar"
          className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow mb-4"
        />
        <h3 className="text-xl font-bold text-gray-800">{profile.name || 'User'}</h3>
        <p className="text-gray-600">{currentUser.email}</p>
      </div>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Full Name</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 text-gray-500">
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full outline-none bg-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 mx-auto bg-red-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
