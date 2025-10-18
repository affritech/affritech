import React from 'react';
import { Calendar, Tag, BookOpen, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NoteCard = ({ note, isAdmin, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleClick = () => {
    navigate(`/notebook/${note.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(note);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      onDelete(note.id);
    }
  };

  // Extract first paragraph as preview
  const getPreview = () => {
    const content = note.rawMarkdown || note.content || '';
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    return lines[0]?.substring(0, 150) || 'No preview available';
  };

  return (
    <div className="note-card" onClick={handleClick}>
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
        
        {isAdmin && (
          <div className="note-card-actions">
            <button
              className="icon-button edit"
              onClick={handleEdit}
              title="Edit notebook"
            >
              <Edit size={16} />
            </button>
            <button
              className="icon-button delete"
              onClick={handleDelete}
              title="Delete notebook"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {note.description && (
        <p className="note-card-description">{note.description}</p>
      )}

      <p className="note-card-preview">{getPreview()}</p>

      <div className="note-card-footer">
        <div className="note-card-meta">
          <span className="meta-item">
            <Calendar size={14} />
            {formattedDate}
          </span>
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="note-card-tags">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag-small">
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="tag-small">+{note.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="note-card-action">
        <BookOpen size={16} />
        <span>Open Notebook</span>
      </div>
    </div>
  );
};

export default NoteCard;