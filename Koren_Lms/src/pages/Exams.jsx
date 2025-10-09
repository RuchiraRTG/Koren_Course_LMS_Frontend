import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Clock, FileText, Users, Award, CheckCircle } from 'lucide-react';

const Exams = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [exams, setExams] = useState([]);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);

  // Sample questions for selection (in real app, fetch from backend)
  const [availableQuestions] = useState([
    { id: 1, questionText: 'What is "안녕하세요"?', questionType: 'mcq', category: 'Greetings', difficulty: 'Beginner' },
    { id: 2, questionText: 'Translate "Good morning"', questionType: 'mcq', category: 'Greetings', difficulty: 'Beginner' },
    { id: 3, questionText: 'Listen and identify the word', questionType: 'voice', category: 'Listening', difficulty: 'Intermediate' },
    { id: 4, questionText: 'Which particle marks the subject?', questionType: 'mcq', category: 'Grammar', difficulty: 'Intermediate' },
  ]);

  // Sample students (in real app, fetch from backend)
  const [availableStudents] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', batch: 'Batch A' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', batch: 'Batch A' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', batch: 'Batch B' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', batch: 'Batch B' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', batch: 'Batch A' },
  ]);

  const [formData, setFormData] = useState({
    examName: '',
    examType: 'both', // 'mcq', 'voice', or 'both'
    duration: '30', // in minutes: 30, 60, 120
    numberOfQuestions: '20', // 20, 40, 60
    totalMarks: '',
    eligibilityType: 'batch', // 'batch' or 'individual'
    selectedBatch: '',
    selectedStudents: [],
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

  const handleStudentToggle = (studentId) => {
    setFormData(prev => {
      const isSelected = prev.selectedStudents.includes(studentId);
      return {
        ...prev,
        selectedStudents: isSelected
          ? prev.selectedStudents.filter(id => id !== studentId)
          : [...prev.selectedStudents, studentId]
      };
    });
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

  const handleSelectAllBatch = () => {
    if (formData.selectedBatch) {
      const batchStudents = availableStudents
        .filter(s => s.batch === formData.selectedBatch)
        .map(s => s.id);
      setFormData(prev => ({
        ...prev,
        selectedStudents: batchStudents
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (formData.eligibilityType === 'batch' && !formData.selectedBatch) {
      alert('Please select a batch');
      return;
    }

    if (formData.eligibilityType === 'individual' && formData.selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    if (formData.selectedQuestions.length === 0) {
      alert('Please select at least one question');
      return;
    }

    if (formData.selectedQuestions.length > parseInt(formData.numberOfQuestions)) {
      alert(`You can only select up to ${formData.numberOfQuestions} questions`);
      return;
    }

    if (editingExam) {
      setExams(exams.map(exam =>
        exam.id === editingExam.id
          ? { ...formData, id: exam.id }
          : exam
      ));
    } else {
      const newExam = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setExams([...exams, newExam]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      examName: '',
      examType: 'both',
      duration: '30',
      numberOfQuestions: '20',
      totalMarks: '',
      eligibilityType: 'batch',
      selectedBatch: '',
      selectedStudents: [],
      selectedQuestions: [],
      mcqCount: 0,
      voiceCount: 0,
      description: ''
    });
    setEditingExam(null);
    setShowAddModal(false);
    setShowQuestionSelector(false);
    setStudentSearchTerm('');
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({ ...exam });
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      setExams(exams.filter(exam => exam.id !== id));
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

  const getSelectedStudentNames = (exam) => {
    if (exam.eligibilityType === 'batch') {
      return `Batch: ${exam.selectedBatch}`;
    }
    const students = availableStudents.filter(s => exam.selectedStudents.includes(s.id));
    return students.map(s => s.name).join(', ');
  };

  const uniqueBatches = [...new Set(availableStudents.map(s => s.batch))];

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

      {/* Exams List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredExams.length === 0 ? (
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
                      {getDurationLabel(exam.duration)}
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
                    <div className="flex items-start gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-700">Eligible Students: </span>
                        <span className="text-gray-600">{getSelectedStudentNames(exam)}</span>
                      </div>
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
                        onChange={handleChange}
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

                    {/* Student Eligibility */}
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Student Eligibility *
                      </label>
                      
                      <div className="space-y-3">
                        {/* Eligibility Type */}
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="eligibilityType"
                              value="batch"
                              checked={formData.eligibilityType === 'batch'}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <span className="text-sm text-gray-700">By Batch</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="eligibilityType"
                              value="individual"
                              checked={formData.eligibilityType === 'individual'}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <span className="text-sm text-gray-700">Individual Students</span>
                          </label>
                        </div>

                        {/* Batch Selection */}
                        {formData.eligibilityType === 'batch' && (
                          <div>
                            <select
                              name="selectedBatch"
                              value={formData.selectedBatch}
                              onChange={(e) => {
                                handleChange(e);
                                setFormData(prev => ({ ...prev, selectedStudents: [] }));
                              }}
                              className="input-field"
                              required
                            >
                              <option value="">Select Batch</option>
                              {uniqueBatches.map((batch) => (
                                <option key={batch} value={batch}>{batch}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Individual Student Selection */}
                        {formData.eligibilityType === 'individual' && (
                          <div>
                            {/* Student Search */}
                            <div className="mb-3">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search students by name or email..."
                                  value={studentSearchTerm}
                                  onChange={(e) => setStudentSearchTerm(e.target.value)}
                                  className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                            </div>
                            
                            {/* Student List */}
                            <div className="border rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
                              <div className="space-y-2">
                                {availableStudents
                                  .filter(student => {
                                    const searchLower = studentSearchTerm.toLowerCase();
                                    return student.name.toLowerCase().includes(searchLower) ||
                                           student.email.toLowerCase().includes(searchLower);
                                  })
                                  .map((student) => (
                                  <label
                                    key={student.id}
                                    className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200 hover:border-primary-300 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={formData.selectedStudents.includes(student.id)}
                                      onChange={() => handleStudentToggle(student.id)}
                                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                      <p className="text-xs text-gray-500">{student.email} • {student.batch}</p>
                                    </div>
                                  </label>
                                ))}
                                {availableStudents.filter(student => {
                                  const searchLower = studentSearchTerm.toLowerCase();
                                  return student.name.toLowerCase().includes(searchLower) ||
                                         student.email.toLowerCase().includes(searchLower);
                                }).length === 0 && (
                                  <p className="text-sm text-gray-500 text-center py-4">
                                    No students found
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Selected Count */}
                        {formData.eligibilityType === 'batch' && formData.selectedBatch && (
                          <p className="text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 inline text-green-600 mr-1" />
                            {availableStudents.filter(s => s.batch === formData.selectedBatch).length} students in {formData.selectedBatch}
                          </p>
                        )}
                        {formData.eligibilityType === 'individual' && formData.selectedStudents.length > 0 && (
                          <p className="text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 inline text-green-600 mr-1" />
                            {formData.selectedStudents.length} student(s) selected
                          </p>
                        )}
                      </div>
                    </div>
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
                      className="btn-primary"
                    >
                      {editingExam ? 'Update Exam' : 'Create Exam'}
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
