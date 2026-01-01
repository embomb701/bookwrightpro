import React, { useState } from 'react';
import jsPDF from 'jspdf';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    title: '',
    plot: '',
    tone: 'mystery',
    chapters: 5,
    author: ''
  });
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const tones = ['mystery', 'fantasy', 'sci-fi', 'romance', 'adventure', 'horror', 'comedy'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/generate-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setBook(data);
    } catch (error) {
      alert('Error generating book. Using mock data.');
      // Mock fallback
      setBook({
        title: formData.title || 'Untitled Book',
        author: formData.author || 'Anonymous',
        chapters: Array.from({ length: formData.chapters || 5 }, (_, i) => ({
          number: i + 1,
          title: `Chapter ${i + 1}: ${generateMockTitle(formData.tone)}`,
          content: generateMockContent(formData.tone, 800)
        }))
      });
    }
    setLoading(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(20);
    doc.text(book.title, 20, y);
    y += 20;
    doc.setFontSize(12);
    doc.text(`By ${book.author}`, 20, y);
    y += 30;

    book.chapters.forEach(chapter => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(16);
      doc.text(chapter.title, 20, y);
      y += 10;
      doc.setFontSize(12);
      const splitContent = doc.splitTextToSize(chapter.content, 170);
      doc.text(splitContent, 20, y);
      y += splitContent.length * 7 + 20;
    });

    doc.save(`${book.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  const generateMockTitle = (tone) => {
    const titles = {
      mystery: ['The Shadowed Secret', 'Whispers in the Dark', 'The Final Clue'],
      fantasy: ['The Enchanted Sword', 'Dragon\'s Awakening', 'Kingdom of Stars'],
      'sci-fi': ['Stars Beyond Reach', 'Quantum Paradox', 'Galactic Dawn'],
      romance: ['Hearts Entwined', 'Love Under the Stars', 'Eternal Flame'],
      adventure: ['Lost Temple Quest', 'Jungle of Secrets', 'Ocean\'s Fury'],
      horror: ['Nightmare Realm', 'The Haunting', 'Blood Moon'],
      comedy: ['Chaos in the Kitchen', 'The Great Mix-Up', 'Laugh Riot']
    };
    return titles[tone || 'mystery'][Math.floor(Math.random() * 3)];
  };

  const generateMockContent = (tone, length) => {
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
    return lorem.repeat(length / 50).substring(0, length) + ` (Mock chapter in ${tone} tone)`;
  };

  return (
    <div className="container">
      <h1>📚 BookWrightPro</h1>
      <form onSubmit={generateBook}>
        <input
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="plot"
          placeholder="Plot Summary (optional)"
          value={formData.plot}
          onChange={handleChange}
          rows="4"
        />
        <select name="tone" value={formData.tone} onChange={handleChange}>
          {tones.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <input
          name="chapters"
          type="number"
          placeholder="Number of Chapters"
          value={formData.chapters}
          onChange={handleChange}
          min="1"
          max="20"
          required
        />
        <input
          name="author"
          placeholder="Author Name (optional)"
          value={formData.author}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : '✨ Generate Book'}
        </button>
      </form>

      {loading && <div className="loading">Crafting your book... (mock mode)</div>}

      {book && (
        <div className="book-display">
          <h2>{book.title}</h2>
          <p>By {book.author}</p>
          {book.chapters.map(chapter => (
            <div key={chapter.number} className="chapter">
              <h3>Chapter {chapter.number}: {chapter.title}</h3>
              <p>{chapter.content}</p>
            </div>
          ))}
          <div className="download-btns">
            <button onClick={downloadPDF}>📥 Download PDF</button>
            <button onClick={() => window.print()}>🖨️ Print</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
