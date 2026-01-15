import React, { useState, useEffect } from 'react';
import { TrendingUp, Search, Download, Users, BookOpen, Award } from 'lucide-react';

const StudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgCompletion: 0,
    activeToday: 0,
    advancedLevel: 0
  });

  // Fetch student progress data from backend
  useEffect(() => {
    fetchStudentProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudentProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost/studentProgress.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStudents(result.data || []);
        
        // Fetch statistics separately
        fetchStatistics();
      } else {
        setError(result.message || 'Failed to fetch student progress');
      }
    } catch (error) {
      console.error('Error fetching student progress:', error);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost/studentProgress.php?action=stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setStats({
          totalStudents: result.data.totalStudents || 0,
          avgCompletion: result.data.avgCompletion || 0,
          activeToday: result.data.activeToday || 0,
          advancedLevel: result.data.advancedLevel || 0
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const statsDisplay = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Avg Completion',
      value: Math.round(stats.avgCompletion) + '%',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Active Today',
      value: stats.activeToday,
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      title: 'Advanced Level',
      value: stats.advancedLevel,
      icon: Award,
      color: 'bg-orange-500',
    },
  ];

  const handleExportReport = () => {
    // Convert students data to CSV
    const csvHeader = 'Name,Email,Marks,Exam Date\n';
    const csvRows = filteredStudents.map(student => 
      `"${student.name}","${student.email}",${student.marks},"${new Date(student.examFaceDate).toLocaleDateString()}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `student_progress_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchStudentProgress}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
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
        <button 
          onClick={handleExportReport}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, index) => (
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

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
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
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Marks</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Exam Face Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">{student.marks.toFixed(2)}%</p>
                        <span className={`inline-block w-2 h-2 rounded-full ${getProgressColor(student.marks)}`}></span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {student.examFaceDate ? new Date(student.examFaceDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center">
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
