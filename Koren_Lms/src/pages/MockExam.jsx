import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Music, CheckSquare, Mic } from 'lucide-react';

const MockExam = () => {
  const navigate = useNavigate();
  const [examConfig, setExamConfig] = useState({
    examType: 'both', // 'mcq', 'voice', or 'both'
    numberOfQuestions: '20' // '20', '30', or '50'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartExam = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`http://localhost/takeExam.php?action=startExam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies/session
        body: JSON.stringify({
          examType: examConfig.examType,
          numberOfQuestions: parseInt(examConfig.numberOfQuestions, 10)
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to start exam');
      }

      const payload = data.data;
      navigate('/take-exam', {
        state: {
          attemptToken: payload.attemptToken,
          examType: payload.examType,
          numberOfQuestions: payload.numberOfQuestions,
          questions: payload.questions,
          startedVia: 'mockExam'
        }
      });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 sm:h-16">
            <button
              onClick={() => navigate('/home')}
              className="mr-2 sm:mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <div className="flex items-center">
              <FileQuestion className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 mr-1 sm:mr-2" />
              <h1 className="text-base sm:text-xl font-bold text-gray-900">Mock Exam</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          {/* Title Section */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Configure Your Mock Exam
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Choose your preferences to start practicing
            </p>
          </div>

          {/* Configuration Form */}
          <div className="space-y-6 sm:space-y-8">
            {/* Exam Type Selection */}
            <div>
              <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Select Exam Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                 

                {/* MCQ Only Option */}
                <label className={`relative flex flex-col items-center p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  examConfig.examType === 'mcq'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    name="examType"
                    value="mcq"
                    checked={examConfig.examType === 'mcq'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`mb-2 sm:mb-3 p-2 sm:p-3 rounded-full ${
                    examConfig.examType === 'mcq' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <CheckSquare className={`h-6 w-6 sm:h-8 sm:w-8 ${
                      examConfig.examType === 'mcq' ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                    MCQ Only
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 text-center">
                    Multiple choice questions
                  </span>
                  {examConfig.examType === 'mcq' && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <div className="bg-blue-600 rounded-full p-1">
                        <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                    </div>
                  )}
                </label>

                {/* Voice Only Option */}
                <label className={`relative flex flex-col items-center p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  examConfig.examType === 'voice'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}>
                  <input
                    type="radio"
                    name="examType"
                    value="voice"
                    checked={examConfig.examType === 'voice'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`mb-2 sm:mb-3 p-2 sm:p-3 rounded-full ${
                    examConfig.examType === 'voice' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <Mic className={`h-6 w-6 sm:h-8 sm:w-8 ${
                      examConfig.examType === 'voice' ? 'text-purple-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                    Voice Only
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 text-center">
                    Listening comprehension
                  </span>
                  {examConfig.examType === 'voice' && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <div className="bg-purple-600 rounded-full p-1">
                        <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Number of Questions Selection */}
            <div className="pt-8 sm:pt-12 border-t border-gray-200">
              <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {['20', '40'].map((num) => (
                  <label
                    key={num}
                    className={`flex items-center justify-center p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      examConfig.numberOfQuestions === num
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="numberOfQuestions"
                      value={num}
                      checked={examConfig.numberOfQuestions === num}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`text-2xl sm:text-3xl font-bold mb-1 ${
                        examConfig.numberOfQuestions === num
                          ? 'text-primary-600'
                          : 'text-gray-700'
                      }`}>
                        {num}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">Questions</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Exam Summary</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-600">Exam Type:</span>
                  <span className="font-medium text-gray-900 text-right">
                    {examConfig.examType === 'both' ? 'MCQ & Voice Questions' :
                     examConfig.examType === 'mcq' ? 'MCQ Questions Only' :
                     'Voice Questions Only'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-medium text-gray-900">{examConfig.numberOfQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Time:</span>
                  <span className="font-medium text-gray-900">
                    {parseInt(examConfig.numberOfQuestions) * 1.5} minutes
                  </span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                onClick={() => navigate('/home')}
                className="flex-1 btn-secondary text-sm sm:text-base"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleStartExam}
                className={`flex-1 btn-primary text-sm sm:text-base ${loading ? 'opacity-75 cursor-wait' : ''}`}
                disabled={loading}
              >
                {loading ? 'Starting…' : 'Start Exam'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">📝 Answer All Questions</h4>
            <p className="text-xs sm:text-sm text-blue-700">
              You must answer all questions before submitting the exam
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 sm:p-6 border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">✅ Instant Results</h4>
            <p className="text-xs sm:text-sm text-green-700">
              Get your score immediately after completing the exam
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 sm:p-6 border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">🎯 Practice Mode</h4>
            <p className="text-xs sm:text-sm text-purple-700">
              This is a practice exam to help you prepare
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MockExam;
