import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileQuestion, 
  ClipboardList,
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is an admin
    const checkAdminAccess = () => {
      const user = sessionStorage.getItem('user') || localStorage.getItem('user');
      
      if (!user) {
        // Not logged in - redirect to signin
        navigate('/signin');
        return;
      }

      try {
        const userData = JSON.parse(user);
        // Check if user role is 'admin'
        const role = userData.role || sessionStorage.getItem('role') || localStorage.getItem('role');
        
        if (role === 'admin') {
          setIsAdmin(true);
        } else {
          // Not an admin - redirect to home
          navigate('/home');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Questions', path: '/admin/questions', icon: FileQuestion },
    { name: 'Exams', path: '/admin/exams', icon: ClipboardList },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  // Show loading while checking admin status
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You do not have permission to access the admin panel. Only administrators can access this area.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 font-medium"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="h-8 w-8 bg-primary-600 rounded flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">Korean LMS</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${active ? 'text-primary-700' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">AD</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@korean-lms.com</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-gray-600 transition-opacity ${
            sidebarOpen ? 'opacity-75' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar panel */}
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transition ease-in-out duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Close button */}
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:bg-gray-600"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-lg font-bold text-gray-900">Korean LMS</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 pt-2 pb-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 md:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Korean LMS Admin</h1>
            <div className="w-6"></div>
          </div>
        </header>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
