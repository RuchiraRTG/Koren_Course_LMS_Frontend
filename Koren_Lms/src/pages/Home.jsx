import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award, BarChart3, Bell, Search, LogOut, FileQuestion } from 'lucide-react';
import LMSLogo from '../assets/LMSLOGO.png';
import heroSection from '../assets/herosection.png';
import { logoutUser, getCurrentUser } from '../services/authService';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      // Try to get full name from various possible field names
      const fullName = 
        user.fullName || 
        user.full_name || 
        (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '') ||
        (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : '') ||
        user.name || 
        user.username || 
        'User';
      setUserName(fullName);
    }
  }, []);

  const stats = [
    { title: 'Total Courses', value: '12', icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Active Students', value: '248', icon: Users, color: 'bg-green-500' },
    { title: 'Completed Lessons', value: '1,847', icon: Award, color: 'bg-purple-500' },
    { title: 'Progress Rate', value: '85%', icon: BarChart3, color: 'bg-orange-500' },
  ];

  const recentCourses = [
    { id: 1, title: '한글 기초 (Hangul Basics)', progress: 75, level: 'Beginner' },
    { id: 2, title: '일상 대화 (Daily Conversation)', progress: 45, level: 'Intermediate' },
    { id: 3, title: '비즈니스 한국어 (Business Korean)', progress: 30, level: 'Advanced' },
  ];

  const announcements = [
    { id: 1, title: 'New Korean Culture Course Available', date: '2 days ago' },
    { id: 2, title: 'Weekly Quiz: Korean Grammar', date: '1 week ago' },
    { id: 3, title: 'Study Group Meeting - Saturday 2PM', date: '1 week ago' },
  ];

  return (
  <div className="min-h-screen" style={{ backgroundColor: '#fffdfdff' }}>
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={LMSLogo} alt="LMS Logo" className="h-10 w-10 object-contain" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Korean LMS</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium text-gray-700">{userName}</span>
                </button>
                <button 
                  onClick={() => logoutUser(navigate)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <style>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-slide-left {
            animation: slideInLeft 0.8s ease-out;
          }
          .animate-slide-right {
            animation: slideInRight 0.8s ease-out 0.2s backwards;
          }
          .animate-fade-scale {
            animation: fadeInScale 0.8s ease-out 0.4s backwards;
          }
        `}</style>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          {/* Left Side - Text Content */}
          <div className="animate-slide-left">
            <div className="mb-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-primary-600 mb-4 leading-tight">
                Korean <br /> LMS
              </h1>
              <p className="text-xl text-gray-700 mb-2"> The Ideal Platform for</p>
              <p className="text-2xl font-semibold text-gray-900">Expanding Knowledge</p>
            </div>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Welcome, <span className="font-semibold text-primary-600">{userName}!</span> Continue your learning journey with our comprehensive Korean language courses.
            </p>
            <button className="btn-primary inline-block px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg">
              Start Learning
            </button>
          </div>

          {/* Right Side - Hero Image */}
          <div className="animate-fade-scale flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-300 to-primary-600 rounded-3xl blur-2xl opacity-30 transform -rotate-6"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl w-full max-w-2xl">
                <img 
                  src={heroSection} 
                  alt="Hero Section" 
                  className="w-full h-auto object-cover rounded-3xl" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo Upload Section */}
          <div className="lg:col-span-2">
            {/* Add your photo upload component here */}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/mock-exam" className="card text-center hover:bg-primary-50 transition-colors border-2 border-primary-200">
              <FileQuestion className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-primary-700">Take Mock Exam</p>
            </Link>
            <Link to="/student-progress-table" className="card text-center hover:bg-primary-50 transition-colors border-2 border-primary-200">
              <BarChart3 className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-primary-700">Your Progress</p>
            </Link>
          </div>
        </div>
      </main>

      <Footer logoSrc={LMSLogo} logoAlt="Koren LMS Logo" logoWidth="w-32" />
    </div>
  );
};

export default Home;