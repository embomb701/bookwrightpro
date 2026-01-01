import React from 'react'
import { Wand2, BookOpen, Play, Pause, SkipForward, Loader2 } from 'lucide-react'
import useBookStore from '../hooks/useBookStore'
import { generateOutlines, generateChapter } from '../services/api'

const GenerationControls = () => {
  const { 
    bookData, 
    chapterOutlines,
    generatedChapters,
    generationStatus,
    generationMode,
    setGenerationMode,
    setChapterOutlines,
    addGeneratedChapter,
    setGenerationStatus,
    resetGeneration
  } = useBookStore()

  const isFormValid = () => {
    return (
      bookData.title.trim() &&
      bookData.genre.trim() &&
      bookData.plotSummary.trim() &&
      bookData.chapters > 0
    )
  }

  const handleGenerateOutlines = async () => {
    if (!isFormValid()) {
      alert('Please fill in at least the title, genre, plot summary, and number of chapters.')
      return
    }

    setGenerationStatus({ isGenerating: true, currentStep: 'outlines', progress: 0 })

    try {
      const outlines = await generateOutlines(bookData)
      setChapterOutlines(outlines)
      setGenerationStatus({ isGenerating: false, currentStep: 'outlines-complete', progress: 100 })
    } catch (error) {
      console.error('Error generating outlines:', error)
      setGenerationStatus({ isGenerating: false, currentStep: 'error', error: error.message })
    }
  }

  const handleGenerateBook = async () => {
    if (chapterOutlines.length === 0) {
      alert('Please generate chapter outlines first.')
      return
    }

    setGenerationStatus({ 
      isGenerating: true, 
      currentStep: 'chapters', 
      progress: 0,
      currentChapter: 0,
      totalChapters: chapterOutlines.length
    })

    if (generationMode === 'auto') {
      await generateAllChapters()
    } else {
      await generateNextChapter(0)
    }
  }

  const generateAllChapters = async () => {
    for (let i = 0; i < chapterOutlines.length; i++) {
      try {
        setGenerationStatus(prev => ({
          ...prev,
          currentChapter: i + 1,
          progress: Math.round((i / chapterOutlines.length) * 100)
        }))

        const chapter = await generateChapter(bookData, chapterOutlines, i, generatedChapters)
        addGeneratedChapter(chapter)

        // Small delay between chapters
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Error generating chapter ${i + 1}:`, error)
        setGenerationStatus({ 
          isGenerating: false, 
          currentStep: 'error', 
          error: `Failed at chapter ${i + 1}: ${error.message}` 
        })
        return
      }
    }

    setGenerationStatus({ 
      isGenerating: false, 
      currentStep: 'complete', 
      progress: 100 
    })
  }

  const generateNextChapter = async (chapterIndex) => {
    if (chapterIndex >= chapterOutlines.length) {
      setGenerationStatus({ 
        isGenerating: false, 
        currentStep: 'complete', 
        progress: 100 
      })
      return
    }

    try {
      setGenerationStatus(prev => ({
        ...prev,
        isGenerating: true,
        currentChapter: chapterIndex + 1,
        progress: Math.round((chapterIndex / chapterOutlines.length) * 100)
      }))

      const chapter = await generateChapter(bookData, chapterOutlines, chapterIndex, generatedChapters)
      addGeneratedChapter(chapter)

      setGenerationStatus(prev => ({
        ...prev,
        isGenerating: false,
        currentStep: 'waiting',
        progress: Math.round(((chapterIndex + 1) / chapterOutlines.length) * 100)
      }))
    } catch (error) {
      console.error(`Error generating chapter ${chapterIndex + 1}:`, error)
      setGenerationStatus({ 
        isGenerating: false, 
        currentStep: 'error', 
        error: `Failed at chapter ${chapterIndex + 1}: ${error.message}` 
      })
    }
  }

  const handleNextChapter = () => {
    generateNextChapter(generatedChapters.length)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all generated content?')) {
      resetGeneration()
    }
  }

  const { isGenerating, currentStep, progress, currentChapter, totalChapters, error } = generationStatus

  return (
    <div className="card" style={styles.container}>
      <div className="card-header">
        <div style={styles.headerTitle}>
          <Wand2 size={20} color="var(--accent-secondary)" />
          <h3>Generation Controls</h3>
        </div>
      </div>

      {/* Mode Toggle */}
      <div style={styles.modeSection}>
        <label className="text-sm">Generation Mode:</label>
        <div style={styles.modeToggle}>
          <button
            className={generationMode === 'manual' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setGenerationMode('manual')}
            style={styles.modeBtn}
            disabled={isGenerating}
          >
            <Pause size={16} />
            Manual
          </button>
          <button
            className={generationMode === 'auto' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setGenerationMode('auto')}
            style={styles.modeBtn}
            disabled={isGenerating}
          >
            <Play size={16} />
            Auto
          </button>
        </div>
        <p className="text-xs text-muted mt-2">
          {generationMode === 'manual' 
            ? 'Generate one chapter at a time with review between each.'
            : 'Automatically generate all chapters sequentially.'}
        </p>
      </div>

      {/* Progress Display */}
      {(isGenerating || currentStep === 'waiting' || currentStep === 'complete') && (
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span className="text-sm">
              {currentStep === 'outlines' && 'Generating outlines...'}
              {currentStep === 'chapters' && `Generating chapter ${currentChapter} of ${totalChapters}...`}
              {currentStep === 'waiting' && `Chapter ${currentChapter} complete. Ready for next.`}
              {currentStep === 'complete' && '✨ Book generation complete!'}
            </span>
            <span className="text-sm text-accent">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={styles.errorBox}>
          <span className="text-error">{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.buttonGroup}>
        <button
          className="btn-primary"
          onClick={handleGenerateOutlines}
          disabled={isGenerating || !isFormValid()}
          style={styles.mainBtn}
        >
          {isGenerating && currentStep === 'outlines' ? (
            <>
              <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
              Generating Outlines...
            </>
          ) : (
            <>
              <Wand2 size={18} />
              Generate Chapter Outlines
            </>
          )}
        </button>

        {chapterOutlines.length > 0 && (
          <button
            className="btn-primary"
            onClick={handleGenerateBook}
            disabled={isGenerating || currentStep === 'complete'}
            style={styles.mainBtn}
          >
            {isGenerating && currentStep === 'chapters' ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Generating Book...
              </>
            ) : (
              <>
                <BookOpen size={18} />
                Generate Full Book
              </>
            )}
          </button>
        )}

        {generationMode === 'manual' && currentStep === 'waiting' && generatedChapters.length < chapterOutlines.length && (
          <button
            className="btn-success"
            onClick={handleNextChapter}
            disabled={isGenerating}
            style={styles.mainBtn}
          >
            <SkipForward size={18} />
            Generate Next Chapter
          </button>
        )}

        {(chapterOutlines.length > 0 || generatedChapters.length > 0) && (
          <button
            className="btn-secondary"
            onClick={handleReset}
            disabled={isGenerating}
            style={styles.resetBtn}
          >
            Reset All
          </button>
        )}
      </div>

      {!isFormValid() && (
        <p className="text-xs text-muted mt-3 text-center">
          Fill in the required fields (title, genre, plot summary, chapters) to enable generation.
        </p>
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
  modeSection: {
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '8px',
  },
  modeToggle: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  modeBtn: {
    flex: 1,
    padding: '0.6rem 1rem',
    fontSize: '0.875rem',
  },
  progressSection: {
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '8px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  errorBox: {
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid var(--error)',
    borderRadius: '8px',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  mainBtn: {
    padding: '1rem 1.5rem',
    fontSize: '1rem',
  },
  resetBtn: {
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
  },
}

export default GenerationControls
