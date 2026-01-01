// API Service for BookWrightPro
// Communicates with Netlify Functions

const API_BASE = '/.netlify/functions'

/**
 * Generate chapter outlines based on book data
 * @param {Object} bookData - The book configuration data
 * @returns {Promise<Array>} Array of chapter outlines
 */
export async function generateOutlines(bookData) {
  try {
    const response = await fetch(`${API_BASE}/generate-outlines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to generate outlines')
    }

    const data = await response.json()
    return data.outlines
  } catch (error) {
    console.error('Error in generateOutlines:', error)
    throw error
  }
}

/**
 * Generate a single chapter
 * @param {Object} bookData - The book configuration data
 * @param {Array} outlines - All chapter outlines
 * @param {number} chapterIndex - Index of chapter to generate
 * @param {Array} previousChapters - Previously generated chapters for context
 * @returns {Promise<Object>} Generated chapter object
 */
export async function generateChapter(bookData, outlines, chapterIndex, previousChapters = []) {
  try {
    const response = await fetch(`${API_BASE}/generate-chapter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookData,
        outlines,
        chapterIndex,
        previousChapters,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to generate chapter')
    }

    const data = await response.json()
    return data.chapter
  } catch (error) {
    console.error('Error in generateChapter:', error)
    throw error
  }
}

/**
 * Health check for API
 * @returns {Promise<boolean>}
 */
export async function healthCheck() {
  try {
    const response = await fetch(`${API_BASE}/health`)
    return response.ok
  } catch {
    return false
  }
}
