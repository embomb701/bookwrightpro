import React from 'react'
import { Plus, Trash2, User } from 'lucide-react'
import useBookStore from '../hooks/useBookStore'

const CHARACTER_ROLES = [
  'Protagonist',
  'Antagonist',
  'Deuteragonist',
  'Tritagonist',
  'Confidant',
  'Love Interest',
  'Foil'
]

const CHARACTER_TYPES = [
  'Dynamic Character',
  'Static Character',
  'Round Character',
  'Flat Character',
  'Stock Character',
  'Symbolic Character',
  'Tertiary Character',
  'Hero',
  'Mentor',
  'Villain',
  'Antihero',
  'Innocent',
  'Trickster',
  'Caregiver',
  'Rebel'
]

const CharacterForm = () => {
  const { bookData, addCharacter, updateCharacter, removeCharacter } = useBookStore()
  const { characters } = bookData

  const handleAddCharacter = () => {
    addCharacter({
      id: Date.now(),
      name: '',
      backstory: '',
      role: 'Protagonist',
      type: 'Dynamic Character'
    })
  }

  const handleChange = (id, field, value) => {
    updateCharacter(id, { [field]: value })
  }

  return (
    <div className="card" style={styles.container}>
      <div className="card-header">
        <div style={styles.headerTitle}>
          <User size={20} color="var(--accent-secondary)" />
          <h3>Characters</h3>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleAddCharacter}
          style={styles.addBtn}
        >
          <Plus size={18} />
          Add Character
        </button>
      </div>

      {characters.length === 0 ? (
        <div style={styles.emptyState}>
          <User size={48} color="var(--text-muted)" />
          <p>No characters added yet</p>
          <p className="text-sm text-muted">Click "Add Character" to create your first character</p>
        </div>
      ) : (
        <div style={styles.characterList}>
          {characters.map((character, index) => (
            <div key={character.id} style={styles.characterCard}>
              <div style={styles.characterHeader}>
                <span style={styles.characterNumber}>Character {index + 1}</span>
                <button 
                  className="btn-danger" 
                  onClick={() => removeCharacter(character.id)}
                  style={styles.removeBtn}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Character name"
                    value={character.name}
                    onChange={(e) => handleChange(character.id, 'name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={character.role}
                    onChange={(e) => handleChange(character.id, 'role', e.target.value)}
                  >
                    {CHARACTER_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={character.type}
                  onChange={(e) => handleChange(character.id, 'type', e.target.value)}
                >
                  {CHARACTER_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Backstory</label>
                <textarea
                  placeholder="Character's background, history, motivations..."
                  value={character.backstory}
                  onChange={(e) => handleChange(character.id, 'backstory', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-muted mt-3" style={styles.note}>
        💡 The AI will automatically add minor characters as needed to support the story.
      </p>
    </div>
  )
}

const styles = {
  container: {
    marginBottom: '1.5rem',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  addBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center',
    gap: '0.5rem',
  },
  characterList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  characterCard: {
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid var(--border-primary)',
  },
  characterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  characterNumber: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--accent-secondary)',
  },
  removeBtn: {
    padding: '0.4rem 0.6rem',
    fontSize: '0.75rem',
  },
  note: {
    textAlign: 'center',
    padding: '0.75rem',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '8px',
  },
}

export default CharacterForm
