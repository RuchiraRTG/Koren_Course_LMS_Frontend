import { Plus, Search, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// Backend endpoint for the provided student.php
const API_BASE = 'http://localhost/student.php';

// simple debounce hook (defined at module scope)
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const Students = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    batchNumber: '',
    email: '',
    phone: '',
    nicNumber: ''
  });

  const [editingStudent, setEditingStudent] = useState(null);

  // Debounce search term to limit requests
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Load students from backend when search changes
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      setListError('');
      try {
        const params = new URLSearchParams({ action: 'list' });
        if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
        const res = await fetch(`${API_BASE}?${params.toString()}`, {
          method: 'GET',
          signal: controller.signal,
        });
        const data = await safeJson(res);
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || 'Failed to load students');
        }
        setStudents(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('List load error:', err);
          setListError(err.message || 'Error loading students');
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [debouncedSearch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    setInfoMessage('');
    setIsSaving(true);

    try {
      const isEdit = Boolean(editingStudent?.id);
      const payload = isEdit ? { ...formData, id: editingStudent.id } : { ...formData };
      const res = await fetch(API_BASE, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || (isEdit ? 'Failed to update student' : 'Failed to create student'));
      }

      setInfoMessage(isEdit ? 'Student updated successfully' : 'Student created successfully');
      handleCloseModal();
      // Refresh list
      await refreshList();
    } catch (err) {
      console.error('Save error:', err);
      setSaveError(err.message || 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    // Only map editable fields to the form
    setFormData({
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      batchNumber: student.batchNumber || '',
      email: student.email || '',
      phone: student.phone || '',
      nicNumber: student.nicNumber || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    setDeletingId(id);
    setInfoMessage('');
    try {
      let res = await fetch(`${API_BASE}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      let data = await safeJson(res);
      if (!res.ok || !data?.success) {
        // Fallback for servers that don't allow DELETE: use POST?action=delete
        const res2 = await fetch(`${API_BASE}?action=delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        const data2 = await safeJson(res2);
        if (!res2.ok || !data2?.success) {
          throw new Error(data2?.message || data?.message || 'Failed to delete student');
        }
      }
      setInfoMessage('Student deleted successfully');
      await refreshList();
    } catch (err) {
      console.error('Delete error:', err);
      setListError(err.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      batchNumber: '',
      email: '',
      phone: '',
      nicNumber: ''
    });
  };

  const filteredStudents = useMemo(() => students, [students]);

  async function refreshList() {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ action: 'list' });
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
      const res = await fetch(`${API_BASE}?${params.toString()}`);
      const data = await safeJson(res);
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Failed to reload');
      setStudents(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Refresh error:', err);
      setListError(err.message || 'Error refreshing');
    } finally {
      setIsLoading(false);
    }
  }

  async function safeJson(res) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Management</h2>
        <p className="text-gray-600">Manage student information and enrollments</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
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
          Add Student
        </button>
      </div>

      {/* Messages */}
      {infoMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-3 text-green-800 text-sm">
          {infoMessage}
        </div>
      )}
      {listError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm">
          {listError}
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Info
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="inline h-5 w-5 mr-2 animate-spin" /> Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{student.nicNumber}</div>
                      </div>
                    </td>
                     
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {student.batchNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                      <div className="text-sm text-gray-500">{student.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className={`text-red-600 hover:text-red-900 ${deletingId === student.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={deletingId === student.id}
                        title="Delete"
                      >
                        {deletingId === student.id ? (
                          <Loader2 className="h-5 w-5 inline animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5 inline" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseModal}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                  </h3>
                  <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {saveError && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm">
                    {saveError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter first name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter last name"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch Number
                      </label>
                      <input
                        type="text"
                        name="batchNumber"
                        value={formData.batchNumber}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="e.g., BATCH-2024-01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIC Number
                      </label>
                      <input
                        type="text"
                        name="nicNumber"
                        value={formData.nicNumber}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter NIC number"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="btn-secondary"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`btn-primary inline-flex items-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={isSaving}
                    >
                      {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {editingStudent ? 'Update Student' : 'Add Student'}
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

export default Students;