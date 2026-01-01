// Netlify Function: Generate Chapter Outlines
// Uses OpenAI API for AI-powered outline generation

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
    const bookData = JSON.parse(event.body)
    
    // Validate required fields
    if (!bookData.title || !bookData.chapters || !bookData.plotSummary) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Missing required fields: title, chapters, plotSummary' 
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

    // Generate outlines using OpenAI
    const outlines = await generateOutlinesWithAI(bookData)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ outlines }),
    }
  } catch (error) {
    console.error('Error generating outlines:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to generate outlines: ' + error.message }),
    }
  }
}

/**
 * Generate chapter outlines using OpenAI API
 */
async function generateOutlinesWithAI(bookData) {
  const { title, genre, tone, chapters, plotSummary, characters, setting, worldDescription } = bookData
  
  // Build character descriptions
  const characterDescriptions = characters
    .filter(c => c.name)
    .map(c => `- ${c.name} (${c.role}): ${c.description || 'No description'}`)
    .join('\n')

  const prompt = `You are a professional book outliner. Create detailed chapter outlines for a ${chapters}-chapter ${genre} book.

BOOK DETAILS:
- Title: "${title}"
- Genre: ${genre}
- Tone: ${tone}
- Setting: ${setting || 'Not specified'}
- World Description: ${worldDescription || 'Not specified'}

PLOT SUMMARY:
${plotSummary}

CHARACTERS:
${characterDescriptions || 'No characters defined yet'}

INSTRUCTIONS:
Generate exactly ${chapters} chapter outlines. For each chapter, provide:
1. A compelling chapter title
2. A 2-3 paragraph detailed outline describing the key events, character development, and how it advances the plot

Follow classic story structure:
- Act 1 (first 25%): Setup and inciting incident
- Act 2 (middle 50%): Rising action, midpoint twist, complications
- Act 3 (final 25%): Crisis, climax, and resolution

Respond ONLY with a valid JSON array in this exact format:
[
  {
    "title": "Chapter Title Here",
    "content": "Detailed outline paragraph 1.\\n\\nDetailed outline paragraph 2.",
    "phase": "opening|setup|inciting-incident|rising-action|midpoint|complications|crisis|climax|resolution"
  }
]`

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
          content: 'You are a professional book outliner and story architect. You respond only with valid JSON arrays, no markdown or extra text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
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

  // Parse the JSON response
  try {
    // Clean up potential markdown code blocks
    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const outlines = JSON.parse(cleanedContent)
    return outlines
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', content)
    throw new Error('Failed to parse AI response as JSON')
  }
}
