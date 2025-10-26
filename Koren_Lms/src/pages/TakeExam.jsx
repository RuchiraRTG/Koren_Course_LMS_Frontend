import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, FileQuestion, Music } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../config/api';

const TakeExam = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State passed from MockExam: { attemptToken, examType, numberOfQuestions, questions, startedVia }
  const { attemptToken, examType, numberOfQuestions, questions, startedVia } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If no questions, redirect back
  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/mock-exam');
    }
  }, [questions, navigate]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestionIndex(index);
  };

  const areAllQuestionsAnswered = () => {
    return questions.every(q => userAnswers.hasOwnProperty(q.id));
  };

  const handleSubmit = async () => {
    if (!areAllQuestionsAnswered()) {
      alert('Please answer all questions before submitting!');
      return;
    }

    setError('');
    setSubmitting(true);
    
    try {
      // Prepare answers array with question_id and selected_index
      const answers = questions.map(q => ({
        question_id: q.id,
        selected_index: userAnswers[q.id] !== undefined ? userAnswers[q.id] : null
      }));

      console.log('Submitting exam with:', {
        attemptToken,
        answersCount: answers.length
      });

      // Make API request to submit answers
      const data = await apiRequest(`${API_ENDPOINTS.TAKE_EXAM}?action=submitAnswers`, {
        method: 'POST',
        body: JSON.stringify({
          attemptToken,
          answers
        })
      });

      console.log('Submission successful:', data);

      // Store results data
      const payload = data.data;
      setResultsData(payload);
      setShowResults(true);

      // Log if exam result was saved
      if (payload.examResultId) {
        console.log('Exam result saved with ID:', payload.examResultId);
      } else {
        console.log('Exam result not saved (may be guest user or mock exam)');
      }

    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to submit exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
                    navigate('/mock-exam');
                  }
                }}
                className="mr-2 sm:mr-4 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <div className="flex items-center">
                <FileQuestion className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 mr-1 sm:mr-2" />
                <h1 className="text-base sm:text-xl font-bold text-gray-900">Mock Exam</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-6">
              <div className="text-xs sm:text-sm">
                <span className="text-gray-600 hidden sm:inline">Progress: </span>
                <span className="font-semibold text-gray-900">
                  {Object.keys(userAnswers).length} / {questions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:sticky lg:top-24">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Questions</h3>
              <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-5 gap-2">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionJump(index)}
                    className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      index === currentQuestionIndex
                        ? 'bg-primary-600 text-white'
                        : userAnswers.hasOwnProperty(q.id)
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-primary-600"></div>
                  <span className="text-gray-600">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-green-100 border-2 border-green-300"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-gray-100"></div>
                  <span className="text-gray-600">Not Answered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Display */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8">
              {/* Question Header */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-xs sm:text-sm font-semibold text-gray-500">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${
                  currentQuestion.questionType === 'mcq'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {currentQuestion.questionType === 'mcq' ? 'MCQ' : 'Voice'}
                </span>
                {currentQuestion.category && (
                  <span className="px-2 sm:px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {currentQuestion.category}
                  </span>
                )}
                {currentQuestion.difficulty && (
                  <span className="px-2 sm:px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                    {currentQuestion.difficulty}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                {currentQuestion.questionText}
              </h2>

              {/* Question Image if present */}
              {currentQuestion.questionImage && (
                <div className="mb-4 sm:mb-6">
                  <img
                    src={currentQuestion.questionImage}
                    alt="Question visual"
                    className="rounded-lg border border-gray-200 max-w-full"
                  />
                </div>
              )}

              {/* Voice Player for Voice Questions */}
              {currentQuestion.questionType === 'voice' && currentQuestion.audioLink && (
                <div className="mb-4 sm:mb-6 bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <Music className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium text-purple-900">Audio Question</p>
                  </div>
                  <audio controls className="w-full">
                    <source src={currentQuestion.audioLink} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-2 sm:space-y-3">
                {currentQuestion.options && currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      userAnswers[currentQuestion.id] === index
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={userAnswers[currentQuestion.id] === index}
                      onChange={() => handleAnswerSelect(index)}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 focus:ring-primary-500 border-gray-300 flex-shrink-0"
                    />
                    <span className="ml-2 sm:ml-4 text-base sm:text-lg text-gray-900 font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <div className="ml-2 sm:ml-3 flex-1">
                      {option.image ? (
                        <img src={option.image} alt={`Option ${index}`} className="max-w-xs rounded" />
                      ) : (
                        <span className="text-sm sm:text-lg text-gray-700">{option.text}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 sm:pt-6 border-t">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0 || submitting}
                  className="btn-secondary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="text-sm sm:text-base">Previous</span>
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !areAllQuestionsAnswered()}
                    className={`btn-primary text-sm sm:text-base ${(submitting || !areAllQuestionsAnswered()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {submitting ? 'Submitting…' : 'Submit Exam'}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={submitting}
                    className="btn-primary flex items-center justify-center"
                  >
                    <span className="text-sm sm:text-base">Next</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Results Modal */}
      {showResults && resultsData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <div className={`mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 ${
                resultsData.summary.percentage >= 70 ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {resultsData.summary.percentage >= 70 ? (
                  <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
                ) : (
                  <FileQuestion className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-600" />
                )}
              </div>
              
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Exam Completed!
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Here are your results
              </p>

              {/* Success Message if result was saved */}
              {resultsData.examResultId && (
                <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
                  <p className="text-sm text-green-700">
                    ✓ Your exam result has been saved successfully!
                  </p>
                </div>
              )}
              {/* Info if result was NOT saved (likely guest or not a student) */}
              {!resultsData.examResultId && (
                <div className="mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    Result was not saved to your account. If you want your score to be recorded,
                    please sign in with a student account and submit again.
                  </p>
                </div>
              )}

              {/* Score Display */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-600 mb-2">
                  {resultsData.summary.percentage}%
                </div>
                <div className="text-base sm:text-lg text-gray-600">
                  Your Score
                </div>
              </div>

              {/* Detailed Results */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{resultsData.summary.total}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-green-600">{resultsData.summary.correct}</div>
                  <div className="text-xs sm:text-sm text-green-700">Correct</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-red-600">{resultsData.summary.incorrect}</div>
                  <div className="text-xs sm:text-sm text-red-700">Incorrect</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => navigate('/mock-exam')}
                  className="flex-1 btn-secondary text-sm sm:text-base"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="flex-1 btn-primary text-sm sm:text-base"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeExam;


 