import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Clock, Image as ImageIcon, Music, Loader, AlertCircle } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import AudioUpload from '../components/AudioUpload';

const Questions = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'mcq', // 'mcq' or 'voice'
    questionFormat: 'normal', // 'normal' or 'image' (for MCQ)
    questionImage: null, // Image for the question itself
    answerType: 'single', // 'single' or 'multiple'
    options: [
      { text: '', image: null },
      { text: '', image: null },
      { text: '', image: null },
      { text: '', image: null }
    ],
    correctAnswers: [], // Array of indices for multiple choice
    audioLink: '', // For voice questions
    timeLimit: 30, // Time in seconds
    difficulty: 'Beginner',
    category: ''
  });

  const [editingQuestion, setEditingQuestion] = useState(null);

  // API Base URL - Update this to match your backend location
  // Common options:
  // - 'http://localhost/questions.php' (XAMPP/WAMP in htdocs root)
  // - 'http://localhost/api/questions.php' (if in api folder)
  // - 'http://localhost:8000/questions.php' (if using PHP built-in server)
  // - 'http://localhost:80/korean-lms/questions.php' (if in subfolder)
  const API_URL = 'http://localhost/questions.php';

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Fetch all questions from backend
  const fetchQuestions = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      console.log('Fetching questions from:', `${API_URL}?action=list`);
      
      const response = await fetch(`${API_URL}?action=list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (data.success) {
        setQuestions(data.data || []);
      } else {
        setApiError(data.message || 'Failed to fetch questions');
      }
    } catch (error) {
      console.error('Fetch questions error:', error);
      
      // More specific error messages
      if (error.message.includes('Failed to fetch')) {
        setApiError(`Cannot connect to API at ${API_URL}. Make sure:\n1. Your backend server is running\n2. CORS is enabled in questions.php\n3. The API URL is correct`);
      } else if (error.message.includes('Unexpected token')) {
        setApiError('Invalid response from server. Check if questions.php is returning valid JSON.');
      } else {
        setApiError(`Network error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionTextChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], text: value };
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleOptionImageChange = (index, image) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], image: image };
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleCorrectAnswerToggle = (index) => {
    if (formData.answerType === 'single') {
      setFormData(prev => ({
        ...prev,
        correctAnswers: [index]
      }));
    } else {
      // Multiple choice
      setFormData(prev => {
        const newCorrectAnswers = prev.correctAnswers.includes(index)
          ? prev.correctAnswers.filter(i => i !== index)
          : [...prev.correctAnswers, index];
        return {
          ...prev,
          correctAnswers: newCorrectAnswers
        };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear messages
    setApiError('');
    setSuccessMessage('');
    
    // Validation
    if (formData.questionType === 'mcq' && formData.correctAnswers.length === 0) {
      setApiError('Please select at least one correct answer');
      return;
    }

    if (formData.questionType === 'voice' && !formData.audioLink) {
      setApiError('Please provide an audio link for voice questions');
      return;
    }

    if (formData.questionType === 'voice' && (formData.timeLimit < 5 || formData.timeLimit > 300)) {
      setApiError('Time limit must be between 5 and 300 seconds for voice questions');
      return;
    }

    // Validate that all options have text
    const hasEmptyOption = formData.options.some(option => !option.text.trim());
    if (hasEmptyOption) {
      setApiError('All 4 options must have text');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let response;
      const payload = {
        questionText: formData.questionText,
        questionType: formData.questionType,
        questionFormat: formData.questionFormat || 'normal',
        questionImage: formData.questionImage || null,
        answerType: formData.answerType,
        options: formData.options,
        correctAnswers: formData.correctAnswers,
        audioLink: formData.audioLink || null,
        timeLimit: formData.questionType === 'voice' ? parseInt(formData.timeLimit) : 0,
        difficulty: formData.difficulty,
        category: formData.category
      };

      if (editingQuestion) {
        // Update existing question
        response = await fetch(API_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...payload,
            id: editingQuestion.id
          })
        });
      } else {
        // Create new question
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(data.message || (editingQuestion ? 'Question updated successfully' : 'Question created successfully'));
        
        // Refresh questions list
        await fetchQuestions();
        
        // Reset form and close modal after a short delay
        setTimeout(() => {
          resetForm();
        }, 1500);
      } else {
        setApiError(data.message || 'Failed to save question');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      questionType: 'mcq',
      questionFormat: 'normal',
      questionImage: null,
      answerType: 'single',
      options: [
        { text: '', image: null },
        { text: '', image: null },
        { text: '', image: null },
        { text: '', image: null }
      ],
      correctAnswers: [],
      audioLink: '',
      timeLimit: 30,
      difficulty: 'Beginner',
      category: ''
    });
    setEditingQuestion(null);
    setShowAddModal(false);
    setApiError('');
    setSuccessMessage('');
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({ ...question });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setApiError('');
      try {
        const response = await fetch(`${API_URL}?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          setSuccessMessage('Question deleted successfully');
          // Refresh questions list
          await fetchQuestions();
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        } else {
          setApiError(data.message || 'Failed to delete question');
        }
      } catch (error) {
        console.error('Delete error:', error);
        setApiError('Network error. Failed to delete question.');
      }
    }
  };

  const filteredQuestions = questions.filter(question =>
    question.questionText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.difficulty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Question Bank</h2>
        <p className="text-gray-600">Create and manage quiz questions (MCQ & Voice) for Korean learning</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Question
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm font-medium text-green-800">{successMessage}</p>
        </div>
      )}

      {/* API Error Message */}
      {apiError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-800 mb-1">Connection Error</h3>
              <div className="text-sm text-red-700 whitespace-pre-line">{apiError}</div>
              <button
                onClick={fetchQuestions}
                className="mt-3 text-sm text-red-800 hover:text-red-900 font-medium underline"
              >
                🔄 Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Grid */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Loader className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading questions...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            No questions found. Click "Add Question" to create one.
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-primary-100 text-primary-800">
                      {question.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      question.questionType === 'mcq' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {question.questionType === 'mcq' ? 'MCQ' : 'Voice Question'}
                    </span>
                    {question.questionType === 'mcq' && question.questionFormat === 'image' && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                        <ImageIcon className="h-3 w-3 inline mr-1" />
                        Image Question
                      </span>
                    )}
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">
                      {question.answerType === 'single' ? 'Single Choice' : 'Multiple Choice'}
                    </span>
                    {question.questionType === 'voice' && question.timeLimit && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
                        {question.timeLimit}s
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{question.questionText}</h3>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(question)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Question Image */}
              {question.questionImage && (
                <div className="mb-4">
                  <img
                    src={question.questionImage}
                    alt="Question"
                    className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* Voice Question Audio */}
              {question.questionType === 'voice' && question.audioLink && (
                <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center gap-3">
                  <Music className="h-8 w-8 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Audio Link</p>
                    <a 
                      href={question.audioLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:underline truncate block"
                    >
                      {question.audioLink}
                    </a>
                  </div>
                </div>
              )}

              {/* MCQ Options */}
              {question.questionType === 'mcq' && question.options && (
                <div className="mt-4 space-y-2">
                  {question.options.map((option, index) => {
                    const isCorrect = question.correctAnswers?.includes(index);
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          isCorrect
                            ? 'bg-green-50 border-green-300'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-700">{String.fromCharCode(65 + index)}.</span>
                          {option.image && (
                            <img 
                              src={option.image} 
                              alt={`Option ${index + 1}`}
                              className="h-16 w-16 object-cover rounded"
                            />
                          )}
                          <span className="text-gray-900 flex-1">{option.text}</span>
                          {isCorrect && (
                            <span className="ml-auto text-green-600 text-sm font-medium">✓ Correct</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Voice Question Options */}
              {question.questionType === 'voice' && question.options && (
                <div className="mt-4 space-y-2">
                  {question.options.map((option, index) => {
                    const isCorrect = question.correctAnswers?.includes(index);
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          isCorrect
                            ? 'bg-green-50 border-green-300'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-700">{String.fromCharCode(65 + index)}.</span>
                          {option.image && (
                            <img 
                              src={option.image} 
                              alt={`Option ${index + 1}`}
                              className="h-16 w-16 object-cover rounded"
                            />
                          )}
                          <span className="text-gray-900 flex-1">{option.text}</span>
                          {isCorrect && (
                            <span className="ml-auto text-green-600 text-sm font-medium">✓ Correct</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={resetForm}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                  </h3>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Modal Success Message */}
                {successMessage && (
                  <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                  </div>
                )}

                {/* Modal Error Message */}
                {apiError && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-800">{apiError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    
                    {/* Question Type Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question Type *
                        </label>
                        <select
                          name="questionType"
                          value={formData.questionType}
                          onChange={handleChange}
                          className="input-field"
                          required
                        >
                          <option value="mcq">MCQ (Multiple Choice Question)</option>
                          <option value="voice">Voice Question</option>
                        </select>
                      </div>

                      {formData.questionType === 'mcq' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question Format *
                          </label>
                          <select
                            name="questionFormat"
                            value={formData.questionFormat}
                            onChange={handleChange}
                            className="input-field"
                            required
                          >
                            <option value="normal">Normal (Text)</option>
                            <option value="image">Image Question</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Question Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Description *
                      </label>
                      <textarea
                        name="questionText"
                        value={formData.questionText}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="input-field"
                        placeholder="Enter your question"
                      />
                    </div>

                    {/* Question Image (for Image MCQ) */}
                    {formData.questionType === 'mcq' && formData.questionFormat === 'image' && (
                      <ImageUpload
                        value={formData.questionImage}
                        onChange={(image) => setFormData(prev => ({ ...prev, questionImage: image }))}
                        label="Question Image *"
                      />
                    )}

                    {/* Voice Link (for Voice Questions) */}
                    {formData.questionType === 'voice' && (
                      <AudioUpload
                        value={formData.audioLink}
                        onChange={(link) => setFormData(prev => ({ ...prev, audioLink: link }))}
                        label="Voice/Audio Link *"
                      />
                    )}

                    {/* Answer Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Answer Type *
                        </label>
                        <select
                          name="answerType"
                          value={formData.answerType}
                          onChange={handleChange}
                          className="input-field"
                          required
                        >
                          <option value="single">Single Choice</option>
                          <option value="multiple">Multiple Choice</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Difficulty *
                        </label>
                        <select
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleChange}
                          className="input-field"
                          required
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="e.g., Grammar"
                        />
                      </div>
                    </div>

                    {/* Time Limit - Only for Voice Questions */}
                    {formData.questionType === 'voice' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time Limit (seconds) *
                        </label>
                        <input
                          type="number"
                          name="timeLimit"
                          value={formData.timeLimit}
                          onChange={handleChange}
                          required
                          min="5"
                          max="300"
                          className="input-field"
                          placeholder="30"
                        />
                        <p className="text-xs text-gray-500 mt-1">Set how long students have to answer this question (5-300 seconds)</p>
                      </div>
                    )}

                    {/* Answer Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer Options (4 required) *
                      </label>
                      <div className="space-y-4">
                        {formData.options.map((option, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Option {String.fromCharCode(65 + index)}
                              </span>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type={formData.answerType === 'single' ? 'radio' : 'checkbox'}
                                  name="correctAnswer"
                                  checked={formData.correctAnswers.includes(index)}
                                  onChange={() => handleCorrectAnswerToggle(index)}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-600">Mark as correct</span>
                              </label>
                            </div>

                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => handleOptionTextChange(index, e.target.value)}
                              required
                              className="input-field mb-2"
                              placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                            />

                            {/* Option Image Upload */}
                            <div className="mt-2">
                              <ImageUpload
                                value={option.image}
                                onChange={(image) => handleOptionImageChange(index, image)}
                                label={`Option ${String.fromCharCode(65 + index)} Image (Optional)`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {formData.answerType === 'single' 
                          ? 'Select ONE correct answer' 
                          : 'Select ONE or MORE correct answers'}
                      </p>
                    </div>

                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-secondary"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="animate-spin h-4 w-4 mr-2" />
                          {editingQuestion ? 'Updating...' : 'Saving...'}
                        </>
                      ) : (
                        editingQuestion ? 'Update Question' : 'Save Question'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;