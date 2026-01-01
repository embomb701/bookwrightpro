exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { title, plot, tone, chapters, author } = body;

    // Mock book generation
    const mockBook = {
      title: title || 'Untitled Book',
      author: author || 'Anonymous Author',
      chapters: Array.from({ length: chapters || 5 }, (_, i) => ({
        number: i + 1,
        title: `Chapter ${i + 1}: The ${tone || 'Epic'} Journey Begins`,
        content: `This is mock content for Chapter ${i + 1} in ${tone || 'mystery'} tone. In a world where ${plot || 'mysteries abound'}, the hero discovers a secret that changes everything. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. (Generated mock - ready for AI integration!)`
      }))
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(mockBook)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate book' })
    };
  }
};
