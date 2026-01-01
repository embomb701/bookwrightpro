import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialBookData = {
  title: '',
  genre: '',
  tone: 'Serious',
  chapters: 10,
  plotSummary: '',
  characters: [],
  setting: '',
  worldDescription: '',
}

const initialGenerationStatus = {
  isGenerating: false,
  currentStep: 'idle', // idle, outlines, outlines-complete, chapters, waiting, complete, error
  progress: 0,
  currentChapter: 0,
  totalChapters: 0,
  error: null,
}

const useBookStore = create(
  persist(
    (set, get) => ({
      // Book Data
      bookData: { ...initialBookData },
      
      // Chapter Outlines (generated first)
      chapterOutlines: [],
      originalOutlines: [], // Store originals for reset
      
      // Generated Chapters (full content)
      generatedChapters: [],
      
      // Generation Status
      generationStatus: { ...initialGenerationStatus },
      
      // Generation Mode: 'manual' or 'auto'
      generationMode: 'manual',

      // Actions - Book Data
      updateBookData: (updates) => set((state) => ({
        bookData: { ...state.bookData, ...updates }
      })),

      resetBookData: () => set({
        bookData: { ...initialBookData }
      }),

      // Actions - Characters
      addCharacter: (character) => set((state) => ({
        bookData: {
          ...state.bookData,
          characters: [...state.bookData.characters, character]
        }
      })),

      updateCharacter: (id, updates) => set((state) => ({
        bookData: {
          ...state.bookData,
          characters: state.bookData.characters.map(char =>
            char.id === id ? { ...char, ...updates } : char
          )
        }
      })),

      removeCharacter: (id) => set((state) => ({
        bookData: {
          ...state.bookData,
          characters: state.bookData.characters.filter(char => char.id !== id)
        }
      })),

      // Actions - Chapter Outlines
      setChapterOutlines: (outlines) => set({
        chapterOutlines: outlines,
        originalOutlines: JSON.parse(JSON.stringify(outlines)) // Deep copy for reset
      }),

      updateChapterOutline: (index, content) => set((state) => ({
        chapterOutlines: state.chapterOutlines.map((outline, i) =>
          i === index ? { ...outline, content } : outline
        )
      })),

      resetChapterOutline: (index) => set((state) => ({
        chapterOutlines: state.chapterOutlines.map((outline, i) =>
          i === index ? { ...state.originalOutlines[i] } : outline
        )
      })),

      // Actions - Generated Chapters
      addGeneratedChapter: (chapter) => set((state) => ({
        generatedChapters: [...state.generatedChapters, chapter]
      })),

      updateGeneratedChapter: (index, updates) => set((state) => ({
        generatedChapters: state.generatedChapters.map((chapter, i) =>
          i === index ? { ...chapter, ...updates } : chapter
        )
      })),

      // Actions - Generation Status
      setGenerationStatus: (status) => set((state) => ({
        generationStatus: { ...state.generationStatus, ...status }
      })),

      // Actions - Generation Mode
      setGenerationMode: (mode) => set({ generationMode: mode }),

      // Actions - Reset
      resetGeneration: () => set({
        chapterOutlines: [],
        originalOutlines: [],
        generatedChapters: [],
        generationStatus: { ...initialGenerationStatus }
      }),

      resetAll: () => set({
        bookData: { ...initialBookData },
        chapterOutlines: [],
        originalOutlines: [],
        generatedChapters: [],
        generationStatus: { ...initialGenerationStatus },
        generationMode: 'manual'
      }),

      // Computed - Get all book context for AI
      getBookContext: () => {
        const state = get()
        return {
          ...state.bookData,
          outlines: state.chapterOutlines,
          previousChapters: state.generatedChapters
        }
      }
    }),
    {
      name: 'bookwright-storage',
      partialize: (state) => ({
        bookData: state.bookData,
        chapterOutlines: state.chapterOutlines,
        originalOutlines: state.originalOutlines,
        generatedChapters: state.generatedChapters,
        generationMode: state.generationMode
      })
    }
  )
)

export default useBookStore
