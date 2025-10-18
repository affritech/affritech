import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import apiService from '../services/api';
import { BookOpen, Search, Lock, LogOut, Plus, RefreshCw } from 'lucide-react';

const Home = ({ isAdmin, onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    // Filter notes based on search query
    if (searchQuery.trim()) {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllNotes();
      if (response.success) {
        setNotes(response.data);
        setFilteredNotes(response.data);
      }
    } catch (err) {
      setError('Failed to load notebooks. Please try again.');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      alert('Failed to delete notebook');
      console.error('Error deleting note:', err);
    }
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <BookOpen size={28} />
            <h1>Notebook Platform</h1>
          </div>

          <div className="navbar-actions">
            {isAdmin ? (
              <>
                <Link to="/admin" className="btn-primary">
                  <Plus size={18} />
                  New Notebook
                </Link>
                <button className="btn-secondary" onClick={onLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin/login" className="btn-secondary">
                <Lock size={18} />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">📚 Learning Notebooks</h1>
          <p className="hero-subtitle">
            Beautifully formatted notes, code snippets, and resources for students
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search notebooks by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>
        
        <button className="btn-icon" onClick={fetchNotes} title="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Content */}
      <main className="main-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading notebooks...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button className="btn-primary" onClick={fetchNotes}>
              Try Again
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            {searchQuery ? (
              <>
                <h2>No notebooks found</h2>
                <p>Try adjusting your search query</p>
                <button className="btn-secondary" onClick={() => setSearchQuery('')}>
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <BookOpen size={64} strokeWidth={1} />
                <h2>No notebooks yet</h2>
                <p>
                  {isAdmin
                    ? 'Create your first notebook to get started'
                    : 'Check back soon for new content'}
                </p>
                {isAdmin && (
                  <Link to="/admin" className="btn-primary">
                    <Plus size={18} />
                    Create Notebook
                  </Link>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            <div className="notebooks-header">
              <h2>
                {searchQuery
                  ? `Found ${filteredNotes.length} notebook${filteredNotes.length !== 1 ? 's' : ''}`
                  : `All Notebooks (${filteredNotes.length})`}
              </h2>
            </div>
            
            <div className="notebooks-grid">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isAdmin={isAdmin}
                  onEdit={(note) => window.location.href = `/admin?edit=${note.id}`}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Notebook Platform. Built with React & Express.</p>
      </footer>
    </div>
  );
};

export default Home;