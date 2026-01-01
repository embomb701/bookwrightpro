import React from 'react'
import { BookOpen, Sparkles } from 'lucide-react'

const Header = () => {
  return (
    <header style={styles.header}>
      <div className="container" style={styles.container}>
        <div style={styles.logo}>
          <BookOpen size={32} color="var(--accent-secondary)" />
          <h1 style={styles.title}>FJA's BookWrightPro</h1>
        </div>
        <div style={styles.tagline}>
          <Sparkles size={16} color="var(--accent-tertiary)" />
          <span>AI-Powered Book Generation</span>
        </div>
      </div>
    </header>
  )
}

const styles = {
  header: {
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-primary)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  tagline: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
  },
}

export default Header
