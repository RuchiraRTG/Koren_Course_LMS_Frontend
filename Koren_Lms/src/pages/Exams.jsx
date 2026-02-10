import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Clock, FileText, Award, Loader, AlertCircle } from 'lucide-react';

const Exams = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [exams, setExams] = useState([]);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Backend API base (adjust if your PHP lives elsewhere)
  const API_URL = 'http://localhost/exam.php';

  // Fetch exams and questions on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      setApiError('');
      try {
        await Promise.all([fetchExams(), fetchQuestions()]);
      } catch (e) {
        // errors handled in functions
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch(`${API_URL}?action=all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to fetch exams');

      // Map backend snake_case to frontend camelCase
      const mapped = (data.data || []).map((e) => ({
        id: e.id,
        examName: e.exam_name,
        description: e.description || '',
        examType: e.exam_type,
        duration: String(e.duration),
        numberOfQuestions: String(e.number_of_questions),
        totalMarks: String(e.total_marks),
        selectedQuestions: e.assigned_questions || [],
        mcqCount: e.mcq_count ?? 0,
        voiceCount: e.voice_count ?? 0,
        createdAt: e.created_at,
      }));
      setExams(mapped);
    } catch (error) {
      setApiError(
        `Cannot load exams from ${API_URL}. ${error.message}. Ensure the PHP server is running and CORS headers are enabled.`
      );
    }
  };

  const fetchQuestions = async () => {
    try {
      // Optionally filter by examType later; here we get all and filter client-side
      const res = await fetch(`${API_URL}?action=questions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to fetch questions');
      // Normalize question fields to what this UI expects
      const qs = (data.data || []).map((q) => ({
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType, // 'mcq' | 'voice'
        category: q.category || '',
        difficulty: q.difficulty || '',
      }));
      setAvailableQuestions(qs);
    } catch (error) {
      setApiError(
        `Cannot load questions from ${API_URL}. ${error.message}.`
      );
    }
  };

  const [formData, setFormData] = useState({
    examName: '',
    examType: 'both', // 'mcq', 'voice', or 'both'
    duration: '30', // in minutes: 30, 60, 120
    numberOfQuestions: '20', // 20, 40, 60
    totalMarks: '',
    selectedQuestions: [],
    mcqCount: 0,
    voiceCount: 0,
    description: ''
  });

  const [editingExam, setEditingExam] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionToggle = (questionId) => {
    setFormData(prev => {
      const isSelected = prev.selectedQuestions.includes(questionId);
      const newSelected = isSelected
        ? prev.selectedQuestions.filter(id => id !== questionId)
        : [...prev.selectedQuestions, questionId];

      // Count MCQ and Voice questions
      const mcqCount = newSelected.filter(id => {
        const q = availableQuestions.find(q => q.id === id);
        return q?.questionType === 'mcq';
      }).length;

      const voiceCount = newSelected.filter(id => {
        const q = availableQuestions.find(q => q.id === id);
        return q?.questionType === 'voice';
      }).length;

      return {
        ...prev,
        selectedQuestions: newSelected,
        mcqCount,
        voiceCount
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    // Basic validation
    if (formData.selectedQuestions.length === 0) {
      setApiError('Please select at least one question');
      return;
    }
    if (formData.selectedQuestions.length > parseInt(formData.numberOfQuestions)) {
      setApiError(`You can only select up to ${formData.numberOfQuestions} questions`);
      return;
    }

    // Build payload compatible with PHP API
    const payload = {
      examName: formData.examName,
      description: formData.description || null,
      examType: formData.examType,
      duration: parseInt(formData.duration),
      numberOfQuestions: parseInt(formData.numberOfQuestions),
      totalMarks: parseInt(formData.totalMarks),
      // We don't enforce eligibility in UI; pass a neutral batch label to satisfy backend validation
      eligibilityType: 'batch',
      selectedBatch: 'Practice',
      selectedStudents: [],
      selectedQuestions: formData.selectedQuestions,
      mcqCount: formData.mcqCount,
      voiceCount: formData.voiceCount,
    };

    setIsSubmitting(true);
    try {
      let res;
      if (editingExam) {
        res = await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingExam.id }),
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to save exam');

      setSuccessMessage(data.message || (editingExam ? 'Exam updated successfully' : 'Exam created successfully'));
      await fetchExams();
      setTimeout(() => {
        resetForm();
      }, 1000);
    } catch (error) {
      setApiError(error.message || 'Failed to save exam');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      examName: '',
      examType: 'both',
      duration: '30',
      numberOfQuestions: '20',
      totalMarks: '',
      selectedQuestions: [],
      mcqCount: 0,
      voiceCount: 0,
      description: ''
    });
    setEditingExam(null);
    setShowAddModal(false);
    setShowQuestionSelector(false);
    setApiError('');
    setSuccessMessage('');
  };

  const handleEdit = (exam) => {
    // exam already mapped to camelCase fields
    setEditingExam(exam);
    setFormData({
      examName: exam.examName,
      examType: exam.examType,
      duration: String(exam.duration),
      numberOfQuestions: String(exam.numberOfQuestions),
      totalMarks: String(exam.totalMarks),
      selectedQuestions: exam.selectedQuestions || [],
      mcqCount: exam.mcqCount || 0,
      voiceCount: exam.voiceCount || 0,
      description: exam.description || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    setApiError('');
    setSuccessMessage('');
    try {
      const res = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete exam');
      setSuccessMessage('Exam deleted successfully');
      await fetchExams();
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      setApiError(error.message || 'Failed to delete exam');
    }
  };

  const filteredExams = exams.filter(exam =>
    exam.examName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDurationLabel = (minutes) => {
    if (minutes === '30') return '30 Minutes';
    if (minutes === '60') return '1 Hour';
    if (minutes === '120') return '2 Hours';
    return minutes + ' Minutes';
  };

  const getExamTypeLabel = (type) => {
    if (type === 'mcq') return 'MCQ Only';
    if (type === 'voice') return 'Voice Only';
    return 'MCQ & Voice';
  };

  // No eligibility display needed; practice exam available to all

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Management</h2>
        <p className="text-gray-600">Create and manage exams with MCQ and Voice-based questions</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search exams..."
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
          Create Exam
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
            </div>
          </div>
        </div>
      )}

      {/* Exams List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Loader className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading exams...</p>
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            No exams found. Click "Create Exam" to add one.
          </div>
        ) : (
          filteredExams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.examName}</h3>
                  {exam.description && (
                    <p className="text-gray-600 text-sm mb-3">{exam.description}</p>
                  )}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`px-3 py-1 text-sm font-semibold rounded flex items-center gap-1 ${
                      exam.examType === 'mcq' ? 'bg-blue-100 text-blue-800' : 
                      exam.examType === 'voice' ? 'bg-purple-100 text-purple-800' : 
                      'bg-teal-100 text-teal-800'
                    }`}>
                      {getExamTypeLabel(exam.examType)}
                    </span>
                    <span className="px-3 py-1 text-sm font-semibold rounded bg-blue-100 text-blue-800 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {getDurationLabel(String(exam.duration))}
                    </span>
                    <span className="px-3 py-1 text-sm font-semibold rounded bg-green-100 text-green-800 flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {exam.numberOfQuestions} Questions
                    </span>
                    <span className="px-3 py-1 text-sm font-semibold rounded bg-purple-100 text-purple-800 flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      {exam.totalMarks} Marks
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Question Types:</span>
                      <span className="text-gray-600">{exam.mcqCount} MCQ, {exam.voiceCount} Voice</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(exam)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={resetForm}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingExam ? 'Edit Exam' : 'Create New Exam'}
                  </h3>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    {/* Exam Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exam Name *
                      </label>
                      <input
                        type="text"
                        name="examName"
                        value={formData.examName}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="e.g., Korean Language Test - Level 1"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="2"
                        className="input-field"
                        placeholder="Brief description of the exam"
                      />
                    </div>

                    {/* Exam Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exam Type *
                      </label>
                      <select
                        name="examType"
                        value={formData.examType}
                        onChange={(e) => {
                          handleChange(e);
                          // When exam type changes, recalc counts and ensure selectedQuestions still valid
                          setFormData(prev => {
                            const filteredSelected = (prev.selectedQuestions || []).filter((id) => {
                              const q = availableQuestions.find((qq) => qq.id === id);
                              if (!q) return false;
                              if (e.target.value === 'mcq') return q.questionType === 'mcq';
                              if (e.target.value === 'voice') return q.questionType === 'voice';
                              return true;
                            });
                            const mcqCount = filteredSelected.filter((id) => {
                              const q = availableQuestions.find((qq) => qq.id === id);
                              return q?.questionType === 'mcq';
                            }).length;
                            const voiceCount = filteredSelected.filter((id) => {
                              const q = availableQuestions.find((qq) => qq.id === id);
                              return q?.questionType === 'voice';
                            }).length;
                            return { ...prev, selectedQuestions: filteredSelected, mcqCount, voiceCount };
                          });
                        }}
                        className="input-field"
                        required
                      >
                        <option value="both">MCQ & Voice Questions</option>
                        <option value="mcq">MCQ Questions Only</option>
                        <option value="voice">Voice Questions Only</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Select the type of questions for this exam
                      </p>
                    </div>

                    {/* Exam Configuration */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration *
                        </label>
                        <select
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          className="input-field"
                          required
                        >
                          <option value="30">30 Minutes</option>
                          <option value="60">1 Hour</option>
                          <option value="120">2 Hours</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Questions *
                        </label>
                        <select
                          name="numberOfQuestions"
                          value={formData.numberOfQuestions}
                          onChange={handleChange}
                          className="input-field"
                          required
                        >
                          <option value="20">20 Questions</option>
                          <option value="40">40 Questions</option>
                          <option value="60">60 Questions</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Marks *
                        </label>
                        <input
                          type="number"
                          name="totalMarks"
                          value={formData.totalMarks}
                          onChange={handleChange}
                          required
                          min="1"
                          className="input-field"
                          placeholder="e.g., 100"
                        />
                      </div>
                    </div>

                    {/* Question Selection */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Select Questions *
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Selected: {formData.selectedQuestions.length} / {formData.numberOfQuestions} 
                            {formData.mcqCount > 0 || formData.voiceCount > 0 ? (
                              <span className="ml-2">
                                ({formData.mcqCount} MCQ, {formData.voiceCount} Voice)
                              </span>
                            ) : null}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowQuestionSelector(!showQuestionSelector)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {showQuestionSelector ? 'Hide Questions' : 'Show Questions'}
                        </button>
                      </div>

                      {showQuestionSelector && (
                        <div className="border rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
                          <div className="space-y-2">
                            {availableQuestions
                              .filter(q => {
                                // Filter by exam type
                                if (formData.examType === 'mcq') return q.questionType === 'mcq';
                                if (formData.examType === 'voice') return q.questionType === 'voice';
                                return true; // 'both' shows all
                              })
                              .map((question) => (
                              <label
                                key={question.id}
                                className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200 hover:border-primary-300 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.selectedQuestions.includes(question.id)}
                                  onChange={() => handleQuestionToggle(question.id)}
                                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                  disabled={
                                    !formData.selectedQuestions.includes(question.id) &&
                                    formData.selectedQuestions.length >= parseInt(formData.numberOfQuestions)
                                  }
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{question.questionText}</p>
                                  <div className="flex gap-2 mt-1">
                                    <span className={`px-2 py-0.5 text-xs rounded ${
                                      question.questionType === 'mcq' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                    }`}>
                                      {question.questionType === 'mcq' ? 'MCQ' : 'Voice'}
                                    </span>
                                    <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
                                      {question.category}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* No Student Eligibility: Exams are practice and available to all */}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary disabled:opacity-60"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (editingExam ? 'Updating...' : 'Creating...') : (editingExam ? 'Update Exam' : 'Create Exam')}
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

export default Exams;
