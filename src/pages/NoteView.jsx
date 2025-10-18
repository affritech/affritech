import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NotebookViewer from '../components/NotebookViewer';
import apiService from '../services/api';
import { ArrowLeft, Edit, BookOpen } from 'lucide-react';

const NoteView = ({ isAdmin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getNoteById(id);
      if (response.success) {
        setNote(response.data);
      }
    } catch (err) {
      setError('Failed to load notebook. It may have been deleted.');
      console.error('Error fetching note:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleEdit = () => {
    navigate(`/admin?edit=${id}`);
  };

  return (
    <div className="note-view-page">
      {/* Header */}
      <div className="note-view-header">
        <div className="note-view-nav">
          <button className="btn-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            Back to Notebooks
          </button>

          <div className="note-view-brand">
            <BookOpen size={24} />
            <span>Notebook Platform</span>
          </div>

          {isAdmin && note && (
            <button className="btn-primary" onClick={handleEdit}>
              <Edit size={18} />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="note-view-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading notebook...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <h2>⚠️ Error</h2>
            <p>{error}</p>
            <button className="btn-primary" onClick={handleBack}>
              Go Back Home
            </button>
          </div>
        ) : (
          <div className="notebook-container">
            <NotebookViewer note={note} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteView;