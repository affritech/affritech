import React, { useState } from 'react';
import NotebookViewer from './NotebookViewer';
import { Eye, EyeOff, Save, X } from 'lucide-react';

const MarkdownEditor = ({ initialNote, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialNote?.title || '',
    content: initialNote?.rawMarkdown || initialNote?.content || '',
    description: initialNote?.description || '',
    tags: initialNote?.tags?.join(', ') || '',
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const noteData = {
      title: formData.title,
      content: formData.content,
      description: formData.description,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    };

    try {
      await onSave(noteData);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Preview note object
  const previewNote = {
    title: formData.title,
    rawMarkdown: formData.content,
    description: formData.description,
    tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    createdAt: initialNote?.createdAt || new Date().toISOString(),
  };

  return (
    <div className="markdown-editor">
      <div className="editor-header">
        <h2>{initialNote ? 'Edit Notebook' : 'Create New Notebook'}</h2>
        <div className="editor-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      <div className={`editor-layout ${showPreview ? 'split-view' : 'full-view'}`}>
        {/* Editor Panel */}
        <div className="editor-panel">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter notebook title..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of this notebook..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="python, machine-learning, tutorial"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">
                Markdown Content *
                <span className="label-hint">
                  Supports markdown, code blocks, images, links, and tables
                </span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="# Start writing your notebook...

## Code Example

```python
def hello_world():
    print('Hello, World!')
```

## Resources

- [Link to resource](https://example.com)
- ![Image description](image-url.jpg)

> **Note:** This is an important note!"
                rows={20}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={isSaving}
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Notebook'}
              </button>
              
              {onCancel && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onCancel}
                  disabled={isSaving}
                >
                  <X size={18} />
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Markdown Quick Reference */}
          <div className="markdown-help">
            <h4>Markdown Quick Reference</h4>
            <div className="help-grid">
              <div>
                <strong>Headings:</strong>
                <code># H1</code>
                <code>## H2</code>
              </div>
              <div>
                <strong>Emphasis:</strong>
                <code>**bold**</code>
                <code>*italic*</code>
              </div>
              <div>
                <strong>Code:</strong>
                <code>`inline`</code>
                <code>```language```</code>
              </div>
              <div>
                <strong>Lists:</strong>
                <code>- item</code>
                <code>1. item</code>
              </div>
              <div>
                <strong>Links:</strong>
                <code>[text](url)</code>
              </div>
              <div>
                <strong>Images:</strong>
                <code>![alt](url)</code>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="preview-panel">
            <div className="preview-header">
              <h3>Live Preview</h3>
            </div>
            <div className="preview-content">
              <NotebookViewer note={previewNote} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;