import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Award, BookOpen, Calendar, Edit2, Save, X, ArrowLeft } from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Use GET method to fetch profile from backend
      const response = await fetch('http://localhost/userprofile.php', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Backend returns camelCase, normalize for component use
        const normalizedData = {
          id: data.data.id,
          first_name: data.data.firstName,
          last_name: data.data.lastName,
          email: data.data.email,
          phone: data.data.phone,
          nic_number: data.data.nicNumber,
          batch_number: data.data.batchNumber,
          role: data.data.role,
          user_type: data.data.userType,
          profile_photo: data.data.profilePhoto,
          created_at: data.data.createdAt,
          updated_at: data.data.updatedAt,
          is_active: data.data.isActive
        };
        setProfileData(normalizedData);
        setEditData(normalizedData);
      } else {
        setError(data.message || 'Failed to load profile');
        // Fallback to stored user data
        const userData = sessionStorage.getItem('user') || localStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setProfileData(parsedData);
          setEditData(parsedData);
        }
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      // Fallback to stored user data
      const userData = sessionStorage.getItem('user') || localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setProfileData(parsedData);
        setEditData(parsedData);
      } else {
        setError('Failed to load profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Convert snake_case back to camelCase for backend
      const updatePayload = {
        firstName: editData.first_name,
        lastName: editData.last_name,
        email: editData.email,
        phone: editData.phone
      };

      const response = await fetch('http://localhost/userprofile.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatePayload)
      });

      const data = await response.json();

      if (data.success) {
        // Normalize response data
        const normalizedData = {
          id: data.data.id,
          first_name: data.data.firstName,
          last_name: data.data.lastName,
          email: data.data.email,
          phone: data.data.phone,
          nic_number: data.data.nicNumber,
          batch_number: data.data.batchNumber,
          role: data.data.role,
          user_type: data.data.userType,
          profile_photo: data.data.profilePhoto,
          created_at: data.data.createdAt,
          updated_at: data.data.updatedAt,
          is_active: data.data.isActive
        };
        
        setProfileData(normalizedData);
        setEditData(normalizedData);
        setIsEditing(false);
        // Update stored user data
        sessionStorage.setItem('user', JSON.stringify(normalizedData));
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#e1efff' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#e1efff' }}>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <p className="text-red-600 mb-4">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => navigate('/signin')}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e1efff' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <div className="w-32"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <X className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 sm:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center border-4 border-primary-200">
                  <User className="h-10 w-10 text-primary-600" />
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-white">
                    {isEditing ? (
                      <input
                        type="text"
                        name="first_name"
                        value={editData.first_name || ''}
                        onChange={handleEditChange}
                        className="bg-primary-700 text-white px-3 py-1 rounded border border-primary-400"
                      />
                    ) : (
                      `${profileData.first_name || 'User'} ${profileData.last_name || ''}`
                    )}
                  </h2>
                  <p className="text-primary-100 mt-1">
                    {profileData.role || 'Student'}
                  </p>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 font-medium transition-colors"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 py-8">
            {/* Action Buttons */}
            {isEditing && (
              <div className="mb-6 flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 font-medium transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}

            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={editData.first_name || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.first_name || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={editData.last_name || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.last_name || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.email || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.phone || 'N/A'}</p>
                  )}
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Join Date
                  </label>
                  <p className="text-gray-900 font-medium">
                    {profileData.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            {(profileData.level || profileData.completed_courses || profileData.total_points) && (
              <div className="mb-8 border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary-600" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Current Level</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {profileData.level || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Completed Courses</p>
                    <p className="text-2xl font-bold text-green-600">
                      {profileData.completed_courses || 0}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Points</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {profileData.total_points || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bio/About */}
            {(profileData.bio || isEditing) && (
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
                  About Me
                </h3>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editData.bio || ''}
                    onChange={handleEditChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700">
                    {profileData.bio || 'No bio added yet.'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
