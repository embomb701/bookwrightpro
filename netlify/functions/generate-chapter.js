// Netlify Function: Generate Single Chapter
// Uses OpenAI API for AI-powered chapter generation

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function handler(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    }
  }

  try {
    const { bookData, outlines, chapterIndex, previousChapters } = JSON.parse(event.body)
    
    // Validate required fields
    if (!bookData || !outlines || chapterIndex === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Missing required fields: bookData, outlines, chapterIndex' 
        }),
      }
    }

    if (chapterIndex < 0 || chapterIndex >= outlines.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Invalid chapter index' 
        }),
      }
    }

    // Check for API key
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured')
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'API key not configured' }),
      }
    }

    // Generate chapter using OpenAI
    const chapter = await generateChapterWithAI(bookData, outlines, chapterIndex, previousChapters || [])

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chapter }),
    }
  } catch (error) {
    console.error('Error generating chapter:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to generate chapter: ' + error.message }),
    }
  }
}

/**
 * Generate a full chapter using OpenAI API
 */
async function generateChapterWithAI(bookData, outlines, chapterIndex, previousChapters) {
  const outline = outlines[chapterIndex]
  const { title, genre, tone, plotSummary, characters, setting, worldDescription } = bookData
  
  // Build character descriptions
  const characterDescriptions = characters
    .filter(c => c.name)
    .map(c => `- ${c.name} (${c.role}): ${c.description || 'No description'}`)
    .join('\n')

  // Build previous chapters summary
  const previousSummary = previousChapters.length > 0
    ? previousChapters.map((ch, i) => `Chapter ${i + 1} "${ch.title}": ${ch.content.substring(0, 500)}...`).join('\n\n')
    : 'This is the first chapter.'

  const prompt = `You are a professional novelist. Write Chapter ${chapterIndex + 1} of a ${genre} book.

BOOK DETAILS:
- Title: "${title}"
- Genre: ${genre}
- Tone: ${tone}
- Setting: ${setting || 'Not specified'}
- World Description: ${worldDescription || 'Not specified'}

PLOT SUMMARY:
${plotSummary}

CHARACTERS:
${characterDescriptions || 'Develop characters as needed'}

CHAPTER OUTLINE TO FOLLOW:
Title: "${outline.title}"
Phase: ${outline.phase}
Outline: ${outline.content}

PREVIOUS CHAPTERS CONTEXT:
${previousSummary}

INSTRUCTIONS:
Write a complete, engaging chapter of approximately 1500-2500 words that:
1. Follows the outline provided
2. Maintains consistency with previous chapters
3. Uses vivid descriptions and engaging dialogue
4. Matches the ${tone} tone
5. Advances character development
6. Ends with a hook to keep readers engaged

Write ONLY the chapter content. Do not include chapter number or title at the start - just the prose.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a talented ${genre} novelist known for ${tone.toLowerCase()} storytelling. Write immersive, well-paced prose with strong character voices and vivid descriptions.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.85,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    throw new Error('No content in OpenAI response')
  }

  return {
    title: outline.title,
    content: content.trim(),
    chapterNumber: chapterIndex + 1
  }
}
