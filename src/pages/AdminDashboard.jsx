import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MarkdownEditor from '../components/MarkdownEditor';
import apiService from '../services/api';
import { ArrowLeft, LogOut, BookOpen } from 'lucide-react';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editId) {
      fetchNoteForEdit(editId);
    }
  }, [editId]);

  const fetchNoteForEdit = async (id) => {
    setLoading(true);
    try {
      const response = await apiService.getNoteById(id);
      if (response.success) {
        setEditingNote(response.data);
      }
    } catch (err) {
      alert('Failed to load notebook for editing');
      console.error('Error fetching note:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (noteData) => {
    try {
      if (editingNote) {
        // Update existing note
        await apiService.updateNote(editingNote.id, noteData);
        alert('✅ Notebook updated successfully!');
      } else {
        // Create new note
        await apiService.createNote(noteData);
        alert('✅ Notebook created successfully!');
      }
      navigate('/');
    } catch (err) {
      alert('❌ Failed to save notebook. Please try again.');
      console.error('Error saving note:', err);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-nav">
          <button className="btn-back" onClick={handleBackHome}>
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <div className="admin-brand">
            <BookOpen size={24} />
            <span>Admin Dashboard</span>
          </div>

          <button className="btn-secondary" onClick={onLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading notebook...</p>
          </div>
        ) : (
          <MarkdownEditor
            initialNote={editingNote}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;