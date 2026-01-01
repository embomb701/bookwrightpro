import React from 'react'
import { BookOpen, Palette, FileText, MapPin, Globe } from 'lucide-react'
import useBookStore from '../hooks/useBookStore'
import CharacterForm from './CharacterForm'

const TONE_OPTIONS = [
  'Serious',
  'Humorous',
  'Dark',
  'Lighthearted',
  'Mysterious',
  'Romantic',
  'Suspenseful',
  'Whimsical',
  'Melancholic',
  'Inspirational'
]

const BookForm = () => {
  const { bookData, updateBookData } = useBookStore()

  const handleChange = (field, value) => {
    updateBookData({ [field]: value })
  }

  return (
    <div style={styles.container}>
      {/* Basic Info Section */}
      <div className="card" style={styles.section}>
        <div className="card-header">
          <div style={styles.headerTitle}>
            <BookOpen size={20} color="var(--accent-secondary)" />
            <h3>Book Details</h3>
          </div>
        </div>

        <div className="form-group">
          <label>Book Title</label>
          <input
            type="text"
            placeholder="Enter your book title"
            value={bookData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Genre(s)</label>
            <textarea
              placeholder="Fantasy, Science Fiction, Romance, Mystery, etc. (you can list multiple)"
              value={bookData.genre}
              onChange={(e) => handleChange('genre', e.target.value)}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>Tone</label>
            <select
              value={bookData.tone}
              onChange={(e) => handleChange('tone', e.target.value)}
            >
              {TONE_OPTIONS.map(tone => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Number of Chapters</label>
          <div style={styles.chapterInput}>
            <input
              type="number"
              min="1"
              max="100"
              value={bookData.chapters}
              onChange={(e) => handleChange('chapters', parseInt(e.target.value) || 1)}
              style={{ maxWidth: '120px' }}
            />
            <span className="text-muted text-sm">chapters (1-100)</span>
          </div>
        </div>
      </div>

      {/* Plot Section */}
      <div className="card" style={styles.section}>
        <div className="card-header">
          <div style={styles.headerTitle}>
            <FileText size={20} color="var(--accent-secondary)" />
            <h3>Plot Summary</h3>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Describe your story's plot</label>
          <textarea
            placeholder="Write a detailed summary of your book's plot. Include the main conflict, key events, and how you envision the story unfolding..."
            value={bookData.plotSummary}
            onChange={(e) => handleChange('plotSummary', e.target.value)}
            rows={6}
          />
        </div>
      </div>

      {/* Characters Section */}
      <CharacterForm />

      {/* Setting & World Section */}
      <div className="card" style={styles.section}>
        <div className="card-header">
          <div style={styles.headerTitle}>
            <Globe size={20} color="var(--accent-secondary)" />
            <h3>Setting & World</h3>
          </div>
        </div>

        <div className="form-group">
          <label>
            <MapPin size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
            Setting
          </label>
          <textarea
            placeholder="Where does your story take place? Describe the locations, time period, and atmosphere..."
            value={bookData.setting}
            onChange={(e) => handleChange('setting', e.target.value)}
            rows={4}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>
            <Globe size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
            World Description
          </label>
          <textarea
            placeholder="Describe the world of your story. Include rules, magic systems, technology, society, culture, or any unique aspects..."
            value={bookData.worldDescription}
            onChange={(e) => handleChange('worldDescription', e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  section: {
    marginBottom: 0,
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  chapterInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
}

export default BookForm
