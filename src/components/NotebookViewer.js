import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { Calendar, Tag, User } from 'lucide-react';

const NotebookViewer = ({ note }) => {
  if (!note) {
    return (
      <div className="notebook-empty">
        <h2>No notebook selected</h2>
        <p>Select a notebook from the list to view its contents</p>
      </div>
    );
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="notebook-viewer">
      {/* Notebook Header */}
      <div className="notebook-header">
        <h1 className="notebook-title">{note.title}</h1>
        
        {note.description && (
          <p className="notebook-description">{note.description}</p>
        )}

        <div className="notebook-meta">
          <div className="meta-item">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
          
          {note.tags && note.tags.length > 0 && (
            <div className="meta-item">
              <Tag size={16} />
              <div className="tags">
                {note.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notebook Content - Jupyter Style */}
      <div className="notebook-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom code block rendering
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              
              return !inline ? (
                <CodeBlock
                  language={language}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              ) : (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            },
            
            // Custom heading with anchor links
            h1: ({ children }) => (
              <h1 className="markdown-h1">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="markdown-h2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="markdown-h3">{children}</h3>
            ),
            
            // Custom blockquote (like Jupyter info cells)
            blockquote: ({ children }) => (
              <div className="notebook-alert">{children}</div>
            ),
            
            // Custom image with caption support
            img: ({ src, alt }) => (
              <figure className="notebook-image">
                <img src={src} alt={alt} loading="lazy" />
                {alt && <figcaption>{alt}</figcaption>}
              </figure>
            ),
            
            // Custom links (open in new tab for external)
            a: ({ href, children }) => {
              const isExternal = href.startsWith('http');
              return (
                <a
                  href={href}
                  target={isExternal ? '_blank' : '_self'}
                  rel={isExternal ? 'noopener noreferrer' : ''}
                  className="notebook-link"
                >
                  {children}
                  {isExternal && ' ↗'}
                </a>
              );
            },
            
            // Custom table styling
            table: ({ children }) => (
              <div className="table-wrapper">
                <table className="notebook-table">{children}</table>
              </div>
            ),
          }}
        >
          {note.rawMarkdown || note.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default NotebookViewer;