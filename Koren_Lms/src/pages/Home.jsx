import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award, BarChart3, Bell, Search, LogOut, FileQuestion } from 'lucide-react';
import LMSLogo from '../assets/LMSLOGO.png';
import { logoutUser } from '../services/authService';

const Home = () => {
  const navigate = useNavigate();
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
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors">
                    <span className="text-sm font-medium text-gray-700">S</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Student</span>
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

      
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         
        
        {/* Stats Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Continue Learning</h3>
                <Link to="/courses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {course.level}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {course.progress}%
                      </span>
                    </div>
                    
                    <button className="mt-3 w-full btn-primary">
                      Continue Learning
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-primary-500 pl-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {announcement.title}
                    </h4>
                    <p className="text-xs text-gray-500">{announcement.date}</p>
                  </div>
                ))}
              </div>
              
              <button className="mt-6 w-full btn-secondary">
                View All Announcements
              </button>
            </div>
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
            
            <Link to="/courses" className="card text-center hover:bg-gray-50 transition-colors">
              <BookOpen className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Browse Courses</p>
            </Link>
            
            <Link to="/practice" className="card text-center hover:bg-gray-50 transition-colors">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Practice Quiz</p>
            </Link>
            
            <Link to="/schedule" className="card text-center hover:bg-gray-50 transition-colors">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">View Progress</p>
            </Link>
            
            <Link to="/community" className="card text-center hover:bg-gray-50 transition-colors">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Community</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;