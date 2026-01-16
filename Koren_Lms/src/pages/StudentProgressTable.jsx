import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Download, Loader } from 'lucide-react';
import LMSLogo from '../assets/LMSLOGO.png';
import Footer from '../components/Footer';

const StudentProgressTable = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch student exam results on component mount
  useEffect(() => {
    fetchStudentExamResults();
  }, []);

  const fetchStudentExamResults = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch exam results for logged-in student
      const response = await fetch('http://localhost/getExamResults.php?action=getResults', {
        method: 'GET',
        credentials: 'include', // Include cookies for session
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('You are not logged in. Please sign in first.');
          // Optionally redirect to login
          // navigate('/signin');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data && data.data.results) {
        const results = data.data.results;
        
        // Transform the data to match the table structure
        const transformedData = results.map((result) => ({
          id: result.id,
          studentName: studentName || 'Current Student', // Will be set from user info
          marks: result.percentage,
          examDate: result.submittedAt,
          score: result.score,
          totalMarks: result.totalMarks,
          examId: result.examId,
          status: result.status
        }));

        setStudentData(transformedData);
      } else {
        setError(data.message || 'Failed to fetch exam results');
      }
    } catch (err) {
      console.error('Error fetching exam results:', err);
      setError('Error fetching exam results. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch current logged-in student information
  useEffect(() => {
    fetchStudentInfo();
  }, []);

  const fetchStudentInfo = async () => {
    try {
      const response = await fetch('http://localhost/userprofile.php', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const { first_name, last_name } = data.data;
          const fullName = `${first_name} ${last_name}`.trim();
          setStudentName(fullName);
        }
      }
    } catch (err) {
      console.error('Error fetching student info:', err);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    if (studentData.length === 0) {
      return {
        totalExams: 0,
        averageScore: 0,
        passRate: 0
      };
    }

    const totalExams = studentData.length;
    const averageScore = (studentData.reduce((acc, s) => acc + s.marks, 0) / totalExams).toFixed(1);
    const passRate = ((studentData.filter(s => s.marks >= 60).length / totalExams) * 100).toFixed(0);

    return {
      totalExams,
      averageScore,
      passRate
    };
  };

  const stats = calculateStats();

  // Download/Export functionality
  const handleExportData = () => {
    if (studentData.length === 0) {
      alert('No data to export');
      return;
    }

    // Create CSV content
    const headers = ['Score', 'Total Marks', 'Percentage', 'Date', 'Status'];
    const rows = studentData.map(exam => [
      exam.score,
      exam.totalMarks,
      exam.marks,
      new Date(exam.examDate).toLocaleDateString('en-US'),
      exam.status
    ]);

    const csvContent = [
      [`Student: ${studentName}`],
      [],
      [headers.join(',')],
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `exam-results-${studentName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading your exam results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={LMSLogo} alt="LMS Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Exam Results</h1>
                <p className="text-gray-600 mt-1">
                 Welcome View your exam results and progress 
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Export Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-600">
                Total Exams Taken: <span className="text-lg font-bold text-gray-900">{studentData.length}</span>
              </h2>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              disabled={studentData.length === 0}
            >
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Exam Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentData.length > 0 ? (
                  studentData.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {exam.score}/{exam.totalMarks}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-semibold ${
                            exam.marks >= 90 ? 'text-green-600' :
                            exam.marks >= 75 ? 'text-blue-600' :
                            exam.marks >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {exam.marks.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {exam.examDate ? 
                            new Date(exam.examDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                            : 'N/A'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          exam.status === 'completed' || exam.status === 'submitted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {exam.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No exam results found. Start taking exams to see your results here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        {studentData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Exams Taken</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalExams}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Average Percentage</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.averageScore}%</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pass Rate (≥60%)</h3>
              <p className="text-3xl font-bold text-green-600">{stats.passRate}%</p>
            </div>
          </div>
        )}
      </div>

      <Footer logoSrc={LMSLogo} logoAlt="Korean LMS Logo" logoWidth="w-32" />
    </div>
  );
};

export default StudentProgressTable;
