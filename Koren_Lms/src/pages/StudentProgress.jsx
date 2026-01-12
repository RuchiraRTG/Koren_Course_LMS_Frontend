import React, { useState, useEffect } from 'react';
import { TrendingUp, Search, Filter, Download, BarChart3, Users, BookOpen, Award } from 'lucide-react';

const StudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockStudents = [
      {
        id: 1,
        name: 'Janitha Lakshan',
        email: 'janitha@example.com',
        level: 'Beginner',
        coursesEnrolled: 3,
        coursesCompleted: 1,
        progressPercentage: 35,
        lastActive: '2 days ago',
        totalLessons: 45,
        lessonsCompleted: 16,
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        level: 'Intermediate',
        coursesEnrolled: 5,
        coursesCompleted: 3,
        progressPercentage: 68,
        lastActive: '1 day ago',
        totalLessons: 75,
        lessonsCompleted: 51,
      },
      {
        id: 3,
        name: 'Michael Chen',
        email: 'michael@example.com',
        level: 'Advanced',
        coursesEnrolled: 4,
        coursesCompleted: 3,
        progressPercentage: 82,
        lastActive: 'Today',
        totalLessons: 60,
        lessonsCompleted: 49,
      },
      {
        id: 4,
        name: 'Emma Wilson',
        email: 'emma@example.com',
        level: 'Beginner',
        coursesEnrolled: 2,
        coursesCompleted: 0,
        progressPercentage: 15,
        lastActive: '1 week ago',
        totalLessons: 30,
        lessonsCompleted: 5,
      },
      {
        id: 5,
        name: 'David Kumar',
        email: 'david@example.com',
        level: 'Intermediate',
        coursesEnrolled: 3,
        coursesCompleted: 2,
        progressPercentage: 55,
        lastActive: '3 days ago',
        totalLessons: 50,
        lessonsCompleted: 28,
      },
    ];

    setStudents(mockStudents);
    setLoading(false);
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'all' || student.level === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-blue-100 text-blue-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Avg Completion',
      value: Math.round(students.reduce((acc, s) => acc + s.progressPercentage, 0) / students.length) + '%',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Active Today',
      value: students.filter((s) => s.lastActive === 'Today').length,
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      title: 'Advanced Level',
      value: students.filter((s) => s.level === 'Advanced').length,
      icon: Award,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Progress</h1>
          <p className="text-gray-600 mt-1">Track and monitor student learning progress</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
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

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Progress</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Lessons</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Courses</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getLevelBadgeColor(student.level)}`}>
                        {student.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`${getProgressColor(student.progressPercentage)} h-2 rounded-full`}
                            style={{ width: `${student.progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{student.progressPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {student.lessonsCompleted} / {student.totalLessons}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {student.coursesCompleted} / {student.coursesEnrolled}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{student.lastActive}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <p className="text-gray-600">No students found matching your search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredStudents.length} of {students.length} students
      </div>
    </div>
  );
};

export default StudentProgress;
