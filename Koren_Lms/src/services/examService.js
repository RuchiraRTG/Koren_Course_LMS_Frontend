/**
 * Exam Service
 * Handles all exam-related API calls
 */

import { API_ENDPOINTS, apiRequest } from '../config/api';

/**
 * Start a new exam session
 * @param {string} examType - Type of exam ('mcq', 'voice', 'both')
 * @param {number} numberOfQuestions - Number of questions to fetch
 * @param {string} category - Optional category filter
 * @returns {Promise} Exam data with questions and attemptToken
 */
export const startExam = async (examType, numberOfQuestions, category = null) => {
  try {
    const params = new URLSearchParams({
      action: 'startExam',
      examType,
      numberOfQuestions: numberOfQuestions.toString(),
    });

    if (category) {
      params.append('category', category);
    }

    const data = await apiRequest(`${API_ENDPOINTS.TAKE_EXAM}?${params.toString()}`, {
      method: 'POST',
    });

    return data.data;
  } catch (error) {
    console.error('Error starting exam:', error);
    throw error;
  }
};

/**
 * Fetch exam questions
 * @param {string} examType - Type of exam ('mcq', 'voice', 'both')
 * @param {number} numberOfQuestions - Number of questions to fetch
 * @param {string} category - Optional category filter
 * @returns {Promise} Questions array
 */
export const fetchExamQuestions = async (examType, numberOfQuestions, category = null) => {
  try {
    const params = new URLSearchParams({
      action: 'fetchQuestions',
      examType,
      numberOfQuestions: numberOfQuestions.toString(),
    });

    if (category) {
      params.append('category', category);
    }

    const data = await apiRequest(`${API_ENDPOINTS.TAKE_EXAM}?${params.toString()}`, {
      method: 'GET',
    });

    return data.data.questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

/**
 * Submit exam answers
 * @param {string} attemptToken - Unique token for this exam attempt
 * @param {Array} answers - Array of answer objects {question_id, selected_index}
 * @returns {Promise} Results data with summary and details
 */
export const submitExamAnswers = async (attemptToken, answers) => {
  try {
    const data = await apiRequest(`${API_ENDPOINTS.TAKE_EXAM}?action=submitAnswers`, {
      method: 'POST',
      body: JSON.stringify({
        attemptToken,
        answers,
      }),
    });

    return data.data;
  } catch (error) {
    console.error('Error submitting answers:', error);
    throw error;
  }
};

/**
 * Validate if all questions are answered
 * @param {Array} questions - Array of question objects
 * @param {Object} userAnswers - Object mapping question IDs to selected indices
 * @returns {boolean} True if all questions are answered
 */
export const validateAllQuestionsAnswered = (questions, userAnswers) => {
  return questions.every(q => userAnswers.hasOwnProperty(q.id));
};

/**
 * Format answers for submission
 * @param {Array} questions - Array of question objects
 * @param {Object} userAnswers - Object mapping question IDs to selected indices
 * @returns {Array} Formatted answers array
 */
export const formatAnswersForSubmission = (questions, userAnswers) => {
  return questions.map(q => ({
    question_id: q.id,
    selected_index: userAnswers[q.id] !== undefined ? userAnswers[q.id] : null,
  }));
};

/**
 * Calculate progress percentage
 * @param {number} answered - Number of answered questions
 * @param {number} total - Total number of questions
 * @returns {number} Progress percentage
 */
export const calculateProgress = (answered, total) => {
  if (total === 0) return 0;
  return Math.round((answered / total) * 100);
};

/**
 * Get performance message based on percentage
 * @param {number} percentage - Score percentage
 * @returns {Object} Message object with text and color
 */
export const getPerformanceMessage = (percentage) => {
  if (percentage >= 90) {
    return {
      text: 'Excellent! Outstanding performance! 🎉',
      color: 'green',
      emoji: '🎉',
    };
  } else if (percentage >= 80) {
    return {
      text: 'Great job! Very good performance! 👏',
      color: 'green',
      emoji: '👏',
    };
  } else if (percentage >= 70) {
    return {
      text: 'Good work! You passed! ✓',
      color: 'blue',
      emoji: '✓',
    };
  } else if (percentage >= 60) {
    return {
      text: 'Fair performance. Keep practicing! 📚',
      color: 'yellow',
      emoji: '📚',
    };
  } else {
    return {
      text: 'Needs improvement. Don\'t give up! 💪',
      color: 'red',
      emoji: '💪',
    };
  }
};

/**
 * Get question type label
 * @param {string} type - Question type
 * @returns {string} Human-readable label
 */
export const getQuestionTypeLabel = (type) => {
  const labels = {
    mcq: 'Multiple Choice',
    voice: 'Audio Question',
    both: 'Mixed Questions',
  };
  return labels[type] || type;
};

/**
 * Get difficulty color
 * @param {string} difficulty - Difficulty level
 * @returns {string} Tailwind color class
 */
export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };
  return colors[difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

/**
 * Format time duration
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTimeDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Export exam results as JSON (for download)
 * @param {Object} resultsData - Exam results data
 * @param {string} examType - Type of exam
 * @returns {string} JSON string
 */
export const exportResultsAsJSON = (resultsData, examType) => {
  const exportData = {
    examType,
    timestamp: new Date().toISOString(),
    summary: resultsData.summary,
    attemptToken: resultsData.attemptToken,
    examResultId: resultsData.examResultId,
  };
  
  return JSON.stringify(exportData, null, 2);
};

/**
 * Download results as file
 * @param {Object} resultsData - Exam results data
 * @param {string} examType - Type of exam
 */
export const downloadResults = (resultsData, examType) => {
  const jsonString = exportResultsAsJSON(resultsData, examType);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `exam-results-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default {
  startExam,
  fetchExamQuestions,
  submitExamAnswers,
  validateAllQuestionsAnswered,
  formatAnswersForSubmission,
  calculateProgress,
  getPerformanceMessage,
  getQuestionTypeLabel,
  getDifficultyColor,
  formatTimeDuration,
  exportResultsAsJSON,
  downloadResults,
};
