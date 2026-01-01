import React from 'react'
import { List, Edit3, Check, RotateCcw } from 'lucide-react'
import useBookStore from '../hooks/useBookStore'

const ChapterOutlines = () => {
  const { 
    chapterOutlines, 
    updateChapterOutline, 
    resetChapterOutline,
    generationStatus 
  } = useBookStore()

  if (chapterOutlines.length === 0) {
    return null
  }

  return (
    <div className="card" style={styles.container}>
      <div className="card-header">
        <div style={styles.headerTitle}>
          <List size={20} color="var(--accent-secondary)" />
          <h3>Chapter Outlines</h3>
        </div>
        <span className="text-sm text-muted">
          {chapterOutlines.length} chapters
        </span>
      </div>

      <p className="text-sm text-muted mb-4">
        Review and edit the chapter outlines below. These will guide the full book generation.
      </p>

      <div style={styles.outlineList}>
        {chapterOutlines.map((chapter, index) => (
          <ChapterOutlineCard
            key={index}
            chapter={chapter}
            index={index}
            onUpdate={(content) => updateChapterOutline(index, content)}
            onReset={() => resetChapterOutline(index)}
            disabled={generationStatus.isGenerating}
          />
        ))}
      </div>
    </div>
  )
}

const ChapterOutlineCard = ({ chapter, index, onUpdate, onReset, disabled }) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editContent, setEditContent] = React.useState(chapter.content)

  const handleSave = () => {
    onUpdate(editContent)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditContent(chapter.content)
    setIsEditing(false)
  }

  return (
    <div style={styles.outlineCard}>
      <div style={styles.outlineHeader}>
        <div style={styles.chapterTitle}>
          <span style={styles.chapterNumber}>Chapter {index + 1}</span>
          <h4 style={styles.chapterName}>{chapter.title}</h4>
        </div>
        <div style={styles.outlineActions}>
          {isEditing ? (
            <>
              <button 
                className="btn-success" 
                onClick={handleSave}
                style={styles.actionBtn}
                disabled={disabled}
              >
                <Check size={14} />
                Save
              </button>
              <button 
                className="btn-secondary" 
                onClick={handleCancel}
                style={styles.actionBtn}
                disabled={disabled}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                className="btn-secondary" 
                onClick={() => setIsEditing(true)}
                style={styles.actionBtn}
                disabled={disabled}
              >
                <Edit3 size={14} />
                Edit
              </button>
              <button 
                className="btn-secondary" 
                onClick={onReset}
                style={styles.actionBtn}
                title="Reset to original"
                disabled={disabled}
              >
                <RotateCcw size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          style={styles.editTextarea}
          rows={6}
          disabled={disabled}
        />
      ) : (
        <div style={styles.outlineContent}>
          {chapter.content.split('\n').map((paragraph, i) => (
            <p key={i} style={styles.paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    marginTop: '1.5rem',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  outlineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  outlineCard: {
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid var(--border-primary)',
  },
  outlineHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  chapterTitle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  chapterNumber: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--accent-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  chapterName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  outlineActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    padding: '0.4rem 0.75rem',
    fontSize: '0.75rem',
  },
  outlineContent: {
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
  },
  paragraph: {
    marginBottom: '0.75rem',
  },
  editTextarea: {
    width: '100%',
    minHeight: '150px',
    fontSize: '0.9rem',
    lineHeight: 1.7,
  },
}

export default ChapterOutlines
