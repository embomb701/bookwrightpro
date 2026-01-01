import React from 'react'
import Header from './components/Header'
import BookForm from './components/BookForm'
import GenerationControls from './components/GenerationControls'
import ChapterOutlines from './components/ChapterOutlines'
import BookPreview from './components/BookPreview'
import useBookStore from './hooks/useBookStore'
import { RotateCcw } from 'lucide-react'

function App() {
  const { resetAll, bookData, generatedChapters } = useBookStore()

  const handleResetAll = () => {
    if (confirm('Are you sure you want to reset everything? This will clear all your book data and generated content.')) {
      resetAll()
    }
  }

  return (
    <div style={styles.app}>
      <Header />
      
      <main style={styles.main}>
        <div className="container">
          {/* Intro Section */}
          <section style={styles.intro}>
            <h2>Create Your Book</h2>
            <p className="text-muted">
              Fill in the details below to generate your book. Start with the basics, 
              add your characters, and let the AI craft your story chapter by chapter.
            </p>
          </section>

          {/* Two Column Layout */}
          <div style={styles.layout}>
            {/* Left Column - Form */}
            <div style={styles.formColumn}>
              <BookForm />
            </div>

            {/* Right Column - Controls & Output */}
            <div style={styles.outputColumn}>
              <div style={styles.stickyControls}>
                <GenerationControls />
                
                {/* Quick Stats */}
                {(bookData.title || bookData.characters.length > 0) && (
                  <div style={styles.quickStats}>
                    <h4>Current Book</h4>
                    <div style={styles.statsList}>
                      <div style={styles.statItem}>
                        <span className="text-muted">Title:</span>
                        <span>{bookData.title || 'Untitled'}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span className="text-muted">Chapters:</span>
                        <span>{bookData.chapters}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span className="text-muted">Characters:</span>
                        <span>{bookData.characters.length}</span>
                      </div>
                      {generatedChapters.length > 0 && (
                        <div style={styles.statItem}>
                          <span className="text-muted">Generated:</span>
                          <span className="text-success">{generatedChapters.length} chapters</span>
                        </div>
                      )}
                    </div>
                    <button
                      className="btn-secondary"
                      onClick={handleResetAll}
                      style={styles.resetAllBtn}
                    >
                      <RotateCcw size={14} />
                      Reset Everything
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full Width - Outlines & Preview */}
          <ChapterOutlines />
          <BookPreview />

          {/* Footer */}
          <footer style={styles.footer}>
            <p className="text-muted text-sm">
              BookWrightPro • AI-Powered Book Generation
            </p>
            <p className="text-muted text-xs">
              Currently using mock generation. Ready for AI integration.
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: '2rem 0',
  },
  intro: {
    textAlign: 'center',
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid var(--border-primary)',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
    alignItems: 'start',
  },
  formColumn: {
    minWidth: 0,
  },
  outputColumn: {
    minWidth: 0,
  },
  stickyControls: {
    position: 'sticky',
    top: '100px',
  },
  quickStats: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    border: '1px solid var(--border-primary)',
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '0.75rem',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
  },
  resetAllBtn: {
    width: '100%',
    marginTop: '1rem',
    padding: '0.5rem',
    fontSize: '0.75rem',
  },
  footer: {
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid var(--border-primary)',
    textAlign: 'center',
  },
}

// Responsive styles
const mediaQuery = window.matchMedia('(max-width: 900px)')
if (mediaQuery.matches) {
  styles.layout = {
    ...styles.layout,
    gridTemplateColumns: '1fr',
  }
  styles.stickyControls = {
    position: 'relative',
    top: 0,
  }
}

export default App
